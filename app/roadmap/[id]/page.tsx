"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Compass, Trophy, User, ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPackDetail() {
      try {
        const res = await fetch(`http://localhost:5000/api/quiz-packs/${id}`);
        const data = await res.json();
        if (data.success) {
          setPack(data.pack);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPackDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans w-full flex">
      <div className="w-64 min-h-screen border-r-2 border-slate-100 p-6 flex flex-col justify-between fixed top-0 left-0 bg-white z-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 font-black text-emerald-600 text-lg cursor-pointer" onClick={() => router.push("/")}>
            <Compass className="w-6 h-6 fill-emerald-500 text-white" />
            <span>Сурах</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-2xl text-emerald-600 bg-emerald-50 font-black text-sm">
              <Compass className="w-6 h-6" />
              <span>Сурах</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-sm transition-colors">
              <Trophy className="w-6 h-6" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 p-3 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-sm transition-colors">
              <User className="w-6 h-6" />
              <span>Профайл</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-64 min-h-screen p-6 md:p-12 flex flex-col gap-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-slate-900">Дүрмийн хичээл</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Уншиж байна...</div>
        ) : !pack ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="font-bold text-slate-500">Мэдээлэл олдсонгүй.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900">{pack.title}</h2>
                <p className="text-xs font-bold text-slate-400">{pack.description}</p>
              </div>
            </div>

            <div className="border-t-2 border-slate-100 pt-6 flex flex-col gap-4">
              <h3 className="text-sm font-black text-slate-800">Дүрмийн тайлбар & Жишээ</h3>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                {pack.content || "Энэ сэдвийн дүрмийн тайлбар удахгүй нэмэгдэх болно."}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link
                href={`/quiz/${pack._id}`}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 text-center"
              >
                Сорил эхлэх
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}