import { useState } from "react";
import Layout from "@/components/Layout";
import { Search, Play, Pause, RotateCcw, CheckCircle, XCircle } from "lucide-react";
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
  const [concept, setConcept] = useState("");
  const [timeLimit, setTimeLimit] = useState("60s");
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMcq, setShowMcq] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
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

  const times = ["30s", "60s", "90s", "2min"];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Concept Explainer</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn any concept through short AI-generated reels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
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
                <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${levelColor[t.level]}`}>
                  {t.name}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Strong</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Shaky</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Not Studied</span>
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
    </Layout>
  );
};

export default ReelsPage;
