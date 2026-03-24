'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Terminal, PieChart, Library, BarChart3, Bell, Settings, Search, Wallet } from 'lucide-react';
import NextImage from 'next/image';
import { useAuth } from '../../src/context/AuthContext';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <nav className="flex justify-between items-center px-6 h-16 w-full max-w-[1920px] mx-auto relative">
        <div className="flex-1 items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tighter text-white">Obsidian Flux</span>
            
          </Link>
        </div>
          
        <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 w-max">
          <Link href="/chat" className={`transition-colors flex items-center gap-2 text-sm ${pathname === '/chat' ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]' : 'text-tertiary hover:text-white'}`}>
            <Terminal className="w-4 h-4" /> The Terminal
          </Link>
          <Link href="/simulation" className={`transition-colors flex items-center gap-2 text-sm ${pathname === '/simulation' ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]' : 'text-tertiary hover:text-white'}`}>
            <BarChart3 className="w-4 h-4" /> Future Simulation
          </Link>
          <Link href="/hub" className={`transition-colors flex items-center gap-2 text-sm ${pathname === '/hub' ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]' : 'text-tertiary hover:text-white'}`}>
            <Library className="w-4 h-4" /> Active Hub
          </Link>
        </div>
        
        <div className="flex flex-1 justify-end items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 
                border border-[#00ff41]/20 rounded px-3 py-1.5
                hover:border-[#00ff41]/50 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] 
                  animate-pulse"/>
                <span className="text-xs font-mono text-[#00ff41]/70">
                  OX-{user.username.toUpperCase().slice(0,8)}
                </span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-8 bg-[#0a0a0a] 
                border border-[#00ff41]/20 rounded p-2 w-40
                opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none group-hover:pointer-events-auto z-50">
                <div className="text-xs text-gray-500 font-mono px-2 py-1">
                  {user.email}
                </div>
                <hr className="border-[#00ff41]/10 my-1"/>
                <button 
                  onClick={logout}
                  className="text-xs text-red-400 font-mono px-2 py-1 
                    w-full text-left hover:text-red-300 transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          ) : (
            <a href="/login" 
              className="text-xs font-mono text-[#00ff41]/60 
                hover:text-[#00ff41] border border-[#00ff41]/20 
                px-3 py-1.5 rounded transition-colors">
              LOGIN →
            </a>
          )}
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <button className="p-2 text-tertiary hover:text-white rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </button>
          <button className="p-2 text-tertiary hover:text-white rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
};
