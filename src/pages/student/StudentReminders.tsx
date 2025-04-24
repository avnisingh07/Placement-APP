
import React, { useState, useEffect } from "react";
import ReminderList from "@/components/reminders/ReminderList";
import { Calendar } from "lucide-react";
import { Reminder } from "@/components/reminders/ReminderList";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const mockReminders: Reminder[] = [
  { id: 1, title: "Update Resume", deadline: "2025-04-25", isCompleted: false },
  { id: 2, title: "Apply to TechCorp", deadline: "2025-04-28", isCompleted: false },
  { id: 3, title: "Practice Interview", deadline: "2025-04-30", isCompleted: false },
];

const StudentReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const userId = user?.id || 'default';
    
    // First check for admin-pushed reminders
    const adminPushedReminders = localStorage.getItem('adminPushedReminders');
    let adminReminders: Reminder[] = [];
    if (adminPushedReminders) {
      adminReminders = JSON.parse(adminPushedReminders);
    }
    
    // Then check for user-specific reminders
    const savedReminders = localStorage.getItem(`studentReminders_${userId}`);
    if (savedReminders) {
      const userReminders = JSON.parse(savedReminders);
      // Merge admin and user reminders, avoiding duplicates
      const mergedReminders = [
        ...userReminders,
        ...adminReminders.filter(adminRem => 
          !userReminders.some(userRem => userRem.id === adminRem.id)
        )
      ];
      setReminders(mergedReminders);
    } else {
      // If no saved reminders, use mock data + admin reminders
      setReminders([...mockReminders, ...adminReminders]);
    }
    
    // Show toast for admin pushed reminders if they exist
    if (adminReminders.length > 0) {
      toast.info(`${adminReminders.length} reminders from Admin`);
    }
  }, [user]);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      const userId = user?.id || 'default';
      localStorage.setItem(`studentReminders_${userId}`, JSON.stringify(reminders));
    }
  }, [reminders, user]);

  const handleAdd = (reminder: Partial<Reminder>) => {
    setReminders((prev) => [
      ...prev,
      {
        ...reminder,
        id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1,
        isCompleted: false,
        deadline: reminder.deadline || new Date().toISOString().split('T')[0],
        title: reminder.title || "",
      },
    ]);
  };

  const handleComplete = (id: number) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
      )
    );
  };

  const handleDelete = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-5">
        <Calendar className="text-primary w-8 h-8" />
        <h1 className="text-3xl font-bold">Reminders</h1>
      </div>
      <ReminderList
        reminders={reminders}
        onToggleComplete={handleComplete}
        onDelete={handleDelete}
        onAdd={handleAdd}
        canAdd={true}
      />
    </div>
  );
};

export default StudentReminders;
