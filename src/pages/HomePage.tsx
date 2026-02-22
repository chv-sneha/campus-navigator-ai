import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  FileText,
  Film,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const features = [
  {
    icon: Film,
    title: "AI Concept Reels",
    desc: "Learn any topic in 30–120 second interactive video reels with instant quizzes to lock in your understanding.",
  },
  {
    icon: FileText,
    title: "Smart Document Generator",
    desc: "Create perfectly formatted assignments tailored to each professor's citation style, font, and structure preferences.",
  },
  {
    icon: Clock,
    title: "Deadline & Goal Tracker",
    desc: "Never miss a submission again. Color-coded urgency, smart reminders, and daily goal checklists keep you on track.",
  },
  {
    icon: BookOpen,
    title: "Intelligent Timetable",
    desc: "Upload your schedule or build it manually. Get daily briefings on what classes you have and what to carry.",
  },
  {
    icon: Brain,
    title: "Confidence Mapping",
    desc: "Visualize your strengths and weak spots across subjects. Our AI adapts recommendations based on your progress.",
  },
  {
    icon: Target,
    title: "Morning Briefings",
    desc: "Start every day with an AI-written summary of your classes, deadlines, and priorities — like a personal academic coach.",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "50K+", label: "Reels Generated" },
  { value: "98%", label: "On-Time Submissions" },
  { value: "4.9★", label: "Student Rating" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative -m-4 lg:-m-8 mb-0 overflow-hidden rounded-none">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220, 40%, 8%, 0.88), hsl(230, 50%, 15%, 0.75))" }} />
        </div>

        {/* Floating glow effects */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "hsl(var(--accent))" }} />

        <div className="relative z-10 px-6 lg:px-16 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide" style={{ background: "hsl(var(--primary) / 0.25)", color: "hsl(var(--accent))" }}>
              <Zap className="w-3.5 h-3.5" />
              AI-POWERED LEARNING PLATFORM
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "hsl(0, 0%, 100%)" }}>
              Your AI Co-Pilot for{" "}
              <span style={{ color: "hsl(var(--accent))" }}>College Life</span>
            </h1>

            <p className="text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl" style={{ color: "hsl(220, 20%, 75%)" }}>
              CampusIQ combines AI-powered concept explanations, smart document generation, and intelligent scheduling to help you ace every semester — effortlessly.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold border-2"
                style={{ borderColor: "hsl(0, 0%, 100%, 0.2)", color: "hsl(0, 0%, 100%)", background: "transparent" }}
                onClick={() => navigate("/reels")}
              >
                Try a Reel
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl"
          >
            {stats.map((s, i) => (
              <div key={i}>
                <p className="font-display text-2xl lg:text-3xl font-bold" style={{ color: "hsl(0, 0%, 100%)" }}>{s.value}</p>
                <p className="text-xs font-medium mt-1" style={{ color: "hsl(220, 20%, 60%)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 px-2">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> FEATURES
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Six powerful tools designed specifically for college students — all powered by AI and built into one seamless platform.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: "hsl(var(--accent))" }} />
          <div className="relative z-10">
            <GraduationCap className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(var(--accent))" }} />
            <h2 className="font-display text-2xl lg:text-3xl font-bold mb-3" style={{ color: "hsl(0, 0%, 100%)" }}>
              Ready to supercharge your semester?
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "hsl(220, 20%, 70%)" }}>
              Join thousands of students who are already using CampusIQ to study smarter, submit on time, and stay ahead.
            </p>
            <Button size="lg" className="h-12 px-10 text-base font-semibold" onClick={() => navigate("/dashboard")}>
              Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;
