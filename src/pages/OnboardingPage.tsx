import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const OnboardingPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    course: "",
    college: "",
    branch: "",
    year: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "data"), {
        role: formData.role,
        course: formData.course,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        morningBriefing: true,
        deadlineReminder: true,
        reminderDays: 3,
        language: "English",
        useLanguageInContent: false,
        onboardingCompleted: true,
      });
      toast({ title: "Profile setup complete!" });
      navigate("/home");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">CampusIQ</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Complete your profile</h2>
        <p className="text-muted-foreground text-sm mb-8">Tell us a bit about yourself</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">I am a</label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            placeholder="College/University"
            className="h-11"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            required
          />

          {formData.role === "student" && (
            <>
              <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="B.Sc">B.Sc</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="M.Sc">M.Sc</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Branch (e.g., CSE, ECE)"
                className="h-11"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                required
              />
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {formData.role === "professor" && (
            <Input
              type="text"
              placeholder="Department"
              className="h-11"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              required
            />
          )}

          <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
