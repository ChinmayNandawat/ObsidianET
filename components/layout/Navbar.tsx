'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Terminal, PieChart, Library, BarChart3, Bell, Settings, Search, Wallet } from 'lucide-react';
import Image from 'next/image';

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <nav className="flex justify-between items-center px-6 h-16 w-full max-w-[1920px] mx-auto relative">
        <div className="flex flex-1 items-center gap-10">
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
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <button className="p-2 text-tertiary hover:text-white rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </button>
          <button className="p-2 text-tertiary hover:text-white rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-2 ring-2 ring-primary/20 relative">
            <Image 
              alt="User" 
              src="https://picsum.photos/seed/user/100/100" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 100vw"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
