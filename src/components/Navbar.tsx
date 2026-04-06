import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Risk Assessment", path: "/assess" },
  { label: "Model Comparison", path: "/models" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AiHealth Guard" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-foreground">
            AiHealth <span className="text-gradient-primary">Guard</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
