import React, { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Video, Trash, ArrowRight, Edit } from 'lucide-react';

interface AdminCurriculumEditorProps {
  courseId: string;
  onClose: () => void;
}

export default function AdminCurriculumEditor({ courseId, onClose }: AdminCurriculumEditorProps) {
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);
  
  const [newTopic, setNewTopic] = useState({
    title: '', description: '', videoId: '', duration: '', isPreview: false
  });

  const fetchCurriculum = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/curriculum`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}` } });
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        setSections(data.sections || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    try {
      await fetch(`/api/admin/courses/${courseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({
          title: newSectionTitle,
          order: sections.length + 1
        })
      });
      setNewSectionTitle('');
      fetchCurriculum();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTopic = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.videoId.trim()) return;
    try {
      const section = sections.find(s => s.id === sectionId);
      const order = section?.lessons?.length ? section.lessons.length + 1 : 1;
      
      await fetch(`/api/admin/sections/${sectionId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({
          ...newTopic,
          order
        })
      });
      setAddingTopicTo(null);
      setNewTopic({ title: '', description: '', videoId: '', duration: '', isPreview: false });
      fetchCurriculum();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAFCFA] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#E5ECE7]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5ECE7] bg-white">
          <div>
            <h2 className="font-sans text-xl font-black text-[#17221B] flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#79C99A]" />
              Manage Curriculum: {course?.title}
            </h2>
            <p className="text-xs text-[#66736B] mt-1 font-light uppercase tracking-widest">COURSE {'->'} CHAPTER {'->'} TOPIC {'->'} VIDEO</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#66736B] hover:text-[#17221B] bg-[#FAFCFA] rounded-full transition-colors border border-[#E5ECE7]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* List existing Chapters & Topics */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={section.id} className="bg-white border border-[#E5ECE7] rounded-xl overflow-hidden shadow-sm">
                
                <div className="bg-[#F1F8F3] px-4 py-3 flex items-center justify-between border-b border-[#E5ECE7]">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#79C99A] text-[#17221B] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Chapter {idx + 1}</span>
                    <strong className="text-[#17221B] text-sm font-black">{section.title}</strong>
                  </div>
                  <button
                    onClick={() => setAddingTopicTo(addingTopicTo === section.id ? null : section.id)}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#17221B] bg-white px-3 py-1.5 rounded-lg border border-[#79C99A]/50 hover:bg-[#79C99A] transition-all"
                  >
                    <Plus className="h-3 w-3" /> Add Topic
                  </button>
                </div>

                <div className="divide-y divide-[#E5ECE7]">
                  {section.lessons && section.lessons.length > 0 ? (
                    section.lessons.map((lesson: any, lIdx: number) => (
                      <div key={lesson.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#FAFCFA] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#FAFCFA] border border-[#E5ECE7] p-1.5 rounded mt-0.5">
                            <Video className="h-3.5 w-3.5 text-[#66736B]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#66736B]">Topic {lIdx + 1}</span>
                              <strong className="text-xs font-bold text-[#17221B]">{lesson.title}</strong>
                              {lesson.isPreview && (
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 rounded-sm uppercase tracking-widest">Free Preview</span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#66736B] mt-0.5 max-w-lg truncate">{lesson.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] text-[#79C99A] font-black uppercase tracking-widest bg-[#F1F8F3] px-1.5 py-0.5 rounded border border-[#79C99A]/30">{lesson.duration}</span>
                              <span className="text-[9px] text-[#66736B] uppercase font-mono tracking-tighter">ID: {lesson.videoId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center text-xs text-[#66736B] font-light">No topics in this chapter yet.</div>
                  )}

                  {/* Add Topic Form inline */}
                  {addingTopicTo === section.id && (
                    <div className="px-4 py-4 bg-[#FAFCFA] border-t-2 border-dashed border-[#E5ECE7]">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#17221B] mb-3">Add New Topic (Video Lesson)</h4>
                      <form onSubmit={(e) => handleAddTopic(e, section.id)} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input required type="text" placeholder="Topic Title" className="w-full text-xs rounded-xl border border-[#E5ECE7] px-3 py-2 bg-white" value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} />
                          <input required type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" className="w-full text-xs rounded-xl border border-[#E5ECE7] px-3 py-2 bg-white" value={newTopic.videoId} onChange={e => setNewTopic({...newTopic, videoId: e.target.value})} />
                          <input required type="text" placeholder="Duration (e.g. 10:15)" className="w-full text-xs rounded-xl border border-[#E5ECE7] px-3 py-2 bg-white" value={newTopic.duration} onChange={e => setNewTopic({...newTopic, duration: e.target.value})} />
                          <div className="flex items-center gap-2 text-xs">
                            <input type="checkbox" id="isPreview" checked={newTopic.isPreview} onChange={e => setNewTopic({...newTopic, isPreview: e.target.checked})} className="rounded text-[#79C99A] focus:ring-[#79C99A]" />
                            <label htmlFor="isPreview" className="text-[#66736B] font-bold">Free Preview (Unlocked)</label>
                          </div>
                        </div>
                        <textarea required placeholder="Short Description" className="w-full text-xs rounded-xl border border-[#E5ECE7] px-3 py-2 bg-white h-16 resize-none" value={newTopic.description} onChange={e => setNewTopic({...newTopic, description: e.target.value})} />
                        
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setAddingTopicTo(null)} className="px-4 py-2 text-xs font-bold text-[#66736B] hover:bg-[#E5ECE7] rounded-xl transition">Cancel</button>
                          <button type="submit" className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-[#17221B] text-white rounded-xl hover:bg-black transition shadow-sm">Save Topic</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Add Chapter Form */}
          <div className="bg-white border border-[#E5ECE7] border-dashed rounded-xl p-5 text-center">
            <h3 className="font-sans text-sm font-black text-[#17221B] mb-2">Create New Chapter</h3>
            <form onSubmit={handleAddChapter} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input 
                type="text" 
                required
                placeholder="e.g. Introduction to React" 
                className="flex-1 w-full text-xs rounded-xl border border-[#E5ECE7] px-4 py-2.5 bg-[#FAFCFA] focus:bg-white transition-colors"
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
              />
              <button type="submit" className="w-full sm:w-auto shrink-0 bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                Add Chapter
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
