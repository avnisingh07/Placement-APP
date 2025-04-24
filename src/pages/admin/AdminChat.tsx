
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search } from 'lucide-react';
import ChatWindow, { ChatMessage } from '@/components/chat/ChatWindow';
import { toast } from 'sonner';

// Mock data for student chats
const mockStudentChats = {
  's1': {
    name: 'John Student',
    lastActive: '10 mins ago',
    messages: [
      {
        id: 1,
        sender: "other" as const,
        name: "John Student",
        text: "Hello, I had a question about the Software Engineering internship opportunity.",
        timestamp: "2025-04-16T14:30:00",
      },
      {
        id: 2,
        sender: "me" as const,
        name: "Admin",
        text: "Hi John! I'd be happy to answer your questions about the Software Engineering internship.",
        timestamp: "2025-04-16T14:35:00",
      },
      {
        id: 3,
        sender: "other" as const,
        name: "John Student",
        text: "Thanks! What technical skills are required for this position?",
        timestamp: "2025-04-16T14:38:00",
      },
      {
        id: 4,
        sender: "me" as const,
        name: "Admin",
        text: "For this internship, we're looking for candidates with experience in JavaScript, React, and Node.js. Knowledge of database technologies like MongoDB or PostgreSQL is a plus.",
        timestamp: "2025-04-16T14:45:00",
      }
    ]
  },
  's2': {
    name: 'Sarah Johnson',
    lastActive: '3 hrs ago',
    messages: [
      {
        id: 1,
        sender: "other" as const,
        name: "Sarah Johnson",
        text: "Hi there! I'm interested in the UX Design position.",
        timestamp: "2025-04-16T10:15:00",
      }
    ]
  },
  's3': {
    name: 'Michael Lee',
    lastActive: 'Yesterday',
    messages: [
      {
        id: 1,
        sender: "other" as const,
        name: "Michael Lee",
        text: "Good morning! I have some questions about the data science internship.",
        timestamp: "2025-04-15T09:30:00",
      }
    ]
  }
};

const AdminChat = () => {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('s1');
  const [studentChats, setStudentChats] = useState<Record<string, {
    name: string;
    lastActive: string;
    messages: ChatMessage[];
  }>>(mockStudentChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('adminStudentChats');
    if (savedChats) {
      setStudentChats(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminStudentChats', JSON.stringify(studentChats));
  }, [studentChats]);

  const filteredStudents = Object.entries(studentChats).filter(([id, data]) => 
    data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMsg = {
      id: studentChats[selectedStudent].messages.length + 1,
      sender: "me" as const,
      name: user?.name || "Admin User",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setStudentChats(prev => ({
      ...prev,
      [selectedStudent]: {
        ...prev[selectedStudent],
        messages: [...prev[selectedStudent].messages, newMsg]
      }
    }));
    
    toast.success(`Message sent to ${studentChats[selectedStudent].name}`);
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Chat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Students</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y">
                {filteredStudents.map(([id, data]) => (
                  <div 
                    key={id}
                    className={`p-4 ${selectedStudent === id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted/50 cursor-pointer'}`}
                    onClick={() => setSelectedStudent(id)}
                  >
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">Last message: {data.lastActive}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Window */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>{studentChats[selectedStudent]?.name || "Select a student"}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <ChatWindow 
                chatPartner={studentChats[selectedStudent]?.name || "Student"}
                initialMessages={[]}
                messages={studentChats[selectedStudent]?.messages || []}
                onSendMessage={handleSendMessage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
