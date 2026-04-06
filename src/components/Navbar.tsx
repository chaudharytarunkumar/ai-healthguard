import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Risk Assessment", path: "/assess" },
  { label: "Model Comparison", path: "/models" },
  { label: "Documentation", path: "/documentation" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-header sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
          <div className="relative">
            <div className="absolute -inset-2 animate-pulse-ring rounded-full bg-primary/20" />
            <img src={logo} alt="AiHealth Guard" className="relative h-10 w-10 object-contain" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            AiHealth <span className="text-gradient-primary">Guard</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button 
          className="rounded-full p-2 transition-colors hover:bg-muted md:hidden" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t bg-card/95 backdrop-blur-xl px-4 py-4 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-5 py-3 text-sm font-bold transition-all ${location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
