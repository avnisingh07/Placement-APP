
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Search, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface JobOpportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  type: string;
  salary: string;
  skills: string[];
  deadline: string;
  matchScore: number;
  logo: string;
}

// Initial mock data
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
  }
];

const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<JobOpportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'deadline' | 'company'>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [matchScore, setMatchScore] = useState(75);

  // Load saved opportunities from localStorage
  useEffect(() => {
    const savedOpportunities = localStorage.getItem('jobOpportunities');
    if (savedOpportunities) {
      setOpportunities(JSON.parse(savedOpportunities));
    } else {
      setOpportunities(mockOpportunities);
    }
  }, []);

  // Save opportunities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobOpportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter(opportunity => 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'deadline') {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const companyA = a.company.toLowerCase();
        const companyB = b.company.toLowerCase();
        return sortDirection === 'asc' 
          ? companyA.localeCompare(companyB)
          : companyB.localeCompare(companyA);
      }
    });

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setDescription('');
    setType('Full-time');
    setSalary('');
    setSkills([]);
    setSkillInput('');
    setDeadline('');
    setMatchScore(75);
    setCurrentOpportunity(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (opportunity: JobOpportunity) => {
    setCurrentOpportunity(opportunity);
    setTitle(opportunity.title);
    setCompany(opportunity.company);
    setLocation(opportunity.location);
    setDescription(opportunity.description);
    setType(opportunity.type);
    setSalary(opportunity.salary);
    setSkills([...opportunity.skills]);
    setDeadline(opportunity.deadline);
    setMatchScore(opportunity.matchScore);
    setIsDialogOpen(true);
  };

  const generateLogoUrl = (companyName: string) => {
    const initials = companyName
      .split(' ')
      .map(word => word[0])
      .join('+')
      .substring(0, 2);
      
    // Generate random color
    const colors = ['0E7490', '10B981', '6366F1', 'F59E0B', 'EC4899', '8B5CF6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${randomColor}&color=fff`;
  };

  const handleSaveOpportunity = () => {
    if (!title || !company || !location || !description || !salary || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    if (currentOpportunity) {
      // Update existing opportunity
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === currentOpportunity.id 
          ? {
              ...opp,
              title,
              company,
              location,
              description,
              type,
              salary,
              skills,
              deadline,
              matchScore
            }
          : opp
      );
      setOpportunities(updatedOpportunities);
      toast.success('Job opportunity updated successfully');
    } else {
      // Add new opportunity
      const newOpportunity: JobOpportunity = {
        id: opportunities.length ? Math.max(...opportunities.map(o => o.id)) + 1 : 1,
        title,
        company,
        location,
        description,
        type,
        salary,
        skills,
        deadline,
        matchScore,
        logo: generateLogoUrl(company)
      };
      setOpportunities([...opportunities, newOpportunity]);
      toast.success('Job opportunity added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteOpportunity = (id: number) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
    toast.success('Job opportunity deleted successfully');
  };

  const toggleSort = (field: 'deadline' | 'company') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Job Opportunities</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => toggleSort('deadline')}
            className="flex items-center gap-1"
          >
            By Deadline
            {sortField === 'deadline' && (
              sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => toggleSort('company')}
            className="flex items-center gap-1"
          >
            By Company
            {sortField === 'company' && (
              sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Job listings */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-muted/20">
            <p className="text-lg font-medium">No job opportunities found</p>
            <p className="text-muted-foreground">Try adjusting your search or add a new job.</p>
          </div>
        ) : (
          filteredOpportunities.map(opportunity => (
            <Card key={opportunity.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={opportunity.logo} 
                          alt={opportunity.company} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                        <p className="text-muted-foreground">{opportunity.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p><span className="font-medium">Location:</span> {opportunity.location}</p>
                      <p><span className="font-medium">Type:</span> {opportunity.type}</p>
                      <p><span className="font-medium">Salary:</span> {opportunity.salary}</p>
                      <p><span className="font-medium">Deadline:</span> {new Date(opportunity.deadline).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="font-medium mb-1">Description:</p>
                      <p className="text-sm">{opportunity.description}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 justify-start">
                    <Button 
                      onClick={() => openEditDialog(opportunity)}
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteOpportunity(opportunity.id)}
                      variant="outline" 
                      className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentOpportunity ? 'Edit Job Opportunity' : 'Add New Job Opportunity'}</DialogTitle>
            <DialogDescription>
              Fill in the details for this job opportunity. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g., TechCorp Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA (Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $80,000 - $120,000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed job description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  placeholder="e.g., React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <Badge key={skill} className="flex items-center gap-1">
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)} 
                      className="ml-1 rounded-full hover:bg-primary/20 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchScore">Match Score (for demo purposes)</Label>
              <Input
                id="matchScore"
                type="number"
                min="1"
                max="100"
                value={matchScore}
                onChange={(e) => setMatchScore(parseInt(e.target.value) || 75)}
              />
              <p className="text-xs text-muted-foreground">
                This is for demo purposes to show match scores for students. In a real system, this would be calculated automatically.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveOpportunity}>
              {currentOpportunity ? 'Save Changes' : 'Add Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOpportunities;
