
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Zap, Search, Globe, ChevronRight } from 'lucide-react';
import { ViewState, MarketStats } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [stats, setStats] = useState<MarketStats>({
    solPrice: 142.64,
    gasPrice: 15,
    totalScanned: 12409,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        solPrice: prev.solPrice + (Math.random() - 0.5) * 0.1,
        gasPrice: Math.max(8, Math.min(45, prev.gasPrice + Math.floor(Math.random() * 5 - 2))),
        totalScanned: prev.totalScanned + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Top Header Stats */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('terminal')}
          >
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tighter text-xl uppercase">Black Pocket</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest text-[#A1A1AA]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] opacity-50 uppercase">SOL/USD</span>
              <span className="text-white mono">${stats.solPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] opacity-50 uppercase">Gas Price</span>
              <span className="text-white mono">{stats.gasPrice} Lamports</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] opacity-50 uppercase">Analyzed</span>
              <span className="text-[#3B82F6] mono font-bold">{stats.totalScanned.toLocaleString()}</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('whitelist')}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-sm text-xs font-bold uppercase tracking-widest"
            >
              Access
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Nav */}
          <aside className="hidden lg:flex flex-col gap-2 w-48 shrink-0">
            <NavItem 
              active={currentView === 'terminal'} 
              icon={<Activity className="w-4 h-4" />} 
              label="Terminal" 
              onClick={() => onNavigate('terminal')} 
            />
            <NavItem 
              active={currentView === 'scan'} 
              icon={<Search className="w-4 h-4" />} 
              label="Deep Scan" 
              onClick={() => onNavigate('scan')} 
            />
            <NavItem 
              active={currentView === 'governance'} 
              icon={<Globe className="w-4 h-4" />} 
              label="Governance" 
              onClick={() => onNavigate('governance')} 
            />
            <div className="my-4 border-t border-[#262626]"></div>
            <NavItem 
              active={currentView === 'whitelist'} 
              icon={<Zap className="w-4 h-4" />} 
              label="Whitelist" 
              onClick={() => onNavigate('whitelist')} 
            />
          </aside>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] bg-[#050505] py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] text-[#A1A1AA] uppercase tracking-[0.2em]">
          <span>© 2024 Black Pocket Institutional</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-sm transition-all text-sm group ${
      active ? 'bg-[#121212] text-white' : 'text-[#A1A1AA] hover:text-white hover:bg-[#121212]/50'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium tracking-tight">{label}</span>
    </div>
    <ChevronRight className={`w-3 h-3 transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
  </button>
);
