import { useState } from "react";
import Layout from "@/components/Layout";
import { Edit2, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [morningBriefing, setMorningBriefing] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState([3]);
  const [language, setLanguage] = useState("English");
  const [useLanguageInContent, setUseLanguageInContent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Arjun Kumar",
    college: "National Institute of Technology, Warangal",
    branch: "Computer Science & Engineering",
    year: "2nd Year — Semester IV",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const professors = [
    { name: "Prof. Sharma", citation: "APA" },
    { name: "Dr. Patel", citation: "Harvard" },
    { name: "Prof. Gupta", citation: "MLA" },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold bg-primary text-primary-foreground">
              AK
            </div>
            {editing ? (
              <div className="space-y-3 text-left">
                <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                <Input value={profile.college} onChange={e => setProfile({ ...profile, college: e.target.value })} />
                <Input value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value })} />
                <Input value={profile.year} onChange={e => setProfile({ ...profile, year: e.target.value })} />
                <Button className="w-full" onClick={() => { setEditing(false); toast({ title: "Profile updated ✅" }); }}>Save</Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-lg font-bold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{profile.college}</p>
                <p className="text-sm text-muted-foreground">{profile.branch}</p>
                <p className="text-xs text-muted-foreground mt-1">{profile.year}</p>
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
              <Button className="w-full" onClick={() => toast({ title: "Language preferences saved ✅" })}>Save Preferences</Button>
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
                  {professors.map((p, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground font-medium">{p.name}</td>
                      <td className="py-3 text-muted-foreground">{p.citation}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-5 border-destructive/20">
            <h3 className="font-display text-sm font-bold text-destructive mb-3">Danger Zone</h3>
            <Button variant="destructive" onClick={() => { navigate("/"); toast({ title: "Logged out successfully" }); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
