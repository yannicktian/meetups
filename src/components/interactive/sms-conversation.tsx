"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import type { SmsMessage } from "@/lib/types";

type Props = {
  messages: SmsMessage[];
  autoPlay?: boolean;
};

export function SmsConversation({ messages, autoPlay = true }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const playNext = useCallback(() => {
    if (visibleCount >= messages.length) return;

    const nextMessage = messages[visibleCount];
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((c) => c + 1);
    }, nextMessage.delay);
  }, [visibleCount, messages]);

  useEffect(() => {
    if (autoPlay && visibleCount < messages.length) {
      const timer = setTimeout(playNext, visibleCount === 0 ? 500 : 300);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, visibleCount, messages.length, playNext]);

  const replay = () => {
    setVisibleCount(0);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-[#1a1a2e] rounded-[2rem] p-2 shadow-2xl border border-[var(--bg-surface-hover)]">
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 py-2 text-[10px] text-[var(--text-muted)]">
          <span>9:41</span>
          <div className="w-20 h-5 bg-black rounded-full" />
          <span>5G</span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--bg-surface-hover)]">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">Alpha</div>
            <div className="text-[10px] text-[var(--text-muted)]">Gojob Recruiter Assistant</div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto px-3 py-4 flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {messages.slice(0, visibleCount).map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "candidate"
                      ? "bg-[var(--accent)] text-white rounded-br-md"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[var(--bg-surface)] px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] rounded-full px-4 py-2">
            <span className="text-sm text-[var(--text-muted)] flex-1">Message...</span>
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-xs">&#9650;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replay button */}
      {visibleCount >= messages.length && (
        <motion.button
          className="mt-4 mx-auto block text-sm text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={replay}
        >
          Replay conversation
        </motion.button>
      )}
    </div>
  );
}
