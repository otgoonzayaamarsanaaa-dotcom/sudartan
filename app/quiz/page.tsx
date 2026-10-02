"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Lock } from "lucide-react";
export default function QuizHubPage() {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizPacks() {
      try {
        const res = await fetch("http://localhost:5000/api/quiz-packs");
        const data = await res.json();
        if (data.success) {
          setPacks(data.packs);
        }
      } catch (error) {
        console.error("Багц татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizPacks();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans w-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border-2 border-emerald-500/20 shadow-sm">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-extrabold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Буцах
          </Link>
          <div className="flex items-center gap-2 font-black text-emerald-600 text-lg">
            <Zap className="w-6 h-6 fill-emerald-500 text-white" />
            <span>Сорилтын багцууд</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Уншиж байна...</div>
        ) : packs.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="font-bold text-slate-500">Одоогоор сорилын багц олдсонгүй.</p>
            <p className="text-xs text-slate-400 mt-1"></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packs.map((pack) => {
              const isLocked = pack.status === "locked";
              const packId = pack._id; // MongoDB-ийн автоматаар үүсгэсэн _id

              return (
                <div 
                  key={packId}
                  className={`relative bg-white rounded-3xl p-6 border-2 border-emerald-500/20 shadow-lg flex flex-col justify-between gap-6 overflow-hidden ${
                    isLocked ? "opacity-75" : "hover:border-emerald-500 transition-all"
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl ${pack.color || "bg-emerald-500"} text-white flex items-center justify-center font-black shadow-md`}>
                      ⚡
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{pack.title}</h3>
                    <p className="text-xs font-bold text-slate-500">{pack.description}</p>
                  </div>

                  <div>
                    {isLocked ? (
                      <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200">
                        <Lock className="w-4 h-4" />
                        Түгжигдсэн
                      </button>
                    ) : (
                      <Link 
                        href={`/quiz/${packId}`}
                        className={`w-full py-3 ${pack.color || "bg-emerald-500"} hover:opacity-90 text-white rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95`}
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        Сорил эхлэх
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}