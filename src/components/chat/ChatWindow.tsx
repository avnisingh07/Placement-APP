
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, CircleUserRound } from "lucide-react";

export interface ChatMessage {
  id: number;
  sender: "me" | "other";
  name: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  chatPartner: string;
  initialMessages: ChatMessage[];
  messages?: ChatMessage[];  
  onSendMessage?: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatPartner, initialMessages, messages, onSendMessage }) => {
  const [chatMessages, setMessages] = useState<ChatMessage[]>(messages || initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // If messages prop changes, update the internal state
  useEffect(() => {
    if (messages) {
      setMessages(messages);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    if (onSendMessage) {
      onSendMessage(input);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "me",
          name: "You",
          text: input,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    
    setInput("");
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 items-end ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "other" && (
              <div className="p-1 bg-secondary/10 rounded-full">
                <CircleUserRound className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className={`px-3 py-2 rounded-2xl shadow-md text-sm max-w-[75%] ${msg.sender === "me"
              ? "bg-primary text-primary-foreground"
              : "bg-white/90"
              }`}>
              <div>{msg.text}</div>
              <div className="text-[10px] text-muted-foreground mt-1 text-right">
                {msg.name} • {formatTimestamp(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={`Message ${chatPartner}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} className="px-6">Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
