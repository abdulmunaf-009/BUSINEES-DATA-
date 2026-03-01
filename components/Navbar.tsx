import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Sparkles className="text-gold-accent w-6 h-6" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-base leading-none tracking-widest text-white">AL-MOIZ</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-gold-accent font-semibold">Dental Clinic</span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-10">
          <Link className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 hover:text-gold-accent transition-colors" href="/about">The Clinic</Link>
          <Link className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 hover:text-gold-accent transition-colors" href="/services">Curated Services</Link>
          <Link className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 hover:text-gold-accent transition-colors" href="/contact">Contact</Link>
        </nav>
        <Link href="/contact" className="gold-button !px-6 !py-3 inline-block text-center">Book Now</Link>
      </div>
    </header>
  );
}
