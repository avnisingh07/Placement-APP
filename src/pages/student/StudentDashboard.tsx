
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockOpportunities = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp Inc',
    deadline: '2025-05-10',
    logo: 'https://ui-avatars.com/api/?name=T+C&background=0E7490&color=fff',
  },
  {
    id: 2,
    title: 'Backend Software Engineer',
    company: 'Innovate Solutions',
    deadline: '2025-05-15',
    logo: 'https://ui-avatars.com/api/?name=I+S&background=10B981&color=fff',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebWizards',
    deadline: '2025-05-20',
    logo: 'https://ui-avatars.com/api/?name=W+W&background=6366F1&color=fff',
  },
];

const mockDeadlines = [
  {
    id: 1,
    title: 'Resume submission for TechCorp',
    deadline: '2025-05-08T23:59:59',
  },
  {
    id: 2,
    title: 'Online test for Innovate Solutions',
    deadline: '2025-05-12T14:30:00',
  },
  {
    id: 3,
    title: 'Interview preparation deadline',
    deadline: '2025-05-18T10:00:00',
  },
];

const mockSkills = [
  { name: 'React', progress: 85 },
  { name: 'Node.js', progress: 70 },
  { name: 'TypeScript', progress: 65 },
  { name: 'UI/UX Design', progress: 55 },
];

const mockApplications = {
  applied: 5,
  shortlisted: 2,
  interviewed: 1,
  offers: 0,
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const resumeMatchScore = 78;
  const [userName, setUserName] = useState(user?.name || '');

  // Load the user's saved name from settings if available
  useEffect(() => {
    const userId = user?.id || 'default';
    const savedSettings = localStorage.getItem(`userSettings_${userId}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.name) {
        setUserName(settings.name);
      }
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Welcome back, {userName.split(' ')[0]}</h1>
        <Button asChild>
          <Link to="/student/opportunities">Browse Opportunities</Link>
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resume Match Score</CardTitle>
            <CardDescription>How well your resume matches opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-custom opacity-25"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${resumeMatchScore} 100`}
                    strokeLinecap="round"
                    className="text-primary transform -rotate-90 origin-center"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-3xl font-bold">{resumeMatchScore}%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/resume">Improve Resume</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Application Status</CardTitle>
            <CardDescription>Your current applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-2xl font-bold">{mockApplications.applied}</span>
                <span className="text-sm text-muted-foreground">Applied</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-2xl font-bold">{mockApplications.shortlisted}</span>
                <span className="text-sm text-muted-foreground">Shortlisted</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-2xl font-bold">{mockApplications.interviewed}</span>
                <span className="text-sm text-muted-foreground">Interviewed</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-2xl font-bold">{mockApplications.offers}</span>
                <span className="text-sm text-muted-foreground">Offers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Deadline</CardTitle>
            <CardDescription>Next important date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-medium text-center">{mockDeadlines[0].title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {new Date(mockDeadlines[0].deadline).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/reminders">View All Deadlines</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities Carousel */}
        <Card className="lg:col-span-2 hover-scale">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Featured Opportunities</CardTitle>
                <CardDescription>Job openings matching your profile</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/opportunities">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOpportunities.map((job) => (
                <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-muted-foreground">Deadline:</div>
                    <div className="text-sm font-medium">{new Date(job.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle>Skill Progress</CardTitle>
            <CardDescription>Based on your resume and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
