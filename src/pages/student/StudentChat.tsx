
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ChatWindow, { ChatMessage } from '@/components/chat/ChatWindow';
import { toast } from 'sonner';

// Mock data for chats
const initialMessages = [
  {
    id: 1,
    sender: "me" as const,
    name: "Student",
    text: "Hello, I had a question about the Software Engineering internship opportunity.",
    timestamp: "2025-04-16T14:30:00",
  },
  {
    id: 2,
    sender: "other" as const,
    name: "Admin User",
    text: "Hi! I'd be happy to answer your questions about the Software Engineering internship.",
    timestamp: "2025-04-16T14:35:00",
  },
  {
    id: 3,
    sender: "me" as const,
    name: "Student",
    text: "Thanks! What technical skills are required for this position?",
    timestamp: "2025-04-16T14:38:00",
  },
  {
    id: 4,
    sender: "other" as const,
    name: "Admin User",
    text: "For this internship, we're looking for candidates with experience in JavaScript, React, and Node.js. Knowledge of database technologies like MongoDB or PostgreSQL is a plus.",
    timestamp: "2025-04-16T14:45:00",
  },
];

const StudentChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Load saved messages from localStorage on component mount
  useEffect(() => {
    const userId = user?.id || 'default';
    const savedMessages = localStorage.getItem(`studentChat_${userId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(initialMessages);
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      const userId = user?.id || 'default';
      localStorage.setItem(`studentChat_${userId}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "me" as const,
        name: user?.name || "Student",
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, message]);
      setNewMessage("");
      
      // Mock response from admin after a delay
      setTimeout(() => {
        const responseMessage = {
          id: messages.length + 2,
          sender: "other" as const,
          name: "Admin User",
          text: "Thanks for your message. I'll get back to you shortly.",
          timestamp: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, responseMessage]);
        toast.success("New message from Admin");
      }, 1000);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Chat with Career Services</h1>
      
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="border-b">
          <CardTitle>Admin User</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <ChatWindow 
            chatPartner="Admin User" 
            initialMessages={initialMessages}
            messages={messages}
            onSendMessage={(text) => {
              const message = {
                id: messages.length + 1,
                sender: "me" as const,
                name: user?.name || "Student",
                text,
                timestamp: new Date().toISOString(),
              };
              setMessages([...messages, message]);
              
              // Mock response
              setTimeout(() => {
                const responseMessage = {
                  id: messages.length + 2,
                  sender: "other" as const,
                  name: "Admin User",
                  text: "Thanks for your message. I'll get back to you shortly.",
                  timestamp: new Date().toISOString(),
                };
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                toast.success("New message from Admin");
              }, 1000);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentChat;
