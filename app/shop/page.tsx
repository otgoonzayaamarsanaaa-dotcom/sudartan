"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Trophy, Flame, User, Compass, Mail, Coins, ShoppingBag, Shield, Map } from "lucide-react";

export default function ShopPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile");
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleBuy = async (itemType: string, cost: number) => {
    const confirmBuy = window.confirm("Та итгэлтэй байна уу?");
    if (!confirmBuy) return;

    if (!user || user.coins < cost) {
      setMessage({ text: "Таны үлдэгдэл хүрэлцэхгүй байна", type: "error" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, itemType, cost }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setMessage({ text: "Амжилттай боллоо", type: "success" });
      } else {
        setMessage({ text: data.message || "Үлдэгдэл хүрэлцэхгүй байна", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Сервертэй холбогдоход алдаа гарлаа", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans w-full flex justify-center">
      <div className="w-64 min-h-screen border-r-2 border-slate-100 p-6 flex flex-col justify-between fixed top-0 left-0 bg-white z-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 font-black text-emerald-600 text-xl">
            <Zap className="w-7 h-7 fill-emerald-500 text-white" />
            <span>Shop</span>
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
            <Link href="/shop" className="flex items-center gap-3 p-3.5 rounded-2xl text-emerald-600 bg-emerald-50 font-black text-base">
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

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-bold text-center w-full ${
              message.type === "success" 
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 flex flex-col gap-6 shadow-sm min-h-[680px] justify-between lg:col-span-2">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base">Дэлгүүрийн бараанууд</h3>
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50/50 rounded-3xl p-6 border-2 border-slate-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
                        <Flame className="w-7 h-7 fill-amber-400 text-amber-500" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Streak Freeze</h3>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed">Нэг өдөр хичээл хийж амжаагүй үед таны streak-ийг хамгаална.</p>
                    </div>
                    <button 
                      onClick={() => handleBuy("freeze", 200)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-md transition-transform active:scale-95"
                    >
                      Авах (200 зоос)
                    </button>
                  </div>

                  <div className="bg-slate-50/50 rounded-3xl p-6 border-2 border-slate-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                        <Shield className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Double or Nothing</h3>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed">7 хоногийн турш streak-ээ алдалгүй үргэлжлүүлээд зоосоо хоёр нугалж аваарай.</p>
                    </div>
                    <button 
                      onClick={() => handleBuy("double", 300)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-md transition-transform active:scale-95"
                    >
                      Авах (300 зоос)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center pb-2 text-xs font-bold text-slate-400">
                Зоосоо ашиглан урамшуулал аваарай
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[680px] p-12 gap-8 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <div className="w-40 h-40 rounded-full bg-amber-100 border-4 border-amber-500 flex items-center justify-center shadow-inner text-amber-600">
                <Coins className="w-20 h-20" />
              </div>

              <div className="space-y-4 max-w-sm">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  Таны зоос: {user?.coins || 0}
                </h1>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  Сорил бөглөж зоос цуглуулан өөрийн streak болон амжилтаа хамгаалаарай.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}