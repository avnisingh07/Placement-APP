
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export interface Reminder {
  id: number;
  title: string;
  deadline: string;
  isCompleted: boolean;
}

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd?: (reminder: Partial<Reminder>) => void;
  canAdd?: boolean;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onToggleComplete,
  onDelete,
  onAdd,
  canAdd = false,
}) => {
  const [newReminderTitle, setNewReminderTitle] = React.useState('');
  const [newReminderDeadline, setNewReminderDeadline] = React.useState('');
  
  const handleToggleComplete = (id: number) => {
    onToggleComplete(id);
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      toast.success(
        reminder.isCompleted
          ? `Marked "${reminder.title}" as incomplete`
          : `Completed "${reminder.title}"!`
      );
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.success('Reminder deleted');
  };

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) {
      toast.error('Please enter a title for the reminder');
      return;
    }
    
    if (onAdd) {
      const deadline = newReminderDeadline || new Date().toISOString().split('T')[0];
      onAdd({
        title: newReminderTitle,
        deadline: deadline,
      });
      setNewReminderTitle('');
      setNewReminderDeadline('');
      toast.success('Reminder added successfully');
    }
  };

  const getFormattedDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return deadline;
    }
  };

  return (
    <div className="space-y-4">
      {canAdd && onAdd && (
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Add a new reminder..."
            value={newReminderTitle}
            onChange={(e) => setNewReminderTitle(e.target.value)}
            className="flex-1"
          />
          <Input
            type="date"
            value={newReminderDeadline}
            onChange={(e) => setNewReminderDeadline(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleAddReminder}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      )}
      
      {reminders.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No reminders yet. Add one to get started!
        </div>
      ) : (
        reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 border rounded-lg flex items-center gap-3 ${
              reminder.isCompleted ? 'bg-muted/30' : ''
            }`}
          >
            <Button
              variant="outline"
              size="icon"
              className={reminder.isCompleted ? 'bg-green-100 text-green-600' : ''}
              onClick={() => handleToggleComplete(reminder.id)}
            >
              {reminder.isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium ${
                  reminder.isCompleted ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {reminder.title}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {getFormattedDeadline(reminder.deadline)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(reminder.id)}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReminderList;
