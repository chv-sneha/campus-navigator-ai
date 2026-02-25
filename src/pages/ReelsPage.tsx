import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Search, Play, Pause, RotateCcw, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const confidenceTopics = [
  { name: "Binary Trees", level: "strong" },
  { name: "Sorting", level: "strong" },
  { name: "Graphs", level: "shaky" },
  { name: "DP", level: "red" },
  { name: "Hashing", level: "strong" },
  { name: "OS Scheduling", level: "shaky" },
  { name: "Normalization", level: "strong" },
  { name: "TCP/IP", level: "red" },
  { name: "OOP Concepts", level: "strong" },
  { name: "Recursion", level: "shaky" },
];

const levelColor: Record<string, string> = {
  strong: "bg-success text-success-foreground",
  shaky: "bg-warning text-warning-foreground",
  red: "bg-destructive text-destructive-foreground",
};

const ReelsPage = () => {
  const [mode, setMode] = useState<"reel" | "deepdive">("reel");
  const [concept, setConcept] = useState("");
  const [deepDiveTopic, setDeepDiveTopic] = useState("");
  const [timeLimit, setTimeLimit] = useState("60s");
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [deepDiveGenerated, setDeepDiveGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMcq, setShowMcq] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const conceptInputRef = useRef<HTMLInputElement>(null);
  const deepDiveInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!concept.trim()) {
      toast({ title: "Enter a concept first", variant: "destructive" });
      return;
    }
    setGenerated(true);
    setPlaying(true);
    setProgress(0);
    setShowMcq(false);
    setSelectedAnswer(null);
    setAnswered(false);

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setPlaying(false);
        setShowMcq(true);
      }
    }, 100);
  };

  const handleAnswer = () => {
    setAnswered(true);
    if (selectedAnswer === 1) {
      toast({ title: "Correct! 🎉", description: "Great understanding of the concept." });
    } else {
      toast({ title: "Not quite!", description: "Review the concept and try again.", variant: "destructive" });
    }
  };

  const handleChipClick = (topicName: string) => {
    if (mode === "reel") {
      setConcept(topicName);
      conceptInputRef.current?.focus();
    } else {
      setDeepDiveTopic(topicName);
      deepDiveInputRef.current?.focus();
    }
  };

  const handleDeepDiveGenerate = () => {
    if (!deepDiveTopic.trim()) {
      toast({ title: "Enter a topic first", variant: "destructive" });
      return;
    }
    setDeepDiveGenerated(true);
    setExpandedChapter(null);
    setCompletedChapters([]);
  };

  const chapters = [
    { title: "Introduction", content: `${deepDiveTopic} is a fundamental concept in computer science. This chapter introduces the basic terminology and motivation behind studying this topic.` },
    { title: "Core Concepts", content: `The key principles of ${deepDiveTopic} include understanding the underlying mechanisms, data flow, and algorithmic approaches used in implementation.` },
    { title: "Examples & Applications", content: `Real-world applications of ${deepDiveTopic} can be found in various domains including web development, system design, and data processing pipelines.` },
    { title: "Common Mistakes", content: `Students often struggle with edge cases and boundary conditions. Always validate inputs and consider performance implications.` },
    { title: "Quick Revision Summary", content: `Key takeaways: Master the fundamentals, practice with examples, understand time/space complexity, and review common pitfalls.` },
  ];

  const times = ["30s", "60s", "90s", "2min"];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Concept Explainer</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn any concept through short AI-generated reels</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("reel")}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            mode === "reel" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
          }`}
        >
          ⚡ Quick Reel
        </button>
        <button
          onClick={() => setMode("deepdive")}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            mode === "deepdive" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
          }`}
        >
          📖 Deep Dive
        </button>
      </div>

      {mode === "reel" ? (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={conceptInputRef}
                placeholder="Enter concept to explain..."
                className="pl-10 h-11"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Time Limit</label>
              <div className="flex gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    className={`pill-button flex-1 ${timeLimit === t ? "active" : ""}`}
                    onClick={() => setTimeLimit(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full h-11 font-semibold" onClick={handleGenerate}>
              Generate Reel
            </Button>
          </div>

          {/* Confidence Map */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Confidence Map</h3>
            <div className="flex flex-wrap gap-2">
              {confidenceTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(t.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${levelColor[t.level]}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Strong</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Shaky</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Not Studied</span>
            </div>
          </div>

          {/* Recent Reels */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Recent Reels</h3>
            <div className="space-y-2">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Binary Trees</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">60s • 2 hours ago</span>
                  <span className="text-xs font-semibold text-success">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Recursion</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">90s • Yesterday</span>
                  <span className="text-xs font-semibold text-success">+8%</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Graph Traversal</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">60s • 2 days ago</span>
                  <span className="text-xs font-semibold text-success">+15%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">7-Day Confidence Trend</h4>
              <div className="h-20 flex items-end gap-1">
                {[65, 68, 72, 70, 75, 78, 82].map((val, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${val}%` }}>
                    <div className="w-full bg-primary rounded-t" style={{ height: "100%" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Player */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(220, 30%, 12%)" }}>
            <div className="aspect-video flex items-center justify-center relative">
              {!generated ? (
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-3" style={{ color: "hsl(220, 20%, 40%)" }} />
                  <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>Enter a concept and generate a reel</p>
                </div>
              ) : (
                <div className="text-center px-8">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                    {concept || "Binary Search Trees"}
                  </h3>
                  <p className="text-sm" style={{ color: "hsl(220, 20%, 65%)" }}>
                    {playing
                      ? "A Binary Search Tree is a node-based data structure where each node has at most two children. The left subtree contains only nodes with keys less than the parent..."
                      : "Reel complete! Test your knowledge below."}
                  </p>
                </div>
              )}
            </div>
            {generated && (
              <div className="px-4 py-3 flex items-center gap-3">
                <button onClick={() => setPlaying(!playing)} className="text-primary-foreground">
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <Progress value={progress} className="flex-1 h-1.5" />
                <span className="text-xs" style={{ color: "hsl(220, 20%, 60%)" }}>{Math.round(progress)}%</span>
              </div>
            )}
          </div>

          {/* MCQ */}
          {showMcq && (
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="font-display text-base font-bold text-foreground mb-3">Quick Check</h3>
              <p className="text-sm text-foreground mb-4">What is the time complexity of searching in a balanced BST?</p>
              <div className="space-y-2 mb-4">
                {["O(n)", "O(log n)", "O(n²)", "O(1)"].map((opt, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                      selectedAnswer === i
                        ? answered
                          ? i === 1
                            ? "border-success bg-success/10 text-success"
                            : "border-destructive bg-destructive/10 text-destructive"
                          : "border-primary bg-primary/10 text-primary"
                        : answered && i === 1
                        ? "border-success bg-success/10 text-success"
                        : "border-border bg-card text-foreground hover:bg-secondary/50"
                    }`}
                    onClick={() => !answered && setSelectedAnswer(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {!answered ? (
                <Button className="w-full" onClick={handleAnswer} disabled={selectedAnswer === null}>
                  Submit Answer
                </Button>
              ) : (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  selectedAnswer === 1 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  {selectedAnswer === 1 ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {selectedAnswer === 1
                    ? "Correct! Balanced BST search is O(log n) due to halving at each step."
                    : "The correct answer is O(log n). Each comparison halves the remaining nodes."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={deepDiveInputRef}
                placeholder="Enter a topic to learn in depth..."
                className="pl-10 h-11"
                value={deepDiveTopic}
                onChange={(e) => setDeepDiveTopic(e.target.value)}
              />
            </div>
            <Button className="w-full h-11 font-semibold" onClick={handleDeepDiveGenerate}>
              Start Deep Dive
            </Button>
          </div>

          {/* Confidence Map */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Confidence Map</h3>
            <div className="flex flex-wrap gap-2">
              {confidenceTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(t.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${levelColor[t.level]}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Strong</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Shaky</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Not Studied</span>
            </div>
          </div>

          {/* Recent Reels */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Recent Reels</h3>
            <div className="space-y-2">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Binary Trees</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">60s • 2 hours ago</span>
                  <span className="text-xs font-semibold text-success">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Recursion</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">90s • Yesterday</span>
                  <span className="text-xs font-semibold text-success">+8%</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-medium text-foreground">Graph Traversal</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">60s • 2 days ago</span>
                  <span className="text-xs font-semibold text-success">+15%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">7-Day Confidence Trend</h4>
              <div className="h-20 flex items-end gap-1">
                {[65, 68, 72, 70, 75, 78, 82].map((val, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${val}%` }}>
                    <div className="w-full bg-primary rounded-t" style={{ height: "100%" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Deep Dive Content */}
        <div className="lg:col-span-3 space-y-4">
          {!deepDiveGenerated ? (
            <div className="glass-card p-6 min-h-[500px] flex items-center justify-center text-center">
              <div>
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Enter a topic to start your deep dive</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-foreground">Progress</h3>
                  <span className="text-xs font-semibold text-primary">{completedChapters.length}/5 chapters completed</span>
                </div>
                <Progress value={(completedChapters.length / 5) * 100} className="mt-2" />
              </div>

              {chapters.map((chapter, idx) => (
                <div key={idx} className={`glass-card transition-all ${completedChapters.includes(idx) ? "bg-success/5 border-success/20" : ""}`}>
                  <button
                    onClick={() => setExpandedChapter(expandedChapter === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      {completedChapters.includes(idx) && <CheckCircle className="w-4 h-4 text-success" />}
                      <span className="font-medium text-sm text-foreground">{chapter.title}</span>
                    </div>
                    {expandedChapter === idx ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {expandedChapter === idx && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{chapter.content}</p>
                      {!completedChapters.includes(idx) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setCompletedChapters([...completedChapters, idx]);
                            toast({ title: "Chapter marked as understood ✓" });
                          }}
                        >
                          Mark as Understood ✓
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </Layout>
  );
};

export default ReelsPage;
