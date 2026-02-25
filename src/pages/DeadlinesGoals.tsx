import { useState } from "react";
import Layout from "@/components/Layout";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Deadline {
  id: number;
  subject: string;
  date: string;
  description: string;
  daysLeft: number;
}

interface Goal {
  id: number;
  text: string;
  done: boolean;
}

const initialDeadlines: Deadline[] = [
  { id: 1, subject: "Operating Systems", date: "2026-02-23", description: "Process Scheduling Assignment", daysLeft: 1 },
  { id: 2, subject: "Computer Networks", date: "2026-02-28", description: "Lab Report on TCP/IP", daysLeft: 6 },
  { id: 3, subject: "DBMS", date: "2026-03-05", description: "ER Diagram Project Submission", daysLeft: 11 },
  { id: 4, subject: "Mathematics", date: "2026-03-01", description: "Linear Algebra Problem Set 4", daysLeft: 7 },
];

const initialGoals: Goal[] = [
  { id: 1, text: "Revise Binary Trees — Chapter 5", done: false },
  { id: 2, text: "Complete OS assignment (remaining 40%)", done: false },
  { id: 3, text: "Read 2 research papers for seminar", done: false },
  { id: 4, text: "Practice 3 LeetCode problems", done: true },
  { id: 5, text: "Submit CN lab observation", done: true },
];

const urgencyColor = (days: number) => {
  if (days <= 2) return "border-l-destructive";
  if (days <= 7) return "border-l-warning";
  return "border-l-success";
};

const DeadlinesGoals = () => {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [goals, setGoals] = useState(initialGoals);
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [activeTab, setActiveTab] = useState<"deadlines" | "goals">("deadlines");
  const { toast } = useToast();

  const addDeadline = () => {
    if (!newSubject || !newDate) return;
    const daysLeft = Math.max(0, Math.ceil((new Date(newDate).getTime() - Date.now()) / 86400000));
    setDeadlines([...deadlines, { id: Date.now(), subject: newSubject, date: newDate, description: newDesc, daysLeft }]);
    setNewSubject(""); setNewDate(""); setNewDesc("");
    toast({ title: "Deadline added ✅" });
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now(), text: newGoal, done: false }]);
    setNewGoal("");
    toast({ title: "Goal added ✅" });
  };

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const active = goals.filter(g => !g.done);
  const completed = goals.filter(g => g.done);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Deadlines & Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay on track with assignments and personal targets</p>
      </div>

      {/* Mobile Tabs */}
      <div className="flex gap-3 mb-6 lg:hidden">
        <button
          onClick={() => setActiveTab("deadlines")}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            activeTab === "deadlines" ? "bg-white text-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
          }`}
        >
          Deadlines
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            activeTab === "goals" ? "bg-white text-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
          }`}
        >
          Daily Goals
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadlines */}
        <div className={`space-y-4 ${activeTab === "deadlines" ? "block" : "hidden"} lg:block`}>
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Add Deadline</h3>
            <div className="space-y-3">
              <Input placeholder="Subject" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              <Input placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              <Button className="w-full" onClick={addDeadline}><Plus className="w-4 h-4 mr-2" /> Add Deadline</Button>
            </div>
          </div>

          <div className="space-y-3">
            {deadlines.map(d => (
              <div key={d.id} className={`glass-card p-4 border-l-4 ${urgencyColor(d.daysLeft)} flex items-center justify-between`}>
                <div>
                  <p className="font-medium text-sm text-foreground">{d.subject}</p>
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {d.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    d.daysLeft <= 2 ? "bg-destructive/10 text-destructive" : d.daysLeft <= 7 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  }`}>
                    {d.daysLeft}d left
                  </span>
                  <button onClick={() => setDeadlines(deadlines.filter(x => x.id !== d.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className={`space-y-4 ${activeTab === "goals" ? "block" : "hidden"} lg:block`}>
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Add Goal</h3>
            <div className="flex gap-2">
              <Input placeholder="Enter your goal..." value={newGoal} onChange={e => setNewGoal(e.target.value)} className="flex-1" />
              <Button onClick={addGoal}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Active Goals</h3>
            <div className="space-y-2">
              {active.map(g => (
                <div key={g.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <button className="flex items-center gap-3" onClick={() => toggleGoal(g.id)}>
                    <Circle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{g.text}</span>
                  </button>
                  <button onClick={() => setGoals(goals.filter(x => x.id !== g.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {completed.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-display text-sm font-bold text-muted-foreground mb-3">Completed</h3>
              <div className="space-y-2">
                {completed.map(g => (
                  <div key={g.id} className="flex items-center justify-between py-2 px-3">
                    <button className="flex items-center gap-3" onClick={() => toggleGoal(g.id)}>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground line-through">{g.text}</span>
                    </button>
                    <button onClick={() => setGoals(goals.filter(x => x.id !== g.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DeadlinesGoals;
