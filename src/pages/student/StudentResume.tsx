
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { Upload, FileText, Plus, X, Edit, Save, Trash2 } from 'lucide-react';

// Default resume data for new users
const defaultResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
  education: [
    {
      id: 1,
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      startDate: '2021-09',
      endDate: '2025-05',
      gpa: '3.8/4.0',
    },
  ],
  experience: [
    {
      id: 1,
      company: 'Tech Internships Inc',
      position: 'Software Engineering Intern',
      startDate: '2024-06',
      endDate: '2024-08',
      description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to implement new features and fix bugs.',
    },
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS',
    'Git', 'SQL', 'MongoDB', 'AWS', 'Docker',
  ],
  projects: [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented user authentication, product catalog, and checkout process.',
      link: 'github.com/johnstudent/ecommerce',
    },
    {
      id: 2,
      name: 'Weather App',
      description: 'Developed a weather application using React that displays current weather and forecasts based on user location or search.',
      link: 'github.com/johnstudent/weather-app',
    },
  ],
};

const skillGaps = [
  { skill: 'AWS', importance: 'High' },
  { skill: 'GraphQL', importance: 'Medium' },
  { skill: 'UI/UX Design', importance: 'Low' },
];

const resumeScoreMetrics = [
  { category: 'ATS Compatibility', score: 85 },
  { category: 'Content Quality', score: 78 },
  { category: 'Skills Match', score: 92 },
  { category: 'Overall Score', score: 85 },
];

interface StoredResume {
  file: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  dataUrl: string | null;
}

const StudentResume = () => {
  const { user } = useAuth();
  
  const loadSavedResumeData = () => {
    const userId = user?.id || 'default';
    const saved = localStorage.getItem(`resumeData_${userId}`);
    const savedSettings = localStorage.getItem(`userSettings_${userId}`);
    const settings = savedSettings ? JSON.parse(savedSettings) : null;
    
    if (saved) {
      const savedData = JSON.parse(saved);
      if (settings) {
        savedData.personalInfo = {
          ...savedData.personalInfo,
          name: settings.name || user?.name || '',
          email: settings.email || user?.email || '',
        };
      }
      return savedData;
    }
    
    return {
      ...defaultResumeData,
      personalInfo: {
        ...defaultResumeData.personalInfo,
        name: settings?.name || user?.name || '',
        email: settings?.email || user?.email || '',
        phone: settings?.phone || '',
        location: settings?.location || '',
        linkedin: settings?.linkedin || '',
        github: settings?.github || '',
      }
    };
  };

  const loadSavedResumeFile = () => {
    const userId = user?.id || 'default';
    const savedResume = localStorage.getItem(`storedResume_${userId}`);
    if (!savedResume) return null;
    
    const parsedResume: StoredResume = JSON.parse(savedResume);
    return parsedResume;
  };

  const [resumeData, setResumeData] = useState(loadSavedResumeData());
  const [activeTab, setActiveTab] = useState('upload');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [storedResume, setStoredResume] = useState<StoredResume | null>(loadSavedResumeFile());

  useEffect(() => {
    setResumeData(loadSavedResumeData());
    const storedResumeData = loadSavedResumeFile();
    setStoredResume(storedResumeData);
    
    if (storedResumeData && storedResumeData.dataUrl) {
      setResumePreview(storedResumeData.dataUrl);
    }
  }, [user]);

  useEffect(() => {
    const userId = user?.id || 'default';
    localStorage.setItem(`resumeData_${userId}`, JSON.stringify(resumeData));
  }, [resumeData, user]);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || 
          file.type === 'application/msword' || file.name.endsWith('.doc') ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        setResumeFile(file);
        
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setResumePreview(dataUrl);
            
            const userId = user?.id || 'default';
            const resumeToStore: StoredResume = {
              file: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
              },
              dataUrl: dataUrl
            };
            localStorage.setItem(`storedResume_${userId}`, JSON.stringify(resumeToStore));
            setStoredResume(resumeToStore);
          };
          reader.readAsDataURL(file);
        } else {
          const userId = user?.id || 'default';
          const resumeToStore: StoredResume = {
            file: {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            },
            dataUrl: null
          };
          localStorage.setItem(`storedResume_${userId}`, JSON.stringify(resumeToStore));
          setStoredResume(resumeToStore);
          setResumePreview(null);
        }
        
        toast.success('Resume uploaded successfully!');
        setActiveTab('edit');
      } else {
        toast.error('Please upload a PDF or Word document');
      }
    }
  };

  const handleUpdatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && !resumeData.skills.includes(newSkill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
      toast.success('Skill added successfully!');
    } else if (resumeData.skills.includes(newSkill)) {
      toast.error('This skill already exists in your resume');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
    toast.success('Skill removed successfully!');
  };

  const handleSaveResume = () => {
    toast.success('Resume saved successfully!');
    setEditingSection(null);
  };

  const handleParseResume = () => {
    toast.success('Resume parsed successfully!');
    setActiveTab('edit');
  };

  const handleRemoveStoredResume = () => {
    const userId = user?.id || 'default';
    localStorage.removeItem(`storedResume_${userId}`);
    setStoredResume(null);
    setResumeFile(null);
    setResumePreview(null);
    toast.success('Stored resume removed successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Resume Manager</h1>
      
      <Tabs defaultValue={storedResume ? "edit" : "upload"} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF or Word format. We'll parse it and help you optimize it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!storedResume ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Drag & drop your resume here</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, DOC, and DOCX formats up to 5MB
                    </p>
                    <div className="relative">
                      <Input 
                        type="file" 
                        id="resume-upload"
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        onChange={handleResumeUpload}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                      <Button>Browse Files</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{storedResume.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(storedResume.file.size / 1024)} KB • {
                        storedResume.file.type === 'application/pdf' ? 'PDF' : 
                        storedResume.file.name.endsWith('.doc') ? 'DOC' : 'DOCX'
                      }
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveStoredResume}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleParseResume}
                disabled={!resumeFile && !storedResume}
              >
                {resumeFile || storedResume ? 'Parse Resume' : 'Upload a resume first'}
              </Button>
            </CardFooter>
          </Card>

          {resumePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={resumePreview}
                  className="w-full h-[500px] border rounded"
                  title="Resume Preview"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          {resumePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Your Current Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={resumePreview}
                  className="w-full h-[300px] border rounded"
                  title="Resume Preview"
                />
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your contact details and online profiles</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingSection(editingSection === 'personalInfo' ? null : 'personalInfo')}
              >
                {editingSection === 'personalInfo' ? <Save /> : <Edit />}
              </Button>
            </CardHeader>
            <CardContent>
              {editingSection === 'personalInfo' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={resumeData.personalInfo.name} 
                      onChange={(e) => handleUpdatePersonalInfo('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      value={resumeData.personalInfo.email} 
                      onChange={(e) => handleUpdatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      value={resumeData.personalInfo.phone} 
                      onChange={(e) => handleUpdatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      value={resumeData.personalInfo.location} 
                      onChange={(e) => handleUpdatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input 
                      value={resumeData.personalInfo.linkedin} 
                      onChange={(e) => handleUpdatePersonalInfo('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub</label>
                    <Input 
                      value={resumeData.personalInfo.github} 
                      onChange={(e) => handleUpdatePersonalInfo('github', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p>{resumeData.personalInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{resumeData.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{resumeData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{resumeData.personalInfo.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">LinkedIn</p>
                    <p>{resumeData.personalInfo.linkedin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">GitHub</p>
                    <p>{resumeData.personalInfo.github}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Technical and soft skills that highlight your expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <Badge key={skill} className="py-1 px-3 flex items-center gap-1">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a new skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill) {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button onClick={handleAddSkill} disabled={!newSkill} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveResume}>Save Resume</Button>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {resumePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Your Current Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={resumePreview}
                  className="w-full h-[300px] border rounded"
                  title="Resume Preview"
                />
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                How your resume performs against ATS and industry standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {resumeScoreMetrics.map((metric) => (
                  <div key={metric.category} className="space-y-2">
                    <div className="flex justify-between">
                      <p>{metric.category}</p>
                      <p className="font-medium">{metric.score}%</p>
                    </div>
                    <Progress value={metric.score} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Skills you might want to develop based on current job market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((skill) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{skill.skill}</p>
                      <p className="text-sm text-muted-foreground">Importance: {skill.importance}</p>
                    </div>
                    <Button variant="outline" size="sm">Add to Skills</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentResume;
