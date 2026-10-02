"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Compass, Trophy, ArrowLeft, CheckCircle2, XCircle, Zap } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchQuiz() {
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
    fetchQuiz();
  }, [id]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    const currentQuestion = pack.questions[currentIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 < pack.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      // Үр дүнг бэкэнд рүү илгээж XP / Coins нэмэх
      try {
        const finalScore = score + (selectedOption === pack.questions[currentIndex].correctAnswer ? 1 : 0);
        const accuracy = Math.round((finalScore / pack.questions.length) * 100);

        await fetch("http://localhost:5000/api/user/complete-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packId: id, accuracy }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Уншиж байна...</div>;
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-slate-500">Сорил олдсонгүй эсвэл асуулт байхгүй байна.</p>
        <button onClick={() => router.push("/")} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs">
          Буцах
        </button>
      </div>
    );
  }

  const totalQuestions = pack.questions.length;
  const currentQuestion = pack.questions[currentIndex];
  const finalAccuracy = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans w-full flex justify-center">
      <div className="w-full max-w-3xl min-h-screen p-6 md:p-12 flex flex-col justify-between mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 mx-6 bg-slate-100 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + (isFinished ? 1 : 0)) / totalQuestions) * 100}%` }}
            ></div>
          </div>

          <span className="font-black text-slate-400 text-sm">{currentIndex + 1}/{totalQuestions}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center py-8">
          {!isFinished ? (
            <div className="flex flex-col gap-8 w-full">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option: string, index: number) => {
                  let borderStyle = "border-slate-200 bg-white hover:border-emerald-500";
                  if (selectedOption === index) {
                    borderStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900";
                  }
                  if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                      borderStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (selectedOption === index && index !== currentQuestion.correctAnswer) {
                      borderStyle = "border-red-500 bg-red-50 text-red-900";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      className={`p-5 rounded-2xl border-2 font-black text-sm text-left transition-all shadow-sm ${borderStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
              <div className="w-32 h-32 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center shadow-inner">
                <Trophy className="w-16 h-16 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">Сорил амжилттай дууслаа!</h1>
                <p className="text-sm font-bold text-slate-500">
                  Таны зөв хариултын нарийвчлал (Accuracy): <span className="text-emerald-600 font-black text-base">{finalAccuracy}%</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between w-full">
          {!isFinished ? (
            <button
              onClick={isAnswered ? handleNext : handleCheck}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg transition-transform active:scale-95 ${
                selectedOption === null 
                  ? "bg-slate-200 cursor-not-allowed shadow-none" 
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
              }`}
            >
              {isAnswered ? "Дараагийнх" : "Шалгах"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm text-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
            >
              Үндсэн хуудас руу буцах
            </button>
          )}
        </div>
      </div>
    </div>
  );
}