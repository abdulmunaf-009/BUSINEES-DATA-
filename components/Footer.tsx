import { Share2, Printer, Globe } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal-black py-24 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          <div>
            <h2 className="mag-title text-4xl text-white mb-8">Invest in Your Most <br/><span className="text-gold-accent">Significant Accessory.</span></h2>
            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md mb-10">We are redefining the dental experience through luxury, technology, and empathy. Each treatment is a bespoke creation tailored to your anatomy and aspirations.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="gold-button inline-block text-center">Book Appointment</Link>
              <Link href="/contact" className="px-10 py-4 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all text-center">Contact Us</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold text-gold-accent mb-8">Quick Links</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                <li><Link className="hover:text-white transition-colors" href="/about">Our History</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/services">Specialists</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/services">Technology</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/contact">Pricing Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold text-gold-accent mb-8">Legal</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                <li><Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Terms of Service</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold text-gold-accent mb-8">Social</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                <li><Link className="hover:text-white transition-colors" href="#">Instagram</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">LinkedIn</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Facebook</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-600">© 2024 Al-Moiz Dental Clinic. Dubai, UAE.</p>
          <div className="flex gap-8">
            <Share2 className="text-slate-600 w-5 h-5 hover:text-gold-accent cursor-pointer transition-colors" />
            <Printer className="text-slate-600 w-5 h-5 hover:text-gold-accent cursor-pointer transition-colors" />
            <Globe className="text-slate-600 w-5 h-5 hover:text-gold-accent cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
