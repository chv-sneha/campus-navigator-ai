import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Plus, Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface Deadline {
  id: string;
  subject: string;
  date: string;
  description: string;
  daysLeft: number;
}

interface Goal {
  id: string;
  text: string;
  done: boolean;
}

const urgencyColor = (days: number) => {
  if (days <= 2) return "border-l-destructive";
  if (days <= 7) return "border-l-warning";
  return "border-l-success";
};

const DeadlinesGoals = () => {
  const [user, loading] = useAuthState(auth);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [activeTab, setActiveTab] = useState<"deadlines" | "goals">("deadlines");
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const deadlinesQuery = query(collection(db, `users/${user.uid}/deadlines`), orderBy("createdAt", "asc"));
    const goalsQuery = query(collection(db, `users/${user.uid}/goals`), orderBy("createdAt", "asc"));

    const unsubDeadlines = onSnapshot(deadlinesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        const daysLeft = Math.max(0, Math.ceil((new Date(d.date).getTime() - Date.now()) / 86400000));
        return { id: doc.id, ...d, daysLeft } as Deadline;
      });
      setDeadlines(data);
    });

    const unsubGoals = onSnapshot(goalsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(data);
    });

    return () => {
      unsubDeadlines();
      unsubGoals();
    };
  }, [user]);

  const addDeadline = async () => {
    if (!newSubject || !newDate || !user) return;
    await addDoc(collection(db, `users/${user.uid}/deadlines`), {
      subject: newSubject,
      date: newDate,
      description: newDesc,
      createdAt: serverTimestamp()
    });
    setNewSubject(""); setNewDate(""); setNewDesc("");
    toast({ title: "Deadline added ✅" });
  };

  const addGoal = async () => {
    if (!newGoal.trim() || !user) return;
    await addDoc(collection(db, `users/${user.uid}/goals`), {
      text: newGoal,
      done: false,
      createdAt: serverTimestamp()
    });
    setNewGoal("");
    toast({ title: "Goal added ✅" });
  };

  const toggleGoal = async (id: string) => {
    if (!user) return;
    const goal = goals.find(g => g.id === id);
    if (goal) {
      await updateDoc(doc(db, `users/${user.uid}/goals`, id), { done: !goal.done });
    }
  };

  const deleteDeadline = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/deadlines`, id));
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/goals`, id));
  };

  const active = goals.filter(g => !g.done);
  const completed = goals.filter(g => g.done);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
            {deadlines.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No deadlines yet. Add one above!</p>
              </div>
            ) : (
              deadlines.map(d => (
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
                    <button onClick={() => deleteDeadline(d.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
              {active.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active goals. Add one above!</p>
              ) : (
                active.map(g => (
                  <div key={g.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <button className="flex items-center gap-3" onClick={() => toggleGoal(g.id)}>
                      <Circle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{g.text}</span>
                    </button>
                    <button onClick={() => deleteGoal(g.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
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
                    <button onClick={() => deleteGoal(g.id)} className="text-muted-foreground hover:text-destructive transition-colors">
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
