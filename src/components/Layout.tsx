import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Film,
  Clock,
  FileText,
  Calendar,
  User,
  LogOut,
  GraduationCap,
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
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
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--sidebar-fg))" }}>Arjun Kumar</p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>B.Tech CSE</p>
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold">CampusIQ</span>
          </div>
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
    </div>
  );
};

export default Layout;
