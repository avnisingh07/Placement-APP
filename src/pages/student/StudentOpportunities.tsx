
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Search, Briefcase, Building, MapPin, Clock, BookmarkPlus } from 'lucide-react';

// Mock data
const mockOpportunities = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp Inc',
    location: 'San Francisco, CA (Remote)',
    description: 'We are looking for a Frontend Developer with experience in React, TypeScript, and modern CSS frameworks.',
    type: 'Full-time',
    salary: '$80,000 - $120,000',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'RESTful APIs'],
    deadline: '2025-05-10',
    matchScore: 92,
    logo: 'https://ui-avatars.com/api/?name=T+C&background=0E7490&color=fff',
  },
  {
    id: 2,
    title: 'Backend Software Engineer',
    company: 'Innovate Solutions',
    location: 'New York, NY (On-site)',
    description: 'Backend engineer with strong knowledge of Node.js and database technologies to build scalable applications.',
    type: 'Full-time',
    salary: '$90,000 - $130,000',
    skills: ['Node.js', 'Express', 'MongoDB', 'GraphQL'],
    deadline: '2025-05-15',
    matchScore: 78,
    logo: 'https://ui-avatars.com/api/?name=I+S&background=10B981&color=fff',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebWizards',
    location: 'Seattle, WA (Hybrid)',
    description: 'Full stack role working with modern JavaScript frameworks to deliver engaging user experiences.',
    type: 'Contract',
    salary: '$70 - $90 per hour',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    deadline: '2025-05-20',
    matchScore: 85,
    logo: 'https://ui-avatars.com/api/?name=W+W&background=6366F1&color=fff',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Austin, TX (Remote)',
    description: 'Experienced DevOps engineer to help us build and maintain our cloud infrastructure.',
    type: 'Full-time',
    salary: '$95,000 - $140,000',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    deadline: '2025-05-25',
    matchScore: 65,
    logo: 'https://ui-avatars.com/api/?name=C+S&background=F59E0B&color=fff',
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    company: 'Creative Labs',
    location: 'Los Angeles, CA (On-site)',
    description: 'Create beautiful and functional user interfaces for web and mobile applications.',
    type: 'Part-time',
    salary: '$50 - $75 per hour',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    deadline: '2025-05-18',
    matchScore: 72,
    logo: 'https://ui-avatars.com/api/?name=C+L&background=EC4899&color=fff',
  },
];

const StudentOpportunities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState<string>('all');
  const [viewType, setViewType] = useState<'card' | 'list'>('card');

  // Filter opportunities based on search query and job type
  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesQuery = 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = jobType === 'all' || opportunity.type.toLowerCase().includes(jobType.toLowerCase());
    
    return matchesQuery && matchesType;
  });

  const handleApply = (id: number) => {
    toast.success('Application submitted successfully!');
  };

  const handleSave = (id: number) => {
    toast.success('Job saved to your bookmarks!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <div className="flex items-center">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'card' | 'list')}>
            <TabsList>
              <TabsTrigger value="card">Card View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs, skills, or companies..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Showing {filteredOpportunities.length} opportunities
        </div>

        {/* Card View */}
        {viewType === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((job) => (
              <Card key={job.id} className="hover-scale overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Briefcase className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline">+{job.skills.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center mb-2">
                    <div className="text-sm">
                      Match Score: <span className={`font-bold ${job.matchScore > 80 ? 'text-secondary' : ''}`}>{job.matchScore}%</span>
                    </div>
                    <div className="text-sm font-medium">{job.salary}</div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button onClick={() => handleApply(job.id)}>Apply</Button>
                    <Button variant="outline" onClick={() => handleSave(job.id)}>
                      <BookmarkPlus className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewType === 'list' && (
          <div className="space-y-4">
            {filteredOpportunities.map((job) => (
              <Card key={job.id} className="hover-scale">
                <div className="flex flex-col lg:flex-row p-4 gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{job.title}</h3>
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{job.company}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{job.location}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge className={job.matchScore > 80 ? 'bg-secondary' : ''}>
                          {job.matchScore}% Match
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {job.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                      <div className="text-sm flex items-center gap-4">
                        <span>{job.type}</span>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApply(job.id)}>Apply</Button>
                        <Button size="sm" variant="outline" onClick={() => handleSave(job.id)}>
                          <BookmarkPlus className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOpportunities;
