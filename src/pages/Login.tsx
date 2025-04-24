
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole, useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { user, login, loginWithGoogle, loginWithMicrosoft, isLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (user) {
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, role);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(role);
      toast.success('Login with Google successful!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      await loginWithMicrosoft(role);
      toast.success('Login with Microsoft successful!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Microsoft');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "#D3E4FD", // Soft, cool blue
      }}
    >
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="glass-card w-full">
          <CardHeader className="space-y-1">
            <h1 className="text-4xl font-extrabold text-primary drop-shadow mb-3">
              Placement Portal
            </h1>
            <CardDescription className="text-base text-muted-foreground">
              Simplify your campus journey.<br />Login as Student or Admin to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="student@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login as Student'}
                    </Button>
                  </form>
                </Form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                    Google
                  </Button>
                  <Button variant="outline" onClick={handleMicrosoftLogin} disabled={isLoading}>
                    Microsoft
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login as Admin'}
                    </Button>
                  </form>
                </Form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                    Google
                  </Button>
                  <Button variant="outline" onClick={handleMicrosoftLogin} disabled={isLoading}>
                    Microsoft
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              <Button variant="link" onClick={() => setShowOnboarding(true)}>
                First-time login?
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to the Placement Management System</DialogTitle>
            <DialogDescription>
              A quick guide to get you started with our platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">For Students:</h3>
              <p className="text-sm">
                • Upload and maintain your resume<br />
                • Browse and apply for job opportunities<br />
                • Track application status<br />
                • Get notifications about deadlines
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">For Administrators:</h3>
              <p className="text-sm">
                • Manage job opportunities<br />
                • Review student resumes<br />
                • Send notifications and reminders<br />
                • Communicate with students and companies
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Demo Credentials:</h3>
              <p className="text-sm">
                <strong>Student:</strong> student@example.com / password<br />
                <strong>Admin:</strong> admin@example.com / password
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowOnboarding(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

