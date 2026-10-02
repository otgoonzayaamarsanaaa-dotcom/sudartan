"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Trophy, CheckCircle, Lock, Star, Crown, Zap, User, Compass, ShoppingBag, Map, BookOpen, Coins, Sparkles } from "lucide-react";

export default function RoadmapPage() {
  const [user, setUser] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("http://localhost:5000/api/user/profile");
        const userContentType = userRes.headers.get("content-type");
        if (userContentType && userContentType.includes("application/json")) {
          const userData = await userRes.json();
          if (userData.success) {
            setUser(userData.user);
          }
        }

        const packsRes = await fetch("http://localhost:5000/api/quiz-packs");
        const packsContentType = packsRes.headers.get("content-type");
        if (packsContentType && packsContentType.includes("application/json")) {
          const packsData = await packsRes.json();
          if (packsData.success) {
            setPacks(packsData.packs || []);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const unitStyles = [
    { bgColor: "bg-emerald-500", borderColor: "border-emerald-600" },
    { bgColor: "bg-sky-500", borderColor: "border-sky-600" },
    { bgColor: "bg-purple-500", borderColor: "border-purple-600" },
    { bgColor: "bg-orange-500", borderColor: "border-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans w-full flex justify-center">
      {/* Sidebar */}
      <div className="w-64 min-h-screen border-r-2 border-slate-200 p-6 flex flex-col justify-between fixed top-0 left-0 bg-white z-20 hidden md:flex">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 font-black text-emerald-600 text-xl">
            <Zap className="w-7 h-7 fill-emerald-500 text-white" />
            <span>Leaderboard</span>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <Compass className="w-6 h-6" />
              <span>Сурах</span>
            </Link>
            <Link href="/roadmap" className="flex items-center gap-3 p-3.5 rounded-2xl text-emerald-600 bg-emerald-50 font-black text-base">
              <Map className="w-6 h-6" />
              <span>Roadmap</span>
            </Link>
            <Link href="/shop" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span>Дэлгүүр</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <Trophy className="w-6 h-6" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <User className="w-6 h-6" />
              <span>Профайл</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen p-4 md:p-10 flex justify-center">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10">
          
          {/* Төв хэсэг: Урт дараалсан аялал (Path) */}
          <main className="flex-1 space-y-12">
            
            {/* Top Profile Header Bar */}
            <header className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-200 flex items-center justify-between sticky top-4 z-30">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="flex items-center gap-2 text-orange-500 font-black text-base md:text-xl">
                  <Flame className="w-7 h-7 fill-orange-500" />
                  <span>{user?.streak ?? 0} Өдөр</span>
                </div>
                <div className="flex items-center gap-2 text-sky-500 font-black text-base md:text-xl">
                  <Zap className="w-7 h-7 fill-sky-500 text-white" />
                  <span>{user?.xp ?? 0} XP</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-black text-base md:text-xl">
                  <Coins className="w-7 h-7 fill-amber-400 text-amber-500" />
                  <span>{user?.coins ?? 0}</span>
                </div>
              </div>

              {/* Хэрэглэгчийн нэр, зураг бүхий хэсэг */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <h2 className="text-sm font-black text-slate-900">{user?.name || "Хэрэглэгч"}</h2>
                  <p className="text-xs font-bold text-slate-400">{user?.email || "user@mail.com"}</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-white text-lg font-black flex items-center justify-center shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "Х"}
                </div>
              </div>
            </header>

            {/* Units Sequence */}
            {loading ? (
              <div className="text-center py-20 font-bold text-slate-400">Уншиж байна...</div>
            ) : packs.length === 0 ? (
              <div className="text-center py-20 font-bold text-slate-400">Дүрэм олдсонгүй</div>
            ) : (
              packs.map((pack, unitIndex) => {
                const style = unitStyles[unitIndex % unitStyles.length];
                const levels = pack.levels || [{ title: pack.title, status: pack.status || "current", type: "normal" }];

                return (
                  <section key={pack._id || unitIndex} className="space-y-8">
                    
                    {/* Unit Header Card */}
                    <div className={`${style.bgColor} text-white p-8 rounded-3xl shadow-lg border-b-8 ${style.borderColor} space-y-2 sticky top-24 z-20`}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-black">{pack.title || `Нэгж ${unitIndex + 1}`}</h2>
                        <BookOpen className="w-8 h-8 opacity-80" />
                      </div>
                      <p className="text-white/90 font-semibold text-sm md:text-base">
                        {pack.description || "Монгол хэлний дүрмийн цогц хичээлүүд болон сорилтууд"}
                      </p>
                    </div>

                    {/* Зиг-заг Урт Зам */}
                    <div className="flex flex-col items-center space-y-10 py-6 relative">
                      {levels.map((lvl: any, index: number) => {
                        const offsets = ["translate-x-0", "translate-x-16", "translate-x-28", "translate-x-16", "translate-x-0", "-translate-x-16", "-translate-x-28", "-translate-x-16"];
                        const offsetClass = offsets[index % offsets.length];

                        let buttonBg = "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed";
                        let icon = <Lock className="w-12 h-12 text-slate-400" />;
                        
                        const isCurrent = lvl.status === "current" || (unitIndex === 0 && index === 0 && !lvl.status);
                        const isCompleted = lvl.status === "completed";

                        if (isCompleted) {
                          buttonBg = "bg-emerald-500 border-emerald-600 hover:bg-emerald-600 shadow-emerald-200/50";
                          icon = <CheckCircle className="w-12 h-12 text-white" />;
                        } else if (isCurrent || lvl.status === "unlocked") {
                          buttonBg = "bg-sky-500 border-sky-600 hover:bg-sky-600 shadow-sky-300/50 scale-110 ring-8 ring-sky-100";
                          icon = lvl.type === "star" ? <Star className="w-12 h-12 text-white animate-bounce" /> : <Zap className="w-12 h-12 text-white animate-bounce" />;
                        } else {
                          if (lvl.type === "trophy") icon = <Trophy className="w-12 h-12 text-slate-400" />;
                          if (lvl.type === "star") icon = <Crown className="w-12 h-12 text-slate-400" />;
                        }

                        return (
                          <div key={lvl._id || index} className={`flex flex-col items-center gap-3 transition-transform ${offsetClass}`}>
                            {isCurrent || isCompleted || lvl.status === "unlocked" ? (
                              <Link href={`/roadmap/${pack._id}`}>
                                <button className={`w-28 h-28 rounded-full border-b-8 flex items-center justify-center shadow-xl transition transform active:scale-90 ${buttonBg}`}>
                                  {icon}
                                </button>
                              </Link>
                            ) : (
                              <button disabled className={`w-28 h-28 rounded-full border-b-8 flex items-center justify-center shadow-xl ${buttonBg}`}>
                                {icon}
                              </button>
                            )}

                            <span className="text-xs md:text-sm font-extrabold text-slate-700 bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-200 text-center max-w-[180px]">
                              {lvl.title || pack.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </section>
                );
              })
            )}

          </main>

          {/* Баруун талын Sidebar (Өдрийн даалгавар, Лиг) */}
          <aside className="w-full lg:w-80 space-y-8 hidden lg:block">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6 sticky top-24">
              
              {/* Өдрийн даалгавар */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 font-black text-slate-800 text-xl">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span>Өдрийн даалгавар</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-1">
                      <span>10 Даалгавар бодох</span>
                      <span>4 / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                      <div className="bg-yellow-400 h-full w-2/5 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-1">
                      <span>50 XP цуглуулах</span>
                      <span>30 / 50</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                      <div className="bg-sky-400 h-full w-3/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Тэргүүлэгчдийн самбар */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 font-black text-slate-800 text-xl">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <span>Лигийн эрэмбэ</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}