"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function ChatInput({ value, onChange, onSend, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`border-t p-4 ${isFocused ? "bg-muted/50" : ""}`}>
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={disabled || isLoading}>
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none pr-10"
            disabled={disabled || isLoading || !value.trim()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1 h-8 w-8"
            disabled={disabled || isLoading}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="icon"
          className="h-10 w-10 shrink-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
          onClick={onSend}
          disabled={disabled || isLoading || !value.trim()}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}