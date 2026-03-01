import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Upload, Clock, Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const subjectColors: Record<string, string> = {
  "Data Structures": "bg-primary/10 text-primary",
  "OS": "bg-destructive/10 text-destructive",
  "DBMS": "bg-success/10 text-success",
  "CN": "bg-warning/10 text-warning",
  "Maths": "bg-accent/20 text-accent-foreground",
  "Lab (DS)": "bg-primary/15 text-primary",
  "Lab (CN)": "bg-warning/15 text-warning",
  "Seminar": "bg-muted text-muted-foreground",
  "Library": "bg-secondary text-secondary-foreground",
  "": "bg-transparent",
};

const initialTimetable: string[][] = [
  ["Data Structures", "Maths", "DBMS", "Lunch", "Lab (DS)", "Lab (DS)", "", ""],
  ["OS", "CN", "Maths", "Lunch", "Data Structures", "Library", "", ""],
  ["DBMS", "Data Structures", "OS", "Lunch", "Lab (CN)", "Lab (CN)", "", ""],
  ["CN", "DBMS", "Seminar", "Lunch", "Maths", "OS", "", ""],
  ["Data Structures", "OS", "CN", "Lunch", "DBMS", "Library", "", ""],
  ["Lab (DS)", "Lab (DS)", "Maths", "Lunch", "", "", "", ""],
];

const TimetablePage = () => {
  const [user] = useAuthState(auth);
  const [timetable, setTimetable] = useState(initialTimetable);
  const [editCell, setEditCell] = useState<{ day: number; period: number } | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const loadTimetable = async () => {
      const timetableDoc = await getDoc(doc(db, `users/${user.uid}/timetable`));
      if (timetableDoc.exists()) {
        setTimetable(timetableDoc.data().grid);
      }
    };
    loadTimetable();
  }, [user]);

  const saveTimetable = async () => {
    if (!user) return;
    await setDoc(doc(db, `users/${user.uid}/timetable`), { grid: timetable });
    toast({ title: "Timetable saved ✅" });
  };

  const parseImage = async (file: File) => {
    setParsing(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = base64.split(',')[1];
      const mediaType = file.type;

      const response = await fetch('http://localhost:3001/api/parse-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mediaType })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }
      
      if (data.content) {
        let parsed;
        const content = data.content.trim();
        
        // Try to extract JSON from markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          parsed = JSON.parse(codeBlockMatch[1].trim());
        } else {
          // Try to find JSON array directly
          const jsonMatch = content.match(/\[\[[\s\S]*?\]\]/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            // Try parsing the entire content
            parsed = JSON.parse(content);
          }
        }
        
        if (Array.isArray(parsed) && parsed.length === 6) {
          setTimetable(parsed);
          toast({ title: "Timetable parsed successfully! ✅ Review and save." });
        } else {
          throw new Error('Invalid timetable format');
        }
      } else {
        throw new Error('No content received');
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast({ title: "Could not parse timetable. Please fill manually.", variant: "destructive" });
    } finally {
      setParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseImage(file);
  };

  const updateCell = (day: number, period: number, value: string) => {
    const updated = timetable.map((row, d) =>
      d === day ? row.map((cell, p) => (p === period ? value : cell)) : row
    );
    setTimetable(updated);
  };

  const todaySchedule = timetable[5].map((sub, i) => ({ time: periods[i], subject: sub })).filter(s => s.subject && s.subject !== "Lunch");

  const getColor = (sub: string) => subjectColors[sub] || "bg-muted text-muted-foreground";

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Timetable</h1>
        <p className="text-sm text-muted-foreground mt-1">Your weekly class schedule at a glance</p>
      </div>

      {/* Upload Area */}
      <div className="glass-card p-6 mb-6 border-2 border-dashed border-border text-center">
        {parsing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">🤖 AI is reading your timetable...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-3">Upload timetable image</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                📁 Choose File
              </Button>
              <Button variant="outline" onClick={() => cameraInputRef.current?.click()}>
                📷 Use Camera
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">AI will auto-fill the grid</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Timetable Grid */}
        <div className="xl:col-span-3 glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">Time</th>
                {days.map(d => (
                  <th key={d} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((time, pi) => (
                <tr key={pi} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-xs text-muted-foreground font-medium whitespace-nowrap">{time}</td>
                  {days.map((_, di) => {
                    const sub = timetable[di]?.[pi] || "";
                    const isEditing = editCell?.day === di && editCell?.period === pi;
                    return (
                      <td key={di} className="px-2 py-1.5">
                        {isEditing ? (
                          <Input
                            autoFocus
                            defaultValue={sub}
                            className="h-8 text-xs"
                            onBlur={(e) => {
                              updateCell(di, pi, e.target.value);
                              setEditCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateCell(di, pi, (e.target as HTMLInputElement).value);
                                setEditCell(null);
                              }
                            }}
                          />
                        ) : (
                          <button
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${getColor(sub)}`}
                            onClick={() => setEditCell({ day: di, period: pi })}
                          >
                            {sub || "—"}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-border">
            <Button className="w-full" onClick={saveTimetable}>Save Timetable</Button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="xl:col-span-1 space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Today's Schedule
            </h3>
            <div className="space-y-3">
              {todaySchedule.length === 0 ? (
                <p className="text-sm text-muted-foreground">No classes today 🎉</p>
              ) : (
                todaySchedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{s.time}</span>
                    <div className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${getColor(s.subject)}`}>
                      {s.subject}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Suggested Study Slots */}
          <div className="glass-card p-5 bg-blue-50/50">
            <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              📖 Suggested Study Slots
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-foreground">2:00 PM — 3:00 PM: Free</p>
                <p className="text-xs text-muted-foreground mt-1">Consider revising Data Structures (due tomorrow)</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-foreground">4:00 PM — 5:00 PM: Free</p>
                <p className="text-xs text-muted-foreground mt-1">Work on OS assignment (1d remaining)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimetablePage;
