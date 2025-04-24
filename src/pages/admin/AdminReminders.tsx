import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminReminders = () => {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, task: 'Review applications', completed: false },
    { id: 2, task: 'Schedule interviews', completed: true },
  ]);

  const toggleReminder = (id: number) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  const [newTask, setNewTask] = useState('');

  const addReminder = () => {
    if (newTask.trim() !== '') {
      const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
      setReminders([...reminders, { id: newId, task: newTask, completed: false }]);
      setNewTask('');
      setOpen(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Reminder</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Enter the task you need to remember.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task" className="text-right">
                  Task
                </Label>
                <Input id="task" value={newTask} onChange={(e) => setNewTask(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={addReminder}>
                Add Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ul>
        {reminders.map((reminder) => (
          <li key={reminder.id} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <Checkbox
                id={`reminder-${reminder.id}`}
                checked={reminder.completed}
                onCheckedChange={() => toggleReminder(reminder.id)}
              />
              <Label htmlFor={`reminder-${reminder.id}`} className="ml-2 cursor-pointer">
                {reminder.task}
              </Label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReminders;
