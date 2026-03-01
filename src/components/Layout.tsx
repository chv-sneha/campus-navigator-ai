import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingChatbot from "./FloatingChatbot";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  Home,
  LayoutDashboard,
  Film,
  Clock,
  FileText,
  Calendar,
  User,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Reels", icon: Film, path: "/reels" },
  { label: "Deadlines & Goals", icon: Clock, path: "/deadlines" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Timetable", icon: Calendar, path: "/timetable" },
  { label: "Profile", icon: User, path: "/profile" },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({ name: "", course: "", branch: "" });

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const profileDoc = await getDoc(doc(db, "users", user.uid, "profile", "data"));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setUserProfile({
          name: user.displayName || "",
          course: data.course || "",
          branch: data.branch || ""
        });
      } else {
        setUserProfile({ name: user.displayName || "", course: "", branch: "" });
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{
          width: 240,
          background: "hsl(var(--sidebar-bg))",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="w-5 h-5" style={{ color: "hsl(var(--sidebar-active-fg))" }} />
          </div>
          <span className="font-display text-lg font-bold" style={{ color: "hsl(var(--sidebar-fg))" }}>
            CampusIQ
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link w-full ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--sidebar-fg))" }}>{userProfile.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{userProfile.course && userProfile.branch ? `${userProfile.course} ${userProfile.branch}` : 'Complete profile'}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-md transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "hsl(var(--sidebar-bg))" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="w-5 h-5" style={{ color: "hsl(var(--sidebar-active-fg))" }} />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: "hsl(var(--sidebar-fg))" }}>
              CampusIQ
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1">
            <X className="w-5 h-5" style={{ color: "hsl(var(--sidebar-fg))" }} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`sidebar-link w-full ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--sidebar-fg))" }}>{userProfile.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{userProfile.course && userProfile.branch ? `${userProfile.course} ${userProfile.branch}` : 'Complete profile'}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-md transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[240px] pb-20 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold">CampusIQ</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="p-4 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 py-2">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bottom-nav-link py-1 px-2 ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default Layout;
