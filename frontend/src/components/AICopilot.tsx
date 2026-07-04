"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Brain, ArrowRight, CornerDownLeft } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  recommendations?: string[];
}

export default function AICopilot() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "copilot",
      text: "Hello! I am your **InsightIQ AI Copilot** powered by Gemini Enterprise Agent. I can help analyze your datasets, explain anomalies, and forecast metrics. Ask me anything about your current data!",
      recommendations: [
        "Why are sales declining?",
        "Predict next month's revenue.",
        "Explain anomalies.",
        "Generate executive summary."
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: textToSend }
    ]);
    setQuery("");
    setLoading(true);

    try {
      const token = localStorage.getItem("insightiq-token");
      const res = await fetch(`https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/ai/copilot?query=${encodeURIComponent(textToSend)}&dataset_id=0`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: "copilot",
          text: data.insight,
          recommendations: data.recommendations
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-err-${Date.now()}`,
          sender: "copilot",
          text: "I'm sorry, I couldn't reach the AI Insight service right now. Please verify your backend server connection."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="glass rounded-2xl border flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h3 className="font-bold text-sm tracking-tight dark:text-white flex items-center gap-1.5">
              Gemini AI Copilot <Sparkles className="w-3.5 h-3.5 text-nvidia fill-nvidia/20" />
            </h3>
            <p className="text-[10px] text-slate-500">Connected to BigQuery Intelligence Catalog</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 dark:text-slate-200 border dark:border-slate-800"
              }`}
            >
              {/* Render markdown style headings and lists simply */}
              <div className="prose prose-sm dark:prose-invert leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>
              
              {/* Quick Suggestion Pills */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.recommendations.map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(rec)}
                      className="text-xs bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-full px-3 py-1.5 font-medium transition-all duration-200 hover:scale-[1.03] flex items-center gap-1 shadow-sm"
                    >
                      {rec} <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800/80 border rounded-2xl p-4 flex items-center gap-2 max-w-[85%]">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Gemini is processing your query...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="flex gap-2 relative items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Copilot to forecast sales or check anomaly indicators..."
            className="w-full bg-white dark:bg-slate-950 border rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 p-2 rounded-lg bg-primary hover:bg-primary-hover text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all duration-200 shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
