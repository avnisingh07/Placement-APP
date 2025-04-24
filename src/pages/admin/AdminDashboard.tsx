
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const applicationsData = [
  { name: 'April 15', total: 25 },
  { name: 'April 16', total: 28 },
  { name: 'April 17', total: 35 },
  { name: 'April 18', total: 42 },
  { name: 'April 19', total: 49 },
  { name: 'April 20', total: 55 },
  { name: 'April 21', total: 62 },
];

const mockDeadlines = [
  {
    id: 1,
    title: 'Send interview invites for TechCorp',
    deadline: '2025-05-08',
  },
  {
    id: 2,
    title: 'Finalize test questions for Innovate Solutions',
    deadline: '2025-05-12',
  },
  {
    id: 3,
    title: 'Resume Screening for WebWizards',
    deadline: '2025-05-18',
  },
];

const mockStudentStats = [
  { id: 1, category: 'Total Students', count: 150 },
  { id: 2, category: 'Applied to Jobs', count: 95 },
  { id: 3, category: 'Shortlisted', count: 42 },
  { id: 4, category: 'Offers Received', count: 15 },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {/* Remove Add New Opportunity button */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStudentStats.map((stat) => (
          <Card key={stat.id} className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle>Application Trends</CardTitle>
          <CardDescription>Total applications received over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={applicationsData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Deadlines Section Only */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDeadlines.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

