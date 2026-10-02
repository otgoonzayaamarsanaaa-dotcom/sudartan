"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        setError(data.message || "Нэвтрэхэд алдаа гарлаа");
      }
    } catch (err) {
      setError("Сервертэй холбогдоход алдаа гарлаа");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-emerald-500/20 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Нэвтрэх</h1>
          <p className="text-xs font-bold text-slate-500">Та бүртгэлтэй мэдээллээрээ нэвтрэнэ үү.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700">Имэйл</label>
            <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition-all">
              <Mail className="w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700">Нууц үг</label>
            <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition-all">
              <Lock className="w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 mt-2"
          >
            Нэвтрэх
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-500">
            Бүртгэлгүй юу?{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}