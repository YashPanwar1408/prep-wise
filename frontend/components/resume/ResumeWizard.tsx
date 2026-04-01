'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/lib/store/resume.store';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ATSAnalysisDisplay } from '@/components/resume/ATSAnalysisDisplay';
import { ChevronRight, ChevronLeft, Check, Download, BarChart2 } from 'lucide-react';
import { pdfService } from '@/lib/services/pdf.service';
import type { PersonalInfo, ExperienceItem, EducationItem, ProjectItem, Skills } from '@/lib/schemas/resume.schema';
import type { ATSAnalysis } from '@/lib/schemas/ats.schema';

type Step = 'personal' | 'summary' | 'experience' | 'projects' | 'education' | 'skills' | 'preview';

export default function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const store = useResumeStore();
  const resume = store.currentResume;
  const [isExporting, setIsExporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [atsError, setAtsError] = useState<string | null>(null);

  // On mount: hydrate Zustand from sessionStorage if store is empty
  useEffect(() => {
    if (!store.currentResume) {
      try {
        const raw = sessionStorage.getItem('resumeData');
        if (raw) {
          const parsed = JSON.parse(raw);
          store.setResume(parsed);
        }
      } catch (err) {
        console.warn('Failed to restore resume from sessionStorage:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading state while sessionStorage hydration is pending
  if (!resume) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading resume...</div>;

  const steps: { id: Step; label: string; description: string }[] = [
    { id: 'personal', label: 'Personal Details', description: 'Your basic information' },
    { id: 'summary', label: 'Professional Summary', description: 'Brief overview of your career' },
    { id: 'experience', label: 'Work Experience', description: 'Your employment history' },
    { id: 'projects', label: 'Projects', description: 'Your personal and professional projects' },
    { id: 'education', label: 'Education', description: 'Your academic background' },
    { id: 'skills', label: 'Skills', description: 'Your core competencies' },
    { id: 'preview', label: 'Preview & Export', description: 'Review and download' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await pdfService.downloadPDF(resume, 'ats');
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleATSAnalysis = async () => {
    if (!resume) return;
    setIsAnalyzing(true);
    setAtsError(null);
    try {
      // Build a plain-text representation of the resume for the ATS analyzer
      const lines: string[] = [];
      const p = resume.personalInfo;
      lines.push(p.fullName ?? '', p.email ?? '', p.phone ?? '', p.location ?? '', p.linkedin ?? '', p.github ?? '');
      if (resume.summary?.summary) lines.push(resume.summary.summary);
      resume.experience?.forEach(e => {
        lines.push(`${e.role} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`);
        lines.push(e.description || '');
        e.bullets?.forEach(b => lines.push(b));
      });
      resume.education?.forEach(e => lines.push(`${e.degree} ${e.field} - ${e.school} ${e.graduationDate}`));
      resume.skills?.flatSkills?.forEach(s => lines.push(s));
      resume.projects?.forEach(proj => lines.push(`${proj.title}: ${proj.description}`));
      const resumeText = lines.filter(Boolean).join('\n');

      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      setAtsAnalysis(json.analysis);
      setShowAtsModal(true);
    } catch (err) {
      setAtsError(err instanceof Error ? err.message : 'ATS analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Progress Bar */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Create Your Resume</h1>
            <div className="text-sm text-gray-400">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${index < currentStepIndex
                    ? 'bg-green-500 border-green-500'
                    : index === currentStepIndex
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-700 border-gray-600'
                    }`}>
                    {index < currentStepIndex ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={`text-xs font-semibold ${index === currentStepIndex ? 'text-white' : 'text-gray-400'
                        }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card className="p-8 bg-gray-800 border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {steps[currentStepIndex].label}
                </h2>
                <p className="text-gray-400">
                  {steps[currentStepIndex].description}
                </p>
              </div>

              {/* Personal Details */}
              {currentStep === 'personal' && (
                <PersonalInfoForm
                  personalInfo={resume.personalInfo}
                  onUpdate={(data) => store.updatePersonalInfo((draft) => Object.assign(draft, data))}
                />
              )}

              {/* Summary */}
              {currentStep === 'summary' && (
                <SummaryForm
                  summary={resume.summary?.summary || ''}
                  onUpdate={(value) => store.updateSummary((d) => {
                    if (d) d.summary = value;
                  })}
                />
              )}

              {/* Experience */}
              {currentStep === 'experience' && (
                <ExperienceForm
                  experiences={resume.experience}
                  onAdd={(data) => store.addExperience(data)}
                />
              )}

              {/* Projects */}
              {currentStep === 'projects' && (
                <ProjectsForm
                  projects={resume.projects || []}
                  onAdd={(data) => store.addProject(data)}
                />
              )}

              {/* Education */}
              {currentStep === 'education' && (
                <EducationForm
                  education={resume.education}
                  onAdd={(data) => store.addEducation(data)}
                />
              )}

              {/* Skills */}
              {currentStep === 'skills' && (
                <SkillsForm
                  skills={resume.skills}
                  onUpdate={(skills) => store.updateSkills((draft) => Object.assign(draft, skills))}
                />
              )}

              {/* Preview */}
              {currentStep === 'preview' && (
                <div className="py-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-white">Your resume is ready!</h3>
                    <p className="text-gray-400 text-sm">
                      Review your resume on the right, run an ATS check, then export.
                    </p>
                  </div>

                  {/* ATS Analysis Button */}
                  <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart2 className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-white">ATS Compatibility Score</span>
                      {atsAnalysis && (
                        <span className={`ml-auto text-2xl font-bold ${atsAnalysis.overallScore >= 75 ? 'text-green-400' : atsAnalysis.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {atsAnalysis.overallScore}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      AI-powered check to see how well your resume passes Applicant Tracking Systems.
                    </p>
                    {atsError && (
                      <p className="text-sm text-red-400 mb-3 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        ⚠️ {atsError}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleATSAnalysis}
                        disabled={isAnalyzing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4" />
                            {atsAnalysis ? 'Re-analyze' : 'Run ATS Check'}
                          </span>
                        )}
                      </Button>
                      {atsAnalysis && (
                        <Button
                          onClick={() => setShowAtsModal(true)}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          View Full Report
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Export Button */}
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isExporting ? 'Exporting...' : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* ATS Analysis Modal */}
              {atsAnalysis && showAtsModal && (
                <ATSAnalysisDisplay
                  analysis={atsAnalysis}
                  onClose={() => setShowAtsModal(false)}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentStepIndex === steps.length - 2 ? 'Review' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="sticky top-24 h-fit">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Live Preview</h3>
              <div className="border border-gray-700 rounded-lg overflow-auto bg-white" style={{ maxHeight: '800px' }}>
                <ResumePreview resume={resume} mode="ats" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Info Form Component
function PersonalInfoForm({ personalInfo, onUpdate }: { personalInfo: PersonalInfo; onUpdate: (data: PersonalInfo) => void }) {
  const [formData, setFormData] = useState(personalInfo);

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <Input
            value={formData.fullName?.split(' ')[0] || ''}
            onChange={(e) => {
              const lastName = formData.fullName?.split(' ').slice(1).join(' ') || '';
              handleChange('fullName', `${e.target.value} ${lastName}`.trim());
            }}
            placeholder="John"
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <Input
            value={formData.fullName?.split(' ').slice(1).join(' ') || ''}
            onChange={(e) => {
              const firstName = formData.fullName?.split(' ')[0] || '';
              handleChange('fullName', `${firstName} ${e.target.value}`.trim());
            }}
            placeholder="Doe"
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <Input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@example.com"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
        <Input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
        <Input
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York, NY"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn (Optional)</label>
        <Input
          value={formData.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
    </div>
  );
}

// Summary Form Component
function SummaryForm({ summary, onUpdate }: { summary: string; onUpdate: (value: string) => void }) {
  const [text, setText] = useState(summary);

  const handleChange = (value: string) => {
    setText(value);
    onUpdate(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Professional Summary
        </label>
        <Textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write a brief summary of your professional experience, key skills, and career goals..."
          rows={6}
          className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          {text.length} / 500 characters • Aim for 2-3 sentences
        </p>
      </div>
    </div>
  );
}

// Experience Form Component
function ExperienceForm({ experiences, onAdd }: { experiences: ExperienceItem[]; onAdd: (data: Partial<ExperienceItem>) => void }) {
  const [showForm, setShowForm] = useState(experiences.length === 0);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAdd = () => {
    if (formData.role && formData.company) {
      onAdd({
        ...formData,
        bullets: formData.description.split('\n').filter(b => b.trim())
      });
      setFormData({
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <Card key={exp.id} className="p-4 bg-gray-700 border-gray-600">
          <h4 className="font-semibold text-white">{exp.role}</h4>
          <p className="text-sm text-gray-400">{exp.company}</p>
        </Card>
      ))}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
          + Add Experience
        </Button>
      )}

      {showForm && (
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
          <Input
            placeholder="Job Title"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="month"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="month"
              placeholder="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.current}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Textarea
            placeholder="Describe your responsibilities and achievements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Projects Form Component
function ProjectsForm({ projects, onAdd }: { projects: ProjectItem[]; onAdd: (data: Partial<ProjectItem>) => void }) {
  const [showForm, setShowForm] = useState(projects.length === 0);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    technologies: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAdd = () => {
    if (formData.title && formData.description) {
      onAdd({
        ...formData
      });
      setFormData({
        title: '',
        link: '',
        technologies: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-4 bg-gray-700 border-gray-600">
          <h4 className="font-semibold text-white">{project.title}</h4>
          <p className="text-sm text-gray-400">{project.technologies}</p>
        </Card>
      ))}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
          + Add Project
        </Button>
      )}

      {showForm && (
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
          <Input
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Project Link (optional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="month"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="month"
              placeholder="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.current}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Textarea
            placeholder="Describe the project, your role, and key achievements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Education Form Component
function EducationForm({ education, onAdd }: { education: EducationItem[]; onAdd: (data: Partial<EducationItem>) => void }) {
  const [showForm, setShowForm] = useState(education.length === 0);
  const [formData, setFormData] = useState({
    degree: '',
    field: '',
    school: '',
    location: '',
    graduationDate: '',
    gpa: ''
  });

  const handleAdd = () => {
    if (formData.degree && formData.school) {
      onAdd({
        ...formData
      });
      setFormData({
        degree: '',
        field: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: ''
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <Card key={edu.id} className="p-4 bg-gray-700 border-gray-600">
          <h4 className="font-semibold text-white">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
          <p className="text-sm text-gray-400">{edu.school}</p>
        </Card>
      ))}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
          + Add Education
        </Button>
      )}

      {showForm && (
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
          <Input
            placeholder="Degree (e.g., Bachelor of Science)"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Field of Study"
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Institution Name"
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            type="month"
            placeholder="Graduation Date"
            value={formData.graduationDate}
            onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skills Form Component
function SkillsForm({ skills, onUpdate }: { skills: Skills; onUpdate: (skills: Skills) => void }) {
  const [skillText, setSkillText] = useState(skills.flatSkills?.join(', ') || '');

  const handleChange = (value: string) => {
    setSkillText(value);
    const skillsArray = value.split(',').map(s => s.trim()).filter(Boolean);
    onUpdate({
      categories: [],
      flatSkills: skillsArray
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Skills (comma-separated)
        </label>
        <Textarea
          value={skillText}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="JavaScript, React, Node.js, Python, SQL, Project Management..."
          rows={6}
          className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your skills separated by commas
        </p>
      </div>
    </div>
  );
}
