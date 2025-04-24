import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home,
  Briefcase,
  FileText,
  Bell,
  Calendar,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, isActive, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive: active }) =>
      cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        'hover:bg-primary/10',
        active || isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
      )
    }
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = user?.role === 'student'
    ? [
        { icon: Home, label: 'Dashboard', to: '/student' },
        { icon: Briefcase, label: 'Opportunities', to: '/student/opportunities' },
        { icon: FileText, label: 'Resume', to: '/student/resume' },
        { icon: Bell, label: 'Notifications', to: '/student/notifications' },
        { icon: Calendar, label: 'Reminders', to: '/student/reminders' },
        { icon: MessageSquare, label: 'Chat', to: '/student/chat' },
        { icon: Settings, label: 'Settings', to: '/student/settings' },
      ]
    : [
        { icon: Home, label: 'Dashboard', to: '/admin' },
        { icon: Bell, label: 'Notifications', to: '/admin/notifications' },
        { icon: Calendar, label: 'Reminders', to: '/admin/reminders' },
        { icon: MessageSquare, label: 'Chat', to: '/admin/chat' },
        { icon: Settings, label: 'Settings', to: '/admin/settings' },
      ];

  const closeSidebar = () => setIsSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold">PMS</h2>
        <p className="text-sm text-muted-foreground">{user?.role === 'student' ? 'Student Portal' : 'Admin Portal'}</p>
      </div>
      
      <div className="px-3 flex-1">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              onClick={isMobile ? closeSidebar : undefined}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {!isMobile && (
        <aside className="w-64 border-r bg-card hidden md:block">
          <SidebarContent />
        </aside>
      )}

      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="p-4 border-b md:hidden flex items-center justify-center">
          <h1 className="font-bold text-xl">Placement Management System</h1>
        </header>
        
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
