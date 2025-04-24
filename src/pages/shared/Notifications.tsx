
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Search, Trash2, Filter } from 'lucide-react';

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    title: 'New Job Opportunity',
    message: 'A new Frontend Developer position has been posted that matches your profile',
    date: '2025-04-20T10:30:00',
    read: false,
    category: 'opportunity',
  },
  {
    id: 2,
    title: 'Application Status Update',
    message: 'Your application for Backend Software Engineer at Innovate Solutions has been reviewed',
    date: '2025-04-19T14:15:00',
    read: true,
    category: 'application',
  },
  {
    id: 3,
    title: 'Resume Feedback',
    message: 'The placement department has provided feedback on your resume',
    date: '2025-04-18T09:45:00',
    read: false,
    category: 'resume',
  },
  {
    id: 4,
    title: 'Upcoming Deadline',
    message: 'Reminder: The application deadline for WebWizards is tomorrow at 11:59 PM',
    date: '2025-04-17T16:00:00',
    read: true,
    category: 'deadline',
  },
  {
    id: 5,
    title: 'Interview Invitation',
    message: 'You have been invited for an interview with TechCorp Inc. for the Frontend Developer position',
    date: '2025-04-16T11:20:00',
    read: false,
    category: 'interview',
  },
];

// Mock admin notifications
const mockAdminNotifications = [
  {
    id: 1,
    title: 'New Student Applications',
    message: '15 new applications have been received for the Frontend Developer position',
    date: '2025-04-20T10:30:00',
    read: false,
    category: 'application',
  },
  {
    id: 2,
    title: 'Resume Review Request',
    message: 'Student John Doe has requested feedback on their updated resume',
    date: '2025-04-19T14:15:00',
    read: true,
    category: 'resume',
  },
  {
    id: 3,
    title: 'New Company Partnership',
    message: 'InnoTech Corp has joined our placement partners network',
    date: '2025-04-18T09:45:00',
    read: false,
    category: 'partner',
  },
  {
    id: 4,
    title: 'Deadline Alert',
    message: 'Final interview schedules need to be confirmed by tomorrow',
    date: '2025-04-17T16:00:00',
    read: true,
    category: 'deadline',
  },
  {
    id: 5,
    title: 'Student Inquiry',
    message: 'Jane Smith has questions regarding the Backend Engineer position requirements',
    date: '2025-04-16T11:20:00',
    read: false,
    category: 'inquiry',
  },
];

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(
    user?.role === 'admin' ? mockAdminNotifications : mockNotifications
  );
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Filter notifications based on search query, read status, and category
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read) ||
      (filter === notification.category);
    
    return matchesSearch && matchesFilter;
  });

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Format date as relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin} min ago`;
    } else if (diffMin < 1440) {
      return `${Math.round(diffMin / 60)} hours ago`;
    } else {
      return `${Math.round(diffMin / 1440)} days ago`;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn bg-gradient-to-br from-primary/10 via-white/30 to-secondary/10 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary drop-shadow">Notifications</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Email Notification Setting */}
      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              id="email-notifications"
            />
            <label
              htmlFor="email-notifications"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Send notifications to my email
            </label>
          </div>
        </CardContent>
      </Card>
      
      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <Card 
              key={notification.id}
              className={`hover-scale transition-colors border-2 border-primary/10 ${notification.read ? 'bg-card' : 'bg-gradient-to-l from-primary/10 via-primary/5 to-white/70'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`p-2 rounded-full shadow-sm
                      ${notification.read
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.date)}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                      </Badge>
                      <div className="flex-1"></div>
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          Mark as read
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search or filters' : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;

// The file is getting long. Please consider splitting this Notifications code into smaller components for easier maintenance and better performance.
