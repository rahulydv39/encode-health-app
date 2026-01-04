"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Scan, AlertTriangle, CheckCircle, Info, Loader2, ArrowRight, History, Trash2, Zap, X, Image as ImageIcon, HelpCircle, Upload, Barcode, ChevronRight, ChevronLeft, BrainCircuit, ShieldCheck, FileText, Sparkles, Scale } from "lucide-react";


const DEMO_SEQUENCE = [
  {
    id: "demo_1",
    product_name: "Mega Fizz Soda",
    image: "https://images.openfoodfacts.org/images/products/544/900/021/4911/front_en.119.400.jpg",
    summary: "High Sugar Warning",
    reasoning: "Contains 40g of added sugar (High Fructose Corn Syrup). Consuming this daily increases risk of insulin resistance. No nutritional value detected.",
    risk_level: "High",
    ui_component: "alert_card",
    highlight_ingredients: ["High Fructose Corn Syrup", "Red 40"]
  },
  {
    id: "demo_2",
    product_name: "Organic Rolled Oats",
    image: "https://images.openfoodfacts.org/images/products/001/111/080/6389/front_en.3.400.jpg",
    summary: "Excellent Whole Grain",
    reasoning: "Single-ingredient product rich in beta-glucan fiber. Helps lower cholesterol and provides sustained energy.",
    risk_level: "Low",
    ui_component: "success_card",
    highlight_ingredients: ["100% Whole Grain Oats"]
  },
  {
    id: "demo_3",
    product_name: "Pro-Fit Protein Bar",
    image: "https://images.openfoodfacts.org/images/products/001/234/567/8901/front_en.4.400.jpg",
    summary: "Processed but High Protein",
    reasoning: "Good protein source (20g), but contains sugar alcohols (Maltitol) which may cause bloating.",
    risk_level: "Medium",
    ui_component: "info_card",
    highlight_ingredients: ["Whey Isolate", "Maltitol"]
  },
  {
    id: "demo_4",
    product_name: "Spicy Peanut Noodles",
    image: "https://images.openfoodfacts.org/images/products/073/762/806/4502/front_en.6.400.jpg",
    summary: "Allergen Alert: Peanuts",
    reasoning: "Contains peanuts and sesame oil. Sodium content (900mg) is 40% of your daily limit.",
    risk_level: "High",
    ui_component: "alert_card",
    highlight_ingredients: ["Peanuts", "Sesame Oil"]
  },
  {
    id: "demo_5",
    product_name: "Hydra Electrolyte Mix",
    image: "https://images.openfoodfacts.org/images/products/085/000/012/3456/front_en.5.400.jpg",
    summary: "Clean Hydration",
    reasoning: "Free from artificial dyes and sweeteners. Uses Stevia and Monk Fruit.",
    risk_level: "Low",
    ui_component: "success_card",
    highlight_ingredients: ["Stevia Leaf", "Potassium"]
  }
];


const ScanningDemoAnimation = () => {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-16 h-24 border-[3px] border-neutral-600 rounded-xl bg-neutral-900 overflow-hidden flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-neutral-800 opacity-50"></div>
        <motion.div
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,1)] z-20"
        />
        <Barcode size={24} className="text-neutral-500 opacity-50" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -right-2 bg-neutral-800 p-1.5 rounded-lg border border-neutral-700"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-5 bg-neutral-700 rounded flex items-center justify-center">
          <div className="w-3 h-0.5 bg-neutral-500 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};


const WelcomePopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#121212] border border-neutral-800 w-full max-w-4xl p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-12"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40" />

        {/* LEFT COLUMN: Hero Content */}
        <div className="flex-1 relative z-10 flex flex-col justify-center py-4">
          {/* Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
            <Sparkles className="w-8 h-8 text-white" fill="white" />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Decode Food Labels.<br />
            <span className="text-neutral-500">Instantly.</span>
          </h2>

          <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-md">
            Traditional labels are built for compliance, not humans. Encode AI is your <strong className="text-white">intelligent co-pilot</strong> that translates complex lists into clear, actionable insights.
          </p>

          <button
            onClick={onClose}
            className="w-full md:w-auto px-8 py-4 bg-[#FFD700] text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/20 active:scale-[0.98]"
          >
            Start Scanning <ArrowRight size={20} />
          </button>
        </div>


        <div className="flex-1 bg-[#1a1a1a] rounded-[2rem] p-8 flex flex-col justify-between border border-neutral-800 relative">

          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="mt-1 bg-blue-500/10 p-3 rounded-xl h-fit"><BrainCircuit size={24} className="text-blue-400" /></div>
              <div>
                <h4 className="text-white font-bold text-base mb-1.5">Reasoning Engine</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We don't just list data. The AI explains <em>why</em> ingredients matter to your health, reducing your cognitive load.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="mt-1 bg-green-500/10 p-3 rounded-xl h-fit"><ShieldCheck size={24} className="text-green-400" /></div>
              <div>
                <h4 className="text-white font-bold text-base mb-1.5">Intent-First Design</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  No forms. No filters. The system infers your safety needs automatically from the moment you scan.
                </p>
              </div>
            </div>


            <div className="flex gap-5">
              <div className="mt-1 bg-purple-500/10 p-3 rounded-xl h-fit"><Scale size={24} className="text-purple-400" /></div>
              <div>
                <h4 className="text-white font-bold text-base mb-1.5">Transparent Uncertainty</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We communicate honestly. If the health impact is debated or unclear, the AI tells you exactly why.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-3">Powered by</p>
            <div className="flex gap-4 opacity-60">
              <span className="text-xs font-bold text-white">Gemini 2.5 flash</span>
              <span className="text-xs text-neutral-600">•</span>
              <span className="text-xs font-bold text-white">n8n</span>
              <span className="text-xs text-neutral-600">•</span>
              <span className="text-xs font-bold text-white">OpenFoodFacts</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


const HelpPopup = ({ onClose }: { onClose: () => void }) => {
  const [slide, setSlide] = useState(0);


  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setSlide(1);
    } else if (info.offset.x > threshold) {
      setSlide(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-sm relative">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl h-[420px] relative">

          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-neutral-800/80 rounded-full hover:bg-neutral-700 text-neutral-400 backdrop-blur-sm">
            <X size={20} />
          </button>


          <motion.div
            className="flex w-[200%] h-full cursor-grab active:cursor-grabbing"
            animate={{ x: slide === 0 ? "0%" : "-50%" }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >

            <div className="w-1/2 h-full p-8 flex flex-col items-center justify-center shrink-0 border-r border-neutral-800/50">
              <div className="mb-6 scale-110"><ScanningDemoAnimation /></div>
              <h3 className="text-white font-bold text-xl mb-2">How it Works</h3>
              <div className="space-y-3 mt-2">
                <p className="text-neutral-400 text-sm flex items-center gap-2">
                  <span className="bg-yellow-400/20 text-yellow-400 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Point camera at barcode / Upload image
                </p>
                <p className="text-neutral-400 text-sm flex items-center gap-2">
                  <span className="bg-yellow-400/20 text-yellow-400 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  AI will give reasons about ingredients
                </p>
                <p className="text-neutral-400 text-sm flex items-center gap-2">
                  <span className="bg-yellow-400/20 text-yellow-400 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Get a clear "Risk Score"
                </p>
                <p className="text-neutral-400 text-sm flex items-center gap-2">
                  <span className="bg-yellow-400/20 text-red-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">Rules   </span>
                  Green Card - Safe to consume / Harmless.
                  <br />
                  Red Card - Not Safe to consume / Harmful.

                </p>
              </div>
              <p className="text-neutral-600 text-[10px] mt-10 font-mono flex items-center gap-1 uppercase tracking-widest">
                Swipe for About <ChevronRight size={10} />
              </p>
            </div>


            <div className="w-1/2 h-full p-8 flex flex-col items-center justify-center shrink-0 bg-neutral-800/20">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Info size={32} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Why "AI-Native"?</h3>

              <p className="text-neutral-300 text-center text-xs leading-relaxed mb-4">
                Standard apps are "Lookup Tools" (input &rarr; database row).
              </p>
              <p className="text-neutral-400 text-center text-xs leading-relaxed mb-8 px-2">
                Encode AI is an <strong>Agentic System</strong>. It understands context (e.g., "Is this safe?") without you filling out long profile forms. It acts as a nutritional firewall between you and the shelf.
              </p>

              <button onClick={onClose} className="px-8 py-3 bg-neutral-800 border border-neutral-700 text-white font-medium rounded-full hover:bg-neutral-700 transition-colors text-sm">
                Close Help
              </button>
            </div>
          </motion.div>


          <div className="absolute bottom-6 left-0 w-full flex items-center justify-center gap-2 z-20 pointer-events-none">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${slide === 0 ? 'bg-yellow-400 w-4' : 'bg-neutral-700'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${slide === 1 ? 'bg-yellow-400 w-4' : 'bg-neutral-700'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [status, setStatus] = useState<"idle" | "scanning" | "uploading" | "analyzing" | "result">("idle");
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // State for Popups
  const [showWelcome, setShowWelcome] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const [demoIndex, setDemoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('encode_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('encode_history', JSON.stringify(history));
  }, [history]);

  // Demo Logic
  const runDemoSimulation = (overrideImage?: string) => {
    setStatus("analyzing");
    setTimeout(() => {
      const currentScenario = DEMO_SEQUENCE[demoIndex % DEMO_SEQUENCE.length];
      const finalImage = overrideImage || currentScenario.image;
      const finalData = { ...currentScenario, image: finalImage };
      setData(finalData);

      const newHistoryItem = {
        ...finalData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      setDemoIndex(prev => prev + 1);
      setStatus("result");
    }, 1500);
  };

  const handleCameraScan = async () => {
    setStatus("scanning");
    setTimeout(() => { runDemoSimulation(); }, 1500);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStatus("uploading");
      const objectUrl = URL.createObjectURL(file);
      setTimeout(() => { runDemoSimulation(objectUrl); }, 1000);
    }
  };

  const reset = () => { setStatus("idle"); setData(null); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem('encode_history'); }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-6 relative overflow-x-hidden font-sans">


      <AnimatePresence>
        {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
        {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-yellow-500/10 via-amber-500/5 to-transparent pointer-events-none" />


      <header className="w-full max-w-md flex justify-between items-center z-10 mb-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Sparkles className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Encode AI</span>
        </div>
        <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-full bg-neutral-900/50 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors">
          <HelpCircle size={20} />
        </button>
      </header>


      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            className="flex flex-col items-center justify-center w-full max-w-md mt-4"
          >
            <div className="relative group cursor-pointer mb-8" onClick={handleCameraScan}>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <button className="relative flex items-center justify-center w-44 h-44 bg-neutral-900 rounded-full border-2 border-neutral-800 group-hover:border-yellow-500/50 transition-all duration-300 shadow-2xl shadow-yellow-900/5">
                <Scan className="w-16 h-16 text-neutral-500 group-hover:text-yellow-400 transition-colors duration-300" strokeWidth={1.5} />
                <span className="absolute inset-0 rounded-full animate-ping bg-yellow-400/20 opacity-0 group-hover:opacity-100 duration-1000" style={{ animationDuration: '1.5s' }} />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight">Scan Product</h1>
            <p className="text-neutral-400 mt-3 text-center max-w-xs text-lg">
              Point camera at a barcode to decode health impact instantly.
            </p>

            <div className="mt-8 flex gap-4 w-full max-w-xs justify-center">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button onClick={handleUploadClick} className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-300 text-sm font-medium hover:bg-neutral-800 hover:text-white transition-all">
                <Upload size={16} /> Upload Photo
              </button>
            </div>
          </motion.div>
        )}


        {status === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-neutral-900">
              <img src="https://images.openfoodfacts.org/images/products/073/762/806/4502/front_en.6.400.jpg" alt="Scanning..." className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 border-[30px] border-black/60 backdrop-blur-[1px]">
                <div className="w-full h-full border-2 border-white/20 relative">
                  <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.9)]" />
                </div>
              </div>
              <div className="absolute bottom-24 inset-x-0 flex justify-center">
                <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-yellow-400 font-mono text-sm animate-pulse">
                  Identifying Product...
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {status === "uploading" && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mb-6">
              <ImageIcon size={64} className="text-neutral-500" />
            </motion.div>
            <h2 className="text-xl font-medium text-white">Analyzing Image</h2>
          </motion.div>
        )}


        {status === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-yellow-500 animate-spin relative z-10" />
            </div>
            <h2 className="mt-10 text-2xl font-medium text-white">Reasoning...</h2>
          </motion.div>
        )}


        {status === "result" && data && (
          <motion.div key="result" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md pb-8">
            <div className={`p-7 rounded-[2.5rem] border relative overflow-hidden transition-colors duration-500 shadow-2xl ${data.ui_component === 'alert_card' ? 'bg-gradient-to-br from-red-950/90 to-neutral-950 border-red-500/30' :
              data.ui_component === 'info_card' ? 'bg-gradient-to-br from-blue-950/90 to-neutral-950 border-blue-500/30' :
                'bg-gradient-to-br from-green-950/90 to-neutral-950 border-green-500/30'}`}>

              <div className="flex justify-between items-start mb-6">
                <div className={`p-3.5 rounded-2xl backdrop-blur-md ${data.ui_component === 'alert_card' ? 'bg-red-500/10 text-red-500' :
                  data.ui_component === 'info_card' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                  {data.ui_component === 'alert_card' ? <AlertTriangle size={32} /> : data.ui_component === 'info_card' ? <Info size={32} /> : <CheckCircle size={32} />}
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${data.ui_component === 'alert_card' ? 'border-red-500/30 text-red-300 bg-red-950/50' :
                  data.ui_component === 'info_card' ? 'border-blue-500/30 text-blue-300 bg-blue-950/50' : 'border-green-500/30 text-green-300 bg-green-950/50'}`}>
                  {data.risk_level?.toUpperCase()}
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-white leading-tight">{data.summary}</h2>
              <p className="text-sm text-neutral-400 mb-4">{data.product_name}</p>
              <p className="text-neutral-300 leading-relaxed mb-8 text-lg">{data.reasoning}</p>

              {data.highlight_ingredients && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {data.highlight_ingredients.map((ing: string, i: number) => (
                    <span key={i} className="text-sm font-medium px-3.5 py-2 rounded-xl bg-neutral-800/80 text-neutral-200 border border-neutral-700/50">{ing}</span>
                  ))}
                </div>
              )}

              <button onClick={reset} className="w-full py-4 bg-yellow-400 text-black font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-900/20 active:scale-[0.98]">
                Scan Next Item <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {status === "idle" && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-md mt-12 mb-10">
          <div className="flex items-center justify-between mb-5 px-2">
            <h3 className="text-neutral-400 font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
              <History size={14} /> Recent Activity
            </h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-neutral-600 hover:text-red-400 transition-colors flex items-center gap-1 px-2 py-1 rounded-md">
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {history.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 text-center p-8 border-2 border-dashed border-neutral-800 rounded-2xl">
                  <p className="text-neutral-500 font-medium">No recent scans</p>
                </motion.div>
              ) : (
                history.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden aspect-square group cursor-pointer shadow-lg">


                    <img src={item.image} alt={item.product_name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />


                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />


                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="self-end">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg ${item.ui_component === 'alert_card' ? 'bg-red-500/20 text-red-400' :
                          item.ui_component === 'info_card' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'}`}>
                          {item.ui_component === 'alert_card' ? <AlertTriangle size={16} /> : item.ui_component === 'info_card' ? <Info size={16} /> : <CheckCircle size={16} />}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1 drop-shadow-md">{item.summary}</h4>
                        <p className="text-[10px] text-neutral-300 truncate opacity-80">{item.product_name}</p>
                      </div>
                    </div>
                  </motion.div>
                )))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </main>
  );
}