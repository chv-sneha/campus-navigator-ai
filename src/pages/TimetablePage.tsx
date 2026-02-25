import { useState } from "react";
import Layout from "@/components/Layout";
import { Upload, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
  const [timetable, setTimetable] = useState(initialTimetable);
  const [editCell, setEditCell] = useState<{ day: number; period: number } | null>(null);
  const { toast } = useToast();

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
      <div className="glass-card p-6 mb-6 border-2 border-dashed border-border text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => toast({ title: "Upload feature coming soon! 📸" })}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Upload timetable image</p>
        <p className="text-xs text-muted-foreground">Drag & drop or click to browse — AI will auto-fill the grid</p>
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
