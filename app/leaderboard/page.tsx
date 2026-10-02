"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Trophy, Flame, User, Compass, Mail, Coins, ShoppingBag, Map } from "lucide-react";

export default function LeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("http://localhost:5000/api/user/profile");
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
        }

        const lbRes = await fetch("http://localhost:5000/api/leaderboard");
        const lbData = await lbRes.json();
        if (lbData.success) {
          setLeaderboard(lbData.leaderboard || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans w-full flex justify-center">
      {/* Sidebar */}
      <div className="w-64 min-h-screen border-r-2 border-slate-100 p-6 flex flex-col justify-between fixed top-0 left-0 bg-white z-10">
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
            <Link href="/roadmap" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <Map className="w-6 h-6" />
              <span>Roadmap</span>
            </Link>
            <Link href="/shop" className="flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 font-black text-base transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span>Дэлгүүр</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 p-3.5 rounded-2xl text-emerald-600 bg-emerald-50 font-black text-base">
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
      <div className="flex-1 ml-64 min-h-screen p-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col gap-8 mx-auto">
          <div className="flex items-center justify-between bg-white p-8 rounded-3xl border-2 border-emerald-500/20 shadow-sm w-full">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black shadow-inner">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">{user?.name || "Хэрэглэгч"}</h2>
                <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-4 h-4" />
                  {user?.email || "user@mail.com"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-amber-50 px-5 py-3 rounded-2xl border border-amber-200">
                <Flame className="w-6 h-6 fill-amber-400 text-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-amber-600">Streak</span>
                  <span className="text-sm font-black text-amber-800">{user?.streak || 0} хоног</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200">
                <Zap className="w-6 h-6 fill-emerald-500 text-white" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-emerald-600">XP</span>
                  <span className="text-sm font-black text-emerald-800">{user?.xp || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 px-5 py-3 rounded-2xl border border-amber-200">
                <Coins className="w-6 h-6 text-amber-500 fill-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-amber-600">Зоос</span>
                  <span className="text-sm font-black text-amber-800">{user?.coins || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 flex flex-col gap-6 shadow-sm min-h-[680px] justify-between lg:col-span-2">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base">Шилдэг тоглогчид (XP-гээр)</h3>
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-2">
                  {loading ? (
                    <div className="text-center py-20 text-sm font-bold text-slate-400">Уншиж байна...</div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-20 text-sm font-bold text-slate-400">Мэдээлэл олдсонгүй</div>
                  ) : (
                    leaderboard.map((item: any, index: number) => {
                      let rankBadge = "bg-slate-100 text-slate-600";
                      if (index === 0) rankBadge = "bg-amber-400 text-white shadow-md";
                      else if (index === 1) rankBadge = "bg-slate-300 text-white shadow-md";
                      else if (index === 2) rankBadge = "bg-amber-600 text-white shadow-md";

                      return (
                        <div 
                          key={item._id || index} 
                          className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:border-emerald-500/50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${rankBadge}`}>
                              {index + 1}
                            </div>
                            <span className="font-black text-sm text-slate-800">{item.name || "Хэрэглэгч"}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                            <Zap className="w-4 h-4 fill-emerald-500 text-white" />
                            <span className="font-black text-xs text-emerald-800">{item.xp} XP</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="text-center pb-2 text-xs font-bold text-slate-400">
                Ранк болон XP жагсаалт
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[680px] p-12 gap-8 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <div className="w-40 h-40 rounded-full bg-amber-100 border-4 border-amber-500 flex items-center justify-center shadow-inner">
                <Trophy className="w-20 h-20 text-amber-600" />
              </div>

              <div className="space-y-4 max-w-sm">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  Өрсөлдөөгөө нэмээрэй!
                </h1>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  Илүү олон сорил бөглөж, XP цуглуулан тэргүүлэгчдийн жагсаалтын эхэнд бичигдээрэй.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}