import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { HeartCrack, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-teal-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-[3rem] p-12 md:p-16 text-center max-w-2xl w-full shadow-elevated relative z-10"
      >
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 shadow-2xl relative">
            <div className="absolute -inset-4 animate-pulse-ring rounded-full bg-primary/20" />
            <HeartCrack className="h-12 w-12 text-destructive relative z-10" />
        </div>
        
        <h1 className="mb-4 text-7xl md:text-8xl font-black tracking-tighter text-slate-800">404</h1>
        
        <div className="inline-block mb-6 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-black uppercase tracking-widest text-primary">
          System Endpoint Not Found
        </div>
        
        <p className="mb-10 text-lg font-medium text-muted-foreground leading-relaxed max-w-md mx-auto">
          The clinical diagnostic route you are attempting to access does not exist in our current architecture.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-primary text-white font-black shadow-xl hover:scale-105 transition-all">
            <Link to="/" className="gap-2">
              <Home className="h-5 w-5" /> Main Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-2 font-black shadow-sm hover:bg-muted transition-all">
            <button onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="h-5 w-5" /> Return Previous
            </button>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
