import { useState } from "react";
import Layout from "@/components/Layout";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Lightbulb,
  Plus,
  FileText,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Classes", value: "4", sub: "Next: Data Structures at 10 AM", icon: BookOpen, color: "primary" },
    { label: "Upcoming Deadlines", value: "3", sub: "OS Assignment — Due Tomorrow", icon: Clock, color: "destructive" },
    { label: "Confidence Score", value: "72%", sub: "↑ 5% from last week", icon: TrendingUp, color: "success" },
    { label: "Goals Today", value: "2/5", sub: "40% completed", icon: Target, color: "warning" },
  ];

  const quickActions = [
    { label: "Explain a concept", icon: Lightbulb, path: "/reels" },
    { label: "Add deadline", icon: Plus, path: "/deadlines" },
    { label: "Generate document", icon: FileText, path: "/documents" },
    { label: "View timetable", icon: Calendar, path: "/timetable" },
  ];

  const recentActivity = [
    { action: "Generated assignment", detail: "Database Normalization — Prof. Sharma", time: "2 hours ago" },
    { action: "Watched reel", detail: "Binary Search Trees explained in 60s", time: "3 hours ago" },
    { action: "Added deadline", detail: "CN Lab Report — Due Mar 5", time: "5 hours ago" },
    { action: "Completed goal", detail: "Revise Chapter 4 — Operating Systems", time: "Yesterday" },
    { action: "Updated timetable", detail: "Added extra lab on Saturday", time: "Yesterday" },
  ];

  const checklist = [
    "Laptop + charger",
    "DS notebook",
    "Lab manual (CN)",
    "ID card",
  ];

  return (
    <Layout>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Good Morning, Arjun 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your mission for today</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-foreground">Saturday, Feb 22, 2026</p>
          <p className="text-xs text-muted-foreground">Week 6 • Semester IV</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <s.icon className={`w-4 h-4 text-${s.color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            {s.label === "Goals Today" && <Progress value={40} className="mt-3 h-1.5" />}
          </div>
        ))}
      </div>

      {/* Two Column: Briefing + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        {/* Morning Briefing */}
        <div className="lg:col-span-3 briefing-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" />
            <h2 className="font-display text-lg font-bold">Morning Briefing</h2>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            You have 4 classes today starting with Data Structures at 10 AM. Your OS assignment is due tomorrow — 
            you've completed 60% of it. Consider finishing the remaining sections during the free period at 2 PM.
            Your confidence in Binary Trees improved by 12% after yesterday's reel session! 🎯
          </p>
          <div>
            <h3 className="font-semibold text-sm mb-2">📋 What to carry today</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {checklist.map((item, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 opacity-60" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="font-display text-base font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center"
              >
                <a.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display text-base font-bold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
