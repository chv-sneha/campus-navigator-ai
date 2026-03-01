import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Edit2, Trash2, LogOut, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc, collection, addDoc, deleteDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";

interface Professor {
  id: string;
  name: string;
  citation: string;
}

const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const [morningBriefing, setMorningBriefing] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState([3]);
  const [language, setLanguage] = useState("English");
  const [useLanguageInContent, setUseLanguageInContent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
  });
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [newProfName, setNewProfName] = useState("");
  const [newProfCitation, setNewProfCitation] = useState("APA");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    setProfile(prev => ({
      ...prev,
      name: user.displayName || "",
      email: user.email || "",
    }));

    const loadProfile = async () => {
      const profileDoc = await getDoc(doc(db, `users/${user.uid}/profile`));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile(prev => ({ ...prev, college: data.college || "", branch: data.branch || "", year: data.year || "" }));
        setMorningBriefing(data.morningBriefing ?? true);
        setDeadlineReminder(data.deadlineReminder ?? true);
        setReminderDays([data.reminderDays ?? 3]);
        setLanguage(data.language || "English");
        setUseLanguageInContent(data.useLanguageInContent ?? false);
      }
    };

    const professorsQuery = query(collection(db, `users/${user.uid}/professors`), orderBy("createdAt", "asc"));
    const unsubProfessors = onSnapshot(professorsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professor));
      setProfessors(data);
    });

    loadProfile();

    return () => {
      unsubProfessors();
    };
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, `users/${user.uid}/profile`), {
      college: profile.college,
      branch: profile.branch,
      year: profile.year
    }, { merge: true });
    setEditing(false);
    toast({ title: "Profile updated ✅" });
  };

  const savePreferences = async () => {
    if (!user) return;
    await setDoc(doc(db, `users/${user.uid}/profile`), {
      morningBriefing,
      deadlineReminder,
      reminderDays: reminderDays[0],
      language,
      useLanguageInContent
    }, { merge: true });
    toast({ title: "Language preferences saved ✅" });
  };

  const addProfessor = async () => {
    if (!user || !newProfName.trim()) return;
    await addDoc(collection(db, `users/${user.uid}/professors`), {
      name: newProfName,
      citation: newProfCitation,
      createdAt: serverTimestamp()
    });
    setNewProfName("");
    setNewProfCitation("APA");
    toast({ title: "Professor added ✅" });
  };

  const deleteProfessor = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/professors`, id));
    toast({ title: "Professor deleted" });
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold bg-primary text-primary-foreground">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            {editing ? (
              <div className="space-y-3 text-left">
                <Input placeholder="College" value={profile.college} onChange={e => setProfile({ ...profile, college: e.target.value })} />
                <Input placeholder="Branch" value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value })} />
                <Input placeholder="Year" value={profile.year} onChange={e => setProfile({ ...profile, year: e.target.value })} />
                <Button className="w-full" onClick={saveProfile}>Save</Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-lg font-bold text-foreground">{profile.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                {profile.college && <p className="text-sm text-muted-foreground">{profile.college}</p>}
                {profile.branch && <p className="text-sm text-muted-foreground">{profile.branch}</p>}
                {profile.year && <p className="text-xs text-muted-foreground mt-1">{profile.year}</p>}
                <Button variant="outline" className="mt-4" onClick={() => setEditing(true)}>
                  <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Notifications */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Morning Briefing</p>
                  <p className="text-xs text-muted-foreground">Get a daily summary at 7 AM</p>
                </div>
                <Switch checked={morningBriefing} onCheckedChange={setMorningBriefing} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Deadline Reminders</p>
                  <p className="text-xs text-muted-foreground">Receive alerts before deadlines</p>
                </div>
                <Switch checked={deadlineReminder} onCheckedChange={setDeadlineReminder} />
              </div>
              {deadlineReminder && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Remind me {reminderDays[0]} day(s) before</p>
                  <Slider value={reminderDays} onValueChange={setReminderDays} min={1} max={7} step={1} className="w-full" />
                </div>
              )}
            </div>
          </div>

          {/* Language Preferences */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Content & Interface Language</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Preferred Language</p>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Use selected language in Reels and Chatbot</p>
                  <p className="text-xs text-muted-foreground">Apply language preference to content</p>
                </div>
                <Switch checked={useLanguageInContent} onCheckedChange={setUseLanguageInContent} />
              </div>
              <Button className="w-full" onClick={savePreferences}>Save Preferences</Button>
            </div>
          </div>

          {/* Saved Professors */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Saved Professors</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase">Citation Style</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {professors.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground font-medium">{p.name}</td>
                      <td className="py-3 text-muted-foreground">{p.citation}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => deleteProfessor(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Professor name" value={newProfName} onChange={e => setNewProfName(e.target.value)} className="flex-1" />
              <Select value={newProfCitation} onValueChange={setNewProfCitation}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APA">APA</SelectItem>
                  <SelectItem value="Harvard">Harvard</SelectItem>
                  <SelectItem value="MLA">MLA</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addProfessor}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-5 border-destructive/20">
            <h3 className="font-display text-sm font-bold text-destructive mb-3">Danger Zone</h3>
            <Button variant="destructive" onClick={async () => { await signOut(auth); navigate("/"); toast({ title: "Logged out successfully" }); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
        </>
      )}
    </Layout>
  );
};

export default ProfilePage;
