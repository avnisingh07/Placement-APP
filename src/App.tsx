
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentOpportunities from "./pages/student/StudentOpportunities";
import StudentResume from "./pages/student/StudentResume";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Notifications from "./pages/shared/Notifications";
import StudentReminders from "./pages/student/StudentReminders";
import StudentChat from "./pages/student/StudentChat";
import StudentSettings from "./pages/student/StudentSettings";
import AdminReminders from "./pages/admin/AdminReminders";
import AdminChat from "./pages/admin/AdminChat";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOpportunities from "./pages/admin/AdminOpportunities";

const queryClient = new QueryClient();

// Protected route for authenticated users
const ProtectedRoute = ({ 
  children,
  requiredRole
}: { 
  children: JSX.Element,
  requiredRole?: 'student' | 'admin' | null
}) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for role-specific access if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="opportunities" element={<StudentOpportunities />} />
        <Route path="resume" element={<StudentResume />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reminders" element={<StudentReminders />} />
        <Route path="chat" element={<StudentChat />} />
        <Route path="settings" element={<StudentSettings />} />
        {/* Additional student routes would go here */}
      </Route>
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reminders" element={<AdminReminders />} />
        <Route path="opportunities" element={<AdminOpportunities />} />
        <Route path="chat" element={<AdminChat />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Additional admin routes would go here */}
      </Route>
      
      {/* Default route - redirect based on role */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
