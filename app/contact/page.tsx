"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/SessionContext";

export default function ContactPage() {
  const { session } = useSession();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!session?.user) return;

    const loadTickets = async () => {
      const { data } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setTickets(data || []);
    };

    loadTickets();
  }, [session]);

  const sendTicket = async () => {
    if (!session?.user) {
      alert("برای ارسال تیکت باید وارد شوید.");
      return;
    }

    if (!subject || !message) {
      alert("موضوع و پیام الزامی است.");
      return;
    }

    const { error } = await supabase.from("tickets").insert({
      user_id: session.user.id,
      subject,
      message,
    });

    if (error) {
      alert("مشکلی رخ داد.");
      return;
    }

    alert("تیکت با موفقیت ارسال شد!");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-12">

      {/* فرم ارسال تیکت */}
      <div className="bg-white shadow border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">ارتباط با ما</h1>

        <input
          className="w-full border rounded p-3 mb-4"
          placeholder="موضوع تیکت"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="w-full border rounded p-3 mb-4 h-40"
          placeholder="پیام شما..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendTicket}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
        >
          ارسال تیکت
        </button>
      </div>

      {/* لیست تیکت‌ها */}
      <div className="bg-white shadow border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">تیکت‌های شما</h2>

        {tickets.length === 0 && (
          <p className="text-gray-500">هیچ تیکتی ثبت نکرده‌اید.</p>
        )}

        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="border rounded p-4 bg-gray-50">
              <h3 className="font-bold text-lg">📌 {t.subject}</h3>

              <p className="mt-2">{t.message}</p>

              <p className="text-sm text-gray-500 mt-3">
                وضعیت: {t.status}
              </p>

              {t.admin_reply && (
                <div className="mt-4 p-3 rounded bg-green-100">
                  <p className="font-bold">پاسخ ادمین:</p>
                  <p>{t.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

