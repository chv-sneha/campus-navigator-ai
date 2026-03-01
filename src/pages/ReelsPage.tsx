import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import AnimatedReel from "@/components/AnimatedReel";
import { Search, Play, Pause, RotateCcw, Info, CheckCircle, XCircle, ChevronRight } from "lucide-react";
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



const mcqData: Record<string, Array<{ question: string; options: string[]; correct: number }>> = {
  "Binary Trees": [
    { question: "What is the time complexity of searching in a balanced BST?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
    { question: "In a binary tree, what is the maximum number of nodes at level L?", options: ["L", "2^L", "2L", "L^2"], correct: 1 }
  ],
  "Sorting": [
    { question: "Which sorting algorithm has O(n log n) average time complexity?", options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"], correct: 1 },
    { question: "Which sort is stable?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], correct: 2 }
  ],
  "Graphs": [
    { question: "What data structure is used in BFS?", options: ["Stack", "Queue", "Heap", "Tree"], correct: 1 },
    { question: "What is the time complexity of DFS?", options: ["O(V)", "O(E)", "O(V+E)", "O(V*E)"], correct: 2 }
  ],
  "DP": [
    { question: "What is the key principle of Dynamic Programming?", options: ["Divide and Conquer", "Optimal Substructure", "Greedy Choice", "Backtracking"], correct: 1 },
    { question: "Which approach is used in DP?", options: ["Top-down only", "Bottom-up only", "Both", "Neither"], correct: 2 }
  ],
  "Hashing": [
    { question: "What is the average time complexity of hash table lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2 },
    { question: "What handles collisions in separate chaining?", options: ["Arrays", "Linked Lists", "Trees", "Stacks"], correct: 1 }
  ],
  "OS Scheduling": [
    { question: "Which scheduling algorithm can cause starvation?", options: ["Round Robin", "FCFS", "Priority", "SJF"], correct: 2 },
    { question: "What does preemptive scheduling allow?", options: ["Process switching", "No interrupts", "FIFO only", "Single tasking"], correct: 0 }
  ],
  "Normalization": [
    { question: "What does 1NF eliminate?", options: ["Partial dependencies", "Transitive dependencies", "Repeating groups", "All anomalies"], correct: 2 },
    { question: "Which normal form removes transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 2 }
  ],
  "TCP/IP": [
    { question: "Which layer does TCP operate at?", options: ["Application", "Transport", "Network", "Data Link"], correct: 1 },
    { question: "What does TCP guarantee?", options: ["Speed", "Reliability", "Broadcasting", "Multicast"], correct: 1 }
  ],
  "OOP Concepts": [
    { question: "What is encapsulation?", options: ["Inheritance", "Data hiding", "Polymorphism", "Abstraction"], correct: 1 },
    { question: "Which allows multiple forms?", options: ["Encapsulation", "Inheritance", "Polymorphism", "Composition"], correct: 2 }
  ],
  "Recursion": [
    { question: "What is the base case in recursion?", options: ["First call", "Stopping condition", "Loop", "Return value"], correct: 1 },
    { question: "What can cause stack overflow?", options: ["Too many variables", "Missing base case", "Fast execution", "Return statements"], correct: 1 }
  ],
};

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
  const [customTime, setCustomTime] = useState("");
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [deepDiveGenerated, setDeepDiveGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMcq, setShowMcq] = useState(false);
  const [currentMcq, setCurrentMcq] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [mcqResults, setMcqResults] = useState<boolean[]>([]);
  const [reExplaining, setReExplaining] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [topicLevels, setTopicLevels] = useState<Record<string, string>>(
    Object.fromEntries(confidenceTopics.map(t => [t.name, t.level]))
  );
  const conceptInputRef = useRef<HTMLInputElement>(null);
  const deepDiveInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getSpeed = () => {
    if (timeLimit === "Custom" && customTime) {
      const match = customTime.match(/(\d+)/);
      return match ? parseInt(match[1]) / 60 : 1;
    }
    const speeds: Record<string, number> = { "30s": 0.5, "60s": 1, "90s": 1.5, "2min": 2 };
    return speeds[timeLimit] || 1;
  };

  const handleGenerate = () => {
    if (!concept.trim()) {
      toast({ title: "Enter a concept first", variant: "destructive" });
      return;
    }

    const normalizedConcept = concept.trim();
    const topicNames = confidenceTopics.map(t => t.name);
    
    if (!topicNames.some(t => t.toLowerCase() === normalizedConcept.toLowerCase())) {
      toast({ 
        title: "Demo reels available for featured topics only", 
        description: `Available: ${topicNames.join(", ")}`,
        variant: "destructive" 
      });
      return;
    }

    setGenerated(true);
    setPlaying(true);
    setShowMcq(false);
    setCurrentMcq(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setMcqResults([]);
    setReExplaining(false);
  };

  const getDuration = () => {
    if (timeLimit === "Custom" && customTime) {
      const match = customTime.match(/(\d+)/);
      return match ? parseInt(match[1]) * 1000 : 60000;
    }
    const durations: Record<string, number> = { "30s": 30000, "60s": 60000, "90s": 90000, "2min": 120000 };
    return durations[timeLimit] || 60000;
  };

  const handleReelComplete = () => {
    setPlaying(false);
    setShowMcq(true);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleAnswer = () => {
    setAnswered(true);
    const matchedTopic = confidenceTopics.find(t => t.name.toLowerCase() === concept.toLowerCase());
    const topicName = matchedTopic?.name || concept;
    const questions = mcqData[topicName] || [];
    const isCorrect = selectedAnswer === questions[currentMcq]?.correct;
    
    const newResults = [...mcqResults, isCorrect];
    setMcqResults(newResults);

    if (!isCorrect) {
      toast({ title: "Not quite right!", description: "Let's re-explain this concept.", variant: "destructive" });
      setTimeout(() => {
        setReExplaining(true);
        setShowMcq(false);
        setPlaying(true);
        setTimeout(() => {
          setReExplaining(false);
          setShowMcq(true);
          setCurrentMcq(0);
          setSelectedAnswer(null);
          setAnswered(false);
          setMcqResults([]);
        }, 3000);
      }, 2000);
    } else if (currentMcq < 1) {
      setTimeout(() => {
        setCurrentMcq(1);
        setSelectedAnswer(null);
        setAnswered(false);
      }, 1500);
    } else {
      setTopicLevels(prev => ({ ...prev, [topicName]: "strong" }));
      toast({ title: `✅ ${topicName} marked as understood!`, description: "Great job! Concept mastered." });
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
    setActiveStep(0);
  };

  const roadmapSteps = [
    { title: `Introduction to ${deepDiveTopic}`, desc: "Learn the basics and why it matters" },
    { title: "Core Concepts", desc: "Deep dive into fundamental principles" },
    { title: "Visual Explanation", desc: "See it in action with diagrams" },
    { title: "Real-world Use Cases", desc: "Practical applications and examples" },
    { title: "Practice Problems", desc: "Test your understanding" },
  ];

  const times = ["30s", "60s", "90s", "2min", "Custom"];

  const matchedTopic = confidenceTopics.find(t => t.name.toLowerCase() === concept.toLowerCase());
  const topicName = matchedTopic?.name || concept;
  const questions = mcqData[topicName] || [];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Concept Explainer</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn any concept through short AI-generated reels</p>
      </div>

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

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                In this demo, videos are available for the topics shown in the Confidence Map only.
              </p>
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
              {timeLimit === "Custom" && (
                <Input
                  placeholder="e.g., 3 min, 150s"
                  className="mt-2 h-9"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                />
              )}
            </div>

            <Button className="w-full h-11 font-semibold" onClick={handleGenerate}>
              Generate Reel
            </Button>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Confidence Map</h3>
            <div className="flex flex-wrap gap-2">
              {confidenceTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(t.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${levelColor[topicLevels[t.name]]}`}
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
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(220, 30%, 12%)" }}>
            <div className="aspect-video flex items-center justify-center relative">
              {!generated ? (
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-3" style={{ color: "hsl(220, 20%, 40%)" }} />
                  <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>Enter a concept and generate a reel</p>
                </div>
              ) : reExplaining ? (
                <div className="text-center px-8">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">Re-explaining...</h3>
                  <p className="text-sm" style={{ color: "hsl(220, 20%, 65%)" }}>Let's review {topicName} once more</p>
                </div>
              ) : (
                <AnimatedReel 
                  topic={topicName} 
                  isPlaying={playing} 
                  onPlayPause={handlePlayPause}
                  onComplete={handleReelComplete}
                  duration={getDuration()}
                />
              )}
            </div>
          </div>

          {showMcq && questions[currentMcq] && (
            <div className="glass-card p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-foreground">Question {currentMcq + 1} of 2</h3>
                <span className="text-xs text-muted-foreground">{mcqResults.filter(Boolean).length} correct</span>
              </div>
              <p className="text-sm text-foreground mb-4">{questions[currentMcq].question}</p>
              <div className="space-y-2 mb-4">
                {questions[currentMcq].options.map((opt, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                      selectedAnswer === i
                        ? answered
                          ? i === questions[currentMcq].correct
                            ? "border-success bg-success/10 text-success"
                            : "border-destructive bg-destructive/10 text-destructive"
                          : "border-primary bg-primary/10 text-primary"
                        : answered && i === questions[currentMcq].correct
                        ? "border-success bg-success/10 text-success"
                        : "border-border bg-card text-foreground hover:bg-secondary/50"
                    }`}
                    onClick={() => !answered && setSelectedAnswer(i)}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
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
                  selectedAnswer === questions[currentMcq].correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  {selectedAnswer === questions[currentMcq].correct ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {selectedAnswer === questions[currentMcq].correct
                    ? currentMcq === 1 ? "Perfect! Both questions correct!" : "Correct! Next question..."
                    : "Wrong answer. Re-explaining the concept..."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                Type a topic, pick a time limit. Get a bite-sized explainer reel. Answer 2 MCQs after — wrong means re-explain, right means concept marked done.
              </p>
            </div>
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

          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Confidence Map</h3>
            <div className="flex flex-wrap gap-2">
              {confidenceTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(t.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${levelColor[topicLevels[t.name]]}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              <div className="glass-card p-5">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Learning Roadmap: {deepDiveTopic}</h3>
                <Progress value={(activeStep / roadmapSteps.length) * 100} className="mb-4" />
                <div className="space-y-2">
                  {roadmapSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        activeStep === idx
                          ? "border-primary bg-primary/10"
                          : idx < activeStep
                          ? "border-success/30 bg-success/5"
                          : "border-border bg-card hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          activeStep === idx
                            ? "bg-primary text-primary-foreground"
                            : idx < activeStep
                            ? "bg-success text-success-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {idx < activeStep ? "✓" : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                        {activeStep === idx && <ChevronRight className="w-5 h-5 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="font-display text-base font-bold text-foreground mb-3">
                  Step {activeStep + 1}: {roadmapSteps[activeStep].title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeStep === 0 && `${deepDiveTopic} is a fundamental concept. This introduction covers the basic terminology and motivation.`}
                  {activeStep === 1 && `The key principles of ${deepDiveTopic} include understanding mechanisms, data flow, and algorithmic approaches.`}
                  {activeStep === 2 && `Visual representations help understand ${deepDiveTopic} better. See diagrams and flowcharts here.`}
                  {activeStep === 3 && `Real-world applications of ${deepDiveTopic} in web development, system design, and data processing.`}
                  {activeStep === 4 && `Test your understanding with practice problems and coding challenges related to ${deepDiveTopic}.`}
                </p>
                <div className="flex gap-2">
                  {activeStep > 0 && (
                    <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
                      Previous
                    </Button>
                  )}
                  {activeStep < roadmapSteps.length - 1 ? (
                    <Button onClick={() => setActiveStep(activeStep + 1)}>
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={() => toast({ title: "🎉 Deep Dive Complete!", description: `You've mastered ${deepDiveTopic}!` })}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </Layout>
  );
};

export default ReelsPage;
