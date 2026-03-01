'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { 
  Award, 
  Microscope, 
  ShieldPlus, 
  Star,
  ArrowRight,
  Activity,
  Sparkles,
  HeartPulse,
  Hexagon,
  ScanFace
} from 'lucide-react';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section ref={containerRef} className="scene bg-scene-1 pt-32">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-accent/20 via-charcoal-black to-charcoal-black z-10" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#C5A05915_1px,transparent_1px),linear-gradient(to_bottom,#C5A05915_1px,transparent_1px)] bg-[size:4rem_4rem] z-10" />
          
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold-accent/5 rounded-full border-dashed z-0"
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold-accent/10 rounded-full z-0"
          />
        </motion.div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">Our Legacy</span>
            <h1 className="mag-title text-5xl md:text-7xl lg:text-9xl text-white mb-8 leading-none">
              Redefining <br/> <span className="text-gold-accent italic">Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
              Where world-class clinical precision meets unparalleled luxury. We don&apos;t just treat teeth; we curate masterpieces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Vision / Story */}
      <section className="scene bg-scene-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">The Vision</span>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-8 leading-tight">
                A New Standard in <br/> <span className="text-gold-accent italic">Aesthetic Dentistry</span>
              </h2>
              <div className="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                <p>
                  Founded on the principle that healthcare should be an experience, not a chore, Al-Moiz Dental Clinic was established to bridge the gap between medical necessity and luxury hospitality.
                </p>
                <p>
                  Every detail of our clinic—from the ambient lighting to the curated scent, and most importantly, our state-of-the-art surgical suites—has been meticulously designed to eliminate anxiety and foster trust.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                <div>
                  <div className="text-gold-accent font-display text-4xl mb-2">15+</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Years of Mastery</div>
                </div>
                <div>
                  <div className="text-gold-accent font-display text-4xl mb-2">10k+</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Smiles Transformed</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] w-full"
            >
              <div className="absolute -inset-4 border border-gold-accent/20 z-0 translate-x-4 translate-y-4"></div>
              <div className="relative z-10 w-full h-full bg-charcoal-grey flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Abstract Dental/Precision Visual */}
                <div className="relative z-10 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-64 h-64 border border-gold-accent/30 rounded-full border-dashed"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border border-gold-accent/20 rounded-full"
                  />
                  <Hexagon className="w-24 h-24 text-gold-accent/50 absolute" strokeWidth={1} />
                  <ScanFace className="w-12 h-12 text-gold-accent relative z-10" strokeWidth={1.5} />
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-gold-accent/50" />
                <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-gold-accent/50" />
                <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-gold-accent/50" />
                <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-gold-accent/50" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="scene bg-scene-3 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Core Values</span>
            <h2 className="mag-title text-4xl md:text-6xl text-white">The Pillars of Our Practice</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8 text-gold-accent mb-6" />,
                title: "Uncompromising Quality",
                desc: "We utilize only the highest-grade materials sourced globally, ensuring longevity and biocompatibility in every restoration."
              },
              {
                icon: <Microscope className="w-8 h-8 text-gold-accent mb-6" />,
                title: "Micro-Precision",
                desc: "Operating under high-powered magnification allows us to preserve more healthy tooth structure and achieve flawless margins."
              },
              {
                icon: <ShieldPlus className="w-8 h-8 text-gold-accent mb-6" />,
                title: "Absolute Safety",
                desc: "Our sterilization protocols exceed international standards. Your health and safety are the non-negotiable foundation of our clinic."
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-charcoal-black border border-white/5 p-12 hover:border-gold-accent/40 transition-colors duration-500 group"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                  {pillar.icon}
                  <h3 className="font-display text-2xl text-white mb-4">{pillar.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="scene bg-scene-4">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8 w-full">
          <div>
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Facility</span>
            <h2 className="mag-title text-4xl md:text-6xl text-white">Designed for Serenity</h2>
          </div>
          <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gold-accent hover:text-white transition-colors">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-6 px-6 overflow-x-auto pb-12 snap-x hide-scrollbar">
          {[
            { name: "Diagnostic Suite", icon: Microscope, desc: "3D Imaging & Analysis", pattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-accent/10 to-transparent" },
            { name: "Surgical Suite", icon: Activity, desc: "Advanced Implantology", pattern: "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-deep/20 to-transparent" },
            { name: "Aesthetic Suite", icon: Sparkles, desc: "Smile Design Studio", pattern: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sapphire-royal/20 to-transparent" },
            { name: "Recovery Lounge", icon: HeartPulse, desc: "Post-op Serenity", pattern: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-accent/10 to-transparent" }
          ].map((suite, i) => {
            const Icon = suite.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="min-w-[300px] md:min-w-[400px] aspect-[3/4] relative snap-center group overflow-hidden bg-charcoal-grey border border-white/5 flex flex-col items-center justify-center"
              >
                <div className={`absolute inset-0 ${suite.pattern} opacity-30 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="relative z-10 flex flex-col items-center text-center p-8 transform group-hover:-translate-y-4 transition-transform duration-500">
                  <div className="w-24 h-24 rounded-full border border-gold-accent/20 flex items-center justify-center mb-8 bg-charcoal-black/50 backdrop-blur-sm group-hover:border-gold-accent/50 transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                    <Icon className="w-10 h-10 text-gold-accent" strokeWidth={1} />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3">{suite.name}</h3>
                  <p className="text-slate-400 text-xs tracking-[0.2em] uppercase font-bold">{suite.desc}</p>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-gold-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="scene bg-scene-5">
        <div className="absolute inset-0 bg-gold-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Star className="w-12 h-12 text-gold-accent mx-auto mb-8" />
            <h2 className="mag-title text-5xl md:text-7xl text-white mb-8">Ready to Experience <br/> the Difference?</h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto font-light">
              Join our exclusive patient family and discover what it means to truly look forward to your dental visits.
            </p>
            <button className="gold-button !px-12 !py-5 text-xs">Begin Your Journey</button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
