import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your CampusIQ assistant. Ask me about deadlines, concepts, or your schedule!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setListening(true);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
    }, 500);
    
    setInput("");
  };

  const getBotResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("deadline")) return "You have 3 upcoming deadlines. Data Structures is due tomorrow!";
    if (q.includes("class") || q.includes("schedule")) return "Today you have Data Structures at 9 AM, followed by Maths at 10 AM.";
    if (q.includes("recursion")) return "Recursion is when a function calls itself. Base case stops it, recursive case breaks down the problem.";
    return "I can help with deadlines, schedules, and concept explanations. What would you like to know?";
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Drawer */}
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 w-[90vw] lg:w-96 h-[70vh] lg:h-[600px] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-display font-bold">CampusIQ Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-primary-foreground/10 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === "user" 
                      ? "bg-secondary text-foreground" 
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button size="icon" variant="outline" onClick={handleVoiceInput} className={listening ? "bg-destructive text-destructive-foreground" : ""}>
              <Mic className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
