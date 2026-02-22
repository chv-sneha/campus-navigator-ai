import { useState } from "react";
import Layout from "@/components/Layout";
import { FileText, Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Professor {
  id: number;
  name: string;
  citation: string;
  font: string;
  spacing: string;
  structure: string;
}

const initialProfessors: Professor[] = [
  { id: 1, name: "Prof. Sharma", citation: "APA", font: "Times New Roman", spacing: "1.5", structure: "Introduction → Literature Review → Methodology → Results → Conclusion" },
  { id: 2, name: "Dr. Patel", citation: "Harvard", font: "Arial", spacing: "2.0", structure: "Abstract → Background → Analysis → Discussion → References" },
  { id: 3, name: "Prof. Gupta", citation: "MLA", font: "Calibri", spacing: "1.15", structure: "Problem Statement → Theory → Implementation → Testing → Conclusion" },
];

const DocumentGenerator = () => {
  const [topic, setTopic] = useState("");
  const [selectedProf, setSelectedProf] = useState("");
  const [format, setFormat] = useState<"PDF" | "DOCX">("PDF");
  const [professors, setProfessors] = useState(initialProfessors);
  const [generated, setGenerated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newProf, setNewProf] = useState({ name: "", citation: "APA", font: "Times New Roman", spacing: "1.5", structure: "" });
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic first", variant: "destructive" });
      return;
    }
    setGenerated(true);
    toast({ title: "Document generated! 📄" });
  };

  const handleAddProf = () => {
    if (!newProf.name.trim()) return;
    setProfessors([...professors, { ...newProf, id: Date.now() }]);
    setNewProf({ name: "", citation: "APA", font: "Times New Roman", spacing: "1.5", structure: "" });
    setModalOpen(false);
    toast({ title: "Professor added ✅" });
  };

  const prof = professors.find(p => p.name === selectedProf);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Document Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Create perfectly formatted assignments and reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <Textarea
              placeholder="Enter your assignment or case study topic..."
              className="min-h-[140px] resize-none"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Professor</label>
                <Select value={selectedProf} onValueChange={setSelectedProf}>
                  <SelectTrigger><SelectValue placeholder="Select professor" /></SelectTrigger>
                  <SelectContent>
                    {professors.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Add New Professor</DialogTitle></DialogHeader>
                  <div className="space-y-3 mt-2">
                    <Input placeholder="Professor name" value={newProf.name} onChange={e => setNewProf({ ...newProf, name: e.target.value })} />
                    <Select value={newProf.citation} onValueChange={v => setNewProf({ ...newProf, citation: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APA">APA</SelectItem>
                        <SelectItem value="Harvard">Harvard</SelectItem>
                        <SelectItem value="MLA">MLA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Preferred font" value={newProf.font} onChange={e => setNewProf({ ...newProf, font: e.target.value })} />
                    <Input placeholder="Line spacing (e.g., 1.5)" value={newProf.spacing} onChange={e => setNewProf({ ...newProf, spacing: e.target.value })} />
                    <Input placeholder="Structure preference" value={newProf.structure} onChange={e => setNewProf({ ...newProf, structure: e.target.value })} />
                    <Button className="w-full" onClick={handleAddProf}>Add Professor</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Format</label>
              <div className="flex gap-2">
                {(["PDF", "DOCX"] as const).map(f => (
                  <button
                    key={f}
                    className={`pill-button flex-1 ${format === f ? "active" : ""}`}
                    onClick={() => setFormat(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full h-11 font-semibold" onClick={handleGenerate}>
              <FileText className="w-4 h-4 mr-2" /> Generate Document
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 min-h-[500px] flex flex-col">
            {!generated ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Your document preview will appear here</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4" style={{ fontFamily: prof?.font || "Times New Roman" }}>
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-foreground">{topic}</h2>
                    <p className="text-xs text-muted-foreground mt-1">Prepared for {selectedProf || "General Submission"} • {prof?.citation || "APA"} Format</p>
                  </div>

                  <div className="space-y-4 text-sm text-foreground leading-relaxed">
                    <div>
                      <h3 className="font-bold text-foreground mb-1">1. Introduction</h3>
                      <p className="text-muted-foreground">This document presents a comprehensive analysis of {topic.toLowerCase() || "the given topic"}. The study explores the fundamental concepts, methodologies, and practical applications relevant to the subject matter within the context of modern computer science education.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">2. Literature Review</h3>
                      <p className="text-muted-foreground">According to recent research (Smith et al., 2025), the field has seen significant advancements in the past decade. Key contributions include novel algorithms for optimization and improved theoretical frameworks for analysis.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">3. Methodology</h3>
                      <p className="text-muted-foreground">The study employs a mixed-methods approach combining quantitative analysis with qualitative case studies. Data was collected from multiple sources and analyzed using standard statistical techniques.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">4. Conclusion</h3>
                      <p className="text-muted-foreground">The findings demonstrate significant potential for further research and development. Future work should focus on scalability and real-world implementation challenges.</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-11 mt-6 font-semibold bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: `${format} downloaded! 📥` })}>
                  <Download className="w-4 h-4 mr-2" /> Download as {format}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentGenerator;
