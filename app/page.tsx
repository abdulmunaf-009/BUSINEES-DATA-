'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Award, 
  Activity, 
  ShieldPlus, 
  Microscope, 
  LayoutGrid, 
  Baby, 
  CheckCircle2, 
  Star, 
  Share2, 
  Printer, 
  Globe 
} from 'lucide-react';

export default function Home() {
  const [selectedConcern, setSelectedConcern] = useState('');

  return (
    <main className="w-full">
      {/* Scene Indicator */}
      <div className="scene-indicator hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-[60] flex-col gap-4">
        <div className="w-1 h-16 bg-gold-accent transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.4)]"></div>
        <div className="w-1 h-8 bg-gold-accent/20 transition-all duration-500 hover:bg-gold-accent/50"></div>
        <div className="w-1 h-8 bg-gold-accent/20 transition-all duration-500 hover:bg-gold-accent/50"></div>
        <div className="w-1 h-8 bg-gold-accent/20 transition-all duration-500 hover:bg-gold-accent/50"></div>
        <div className="w-1 h-8 bg-gold-accent/20 transition-all duration-500 hover:bg-gold-accent/50"></div>
        <div className="w-1 h-8 bg-gold-accent/20 transition-all duration-500 hover:bg-gold-accent/50"></div>
      </div>

      {/* Scene 1: Hero */}
      <section className="scene bg-scene-1">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0 L30 60 M0 30 L60 30\\' stroke=\\'%23C5A059\\' stroke-width=\\'0.2\\' fill=\\'none\\'/%3E%3C/svg%3E')" }}></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto px-6 w-full text-center"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold py-1.5 px-4 border border-gold-accent/30 text-gold-accent bg-gold-accent/5">5.0 (6 Reviews)</span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold py-1.5 px-4 border border-gold-accent/30 text-gold-accent bg-gold-accent/5">Modern & Clean Clinic</span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold py-1.5 px-4 border border-gold-accent/30 text-gold-accent bg-gold-accent/5">Dubai&apos;s Elite Care</span>
          </div>
          <h1 className="mag-title text-6xl md:text-8xl lg:text-[11rem] text-white mb-10 leading-none">
            Premium <br/> Dental Care <br/> <span className="text-gold-accent italic">Dubai</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-16">
            Modern, patient-focused dentistry conveniently located in Downtown Dubai. Experience dental luxury at its finest.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="gold-button inline-block text-center">Schedule Consultation</Link>
            <Link href="/services" className="border border-white/20 text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:border-gold-accent hover:text-gold-accent transition-all text-center inline-block">View Services</Link>
          </div>
        </motion.div>
      </section>

      {/* Scene 2: Portfolio */}
      <section className="scene bg-scene-2">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 w-full"
        >
          <div className="text-center mb-24">
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Portfolio</span>
            <h2 className="mag-title text-5xl md:text-7xl text-white">World-Class Specializations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">01</span>
              <Award className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Cosmetic Dentistry</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Transforming smiles with porcelain veneers, professional whitening, and gum contouring.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services#aesthetic">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">02</span>
              <Activity className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Root Canal</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Virtually painless endodontic procedures using the latest rotary technology.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services#endodontics">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">03</span>
              <ShieldPlus className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Crowns & Bridges</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Restore functionality and aesthetics with custom-crafted ceramic restorations.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services#prosthodontics">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">04</span>
              <Microscope className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Implants & Prosthetics</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Advanced implantology solutions including All-on-4 and immediate loading protocols.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services#implantology">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">05</span>
              <LayoutGrid className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Orthodontics</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Discreet alignment options including clear aligners and modern bracing systems.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services#aesthetic">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
            <div className="group bg-black/40 border border-white/5 p-12 hover:border-gold-accent/40 transition-all duration-500 hover:-translate-y-2">
              <span className="text-gold-accent text-xs font-bold tracking-[0.4em] block mb-10 uppercase">06</span>
              <Baby className="text-gold-accent w-12 h-12 mb-6 stroke-1" />
              <h3 className="font-display text-2xl text-white mb-4">Pediatric Care</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-10">Creating positive dental experiences for your little ones in a gentle environment.</p>
              <Link className="inline-flex items-center gap-3 text-gold-accent uppercase tracking-widest text-[9px] font-bold" href="/services">Explore <span className="h-px w-6 bg-gold-accent"></span></Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scene 3: Mission */}
      <section className="scene bg-scene-3">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 w-full space-y-32"
        >
          <div className="text-center mb-16">
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Mission</span>
            <h2 className="mag-title text-4xl md:text-6xl text-white">Our Clinical Philosophy</h2>
          </div>
          <div className="grid grid-cols-1 gap-24">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <span className="font-display text-gold-accent text-4xl opacity-50">I.</span>
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Digital Excellence</h3>
                <p className="text-slate-400 leading-relaxed text-lg">Intraoral scanning and 3D imaging for ultra-accurate treatment planning. We believe the future of dentistry is digital, combining technology with human touch.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <span className="font-display text-gold-accent text-4xl opacity-50">II.</span>
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Surgical Precision</h3>
                <p className="text-slate-400 leading-relaxed text-lg">Advanced laser and micro-dentistry tools for faster, cleaner healing. Our methods reduce trauma and prioritize biological preservation.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <span className="font-display text-gold-accent text-4xl opacity-50">III.</span>
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Elite Comfort</h3>
                <p className="text-slate-400 leading-relaxed text-lg">Spa-like environment designed to eliminate dental anxiety completely. From curated sensory experiences to personalized care paths.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <span className="font-display text-gold-accent text-4xl opacity-50">IV.</span>
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Transparency</h3>
                <p className="text-slate-400 leading-relaxed text-lg">No hidden costs. Comprehensive treatment maps provided upfront. Excellence requires trust, and trust requires absolute clarity.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scene 4: Feature */}
      <section className="scene bg-scene-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 border border-gold-accent/20 z-0"></div>
              <div className="relative z-10 w-full aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-1000">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsW8-_ft6foe13kpatb6p-ALXySAC-8CZz36EIod4_1gmI6sB6MLPm7NdNK8sunlfZQPEaODiFJdZ-aPS2wy5-6QntpDTVcMa835ipgVIItzWVjJEmPfSyjJxaliZGe9aEUJVoeaGz5ps3Jr_6c72upHxdO6n0wyrH0kqd4vLWw-Cs536hCC8G3lSpLTo7DKs1memZt8REtF3XlgQg8wXExa0x3Sezrk8ZcguhQBAeHhYkWDF5GB7Q4GW8cJcX_aRgnl_Ql1fNS1k" 
                  alt="Portrait of Dr. Moiz Raza" 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-charcoal-black border border-gold-accent/30 p-8 z-20">
                <div className="text-gold-accent font-display text-2xl mb-1">Dr. Moiz Raza</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Lead Aesthetic Surgeon</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">The Feature</span>
              <h2 className="mag-title text-6xl md:text-8xl text-white mb-8">The Expert <br/> Behind <br/> Your Smile</h2>
              <p className="text-slate-300 text-xl leading-relaxed italic mb-10">&quot;Meet our lead specialist, Dr. Moiz Raza. Dedicated to the fusion of clinical science and aesthetic art.&quot;</p>
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4 py-3 border-b border-white/5">
                  <CheckCircle2 className="text-gold-accent w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Harvard Trained Techniques</span>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-white/5">
                  <CheckCircle2 className="text-gold-accent w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">15+ Years Clinical Expertise</span>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-white/5">
                  <CheckCircle2 className="text-gold-accent w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Award-Winning Aesthetic Care</span>
                </div>
              </div>
              <Link href="/about" className="gold-button inline-block text-center">Read Biography</Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scene 5: Process */}
      <section className="scene bg-scene-5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 w-full"
        >
          <div className="text-center mb-24">
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Our Process</span>
            <h2 className="mag-title text-5xl md:text-7xl text-white">Your Personalized Journey</h2>
          </div>
          <div className="relative space-y-24 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gold-accent/20">
            <div className="pl-12 relative">
              <div className="absolute left-[-4px] top-1 w-2 h-2 bg-gold-accent rounded-full shadow-[0_0_10px_#C5A059]"></div>
              <h4 className="font-display text-gold-accent text-xl mb-4">01. Comprehensive Discovery</h4>
              <p className="text-slate-400 text-lg leading-relaxed">A 45-minute deep-dive consultation including 3D scanning and clinical assessment to understand your unique goals.</p>
            </div>
            <div className="pl-12 relative">
              <div className="absolute left-[-4px] top-1 w-2 h-2 bg-gold-accent/40 rounded-full"></div>
              <h4 className="font-display text-gold-accent text-xl mb-4">02. Aesthetic Planning</h4>
              <p className="text-slate-400 text-lg leading-relaxed">Our team designs your smile blueprint, presenting you with a digital preview of the final results.</p>
            </div>
            <div className="pl-12 relative">
              <div className="absolute left-[-4px] top-1 w-2 h-2 bg-gold-accent/40 rounded-full"></div>
              <h4 className="font-display text-gold-accent text-xl mb-4">03. Masterful Treatment</h4>
              <p className="text-slate-400 text-lg leading-relaxed">Execution of the clinical plan using minimally invasive techniques in our premium surgical suites.</p>
            </div>
            <div className="pl-12 relative">
              <div className="absolute left-[-4px] top-1 w-2 h-2 bg-gold-accent/40 rounded-full"></div>
              <h4 className="font-display text-gold-accent text-xl mb-4">04. Lifelong Aftercare</h4>
              <p className="text-slate-400 text-lg leading-relaxed">Continuous support and maintenance protocols to ensure your investment stays perfect for decades.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scene 6: Candidate & Testimonial */}
      <section className="scene bg-scene-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="bg-black/60 border border-gold-accent/20 p-12 md:p-16 min-h-[450px] flex flex-col justify-center">
              <h2 className="font-display text-4xl text-white mb-6">Am I a Candidate?</h2>
              
              {!selectedConcern ? (
                <>
                  <p className="text-slate-400 text-lg mb-10">Take our 30-second premium pre-screening to find out which treatment path is right for you.</p>
                  <div className="space-y-8">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gold-accent mb-6 block">What is your primary dental concern?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button 
                          onClick={() => setSelectedConcern('implantology')}
                          className="p-4 text-left border border-white/10 hover:border-gold-accent text-[9px] uppercase tracking-widest font-bold transition-all hover:bg-gold-accent/5"
                        >
                          Missing or Damaged Teeth
                        </button>
                        <button 
                          onClick={() => setSelectedConcern('prosthodontics')}
                          className="p-4 text-left border border-white/10 hover:border-gold-accent text-[9px] uppercase tracking-widest font-bold transition-all hover:bg-gold-accent/5"
                        >
                          Worn or Broken Teeth
                        </button>
                        <button 
                          onClick={() => setSelectedConcern('endodontics')}
                          className="p-4 text-left border border-white/10 hover:border-gold-accent text-[9px] uppercase tracking-widest font-bold transition-all hover:bg-gold-accent/5"
                        >
                          Tooth Pain or Infection
                        </button>
                        <button 
                          onClick={() => setSelectedConcern('aesthetic')}
                          className="p-4 text-left border border-white/10 hover:border-gold-accent text-[9px] uppercase tracking-widest font-bold transition-all hover:bg-gold-accent/5"
                        >
                          Smile Aesthetics & Alignment
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-full border border-gold-accent/30 flex items-center justify-center bg-gold-accent/10 mb-6">
                    <CheckCircle2 className="w-6 h-6 text-gold-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-gold-accent">Recommended Pathway</h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {selectedConcern === 'implantology' && "Based on your concern, our Implantology & Oral Surgery specialists can provide permanent, digitally-guided solutions to restore your smile's foundation."}
                    {selectedConcern === 'prosthodontics' && "Our Prosthodontics & Restorative team specializes in rebuilding worn or broken teeth using premium ceramic crowns and bridges for lasting stability."}
                    {selectedConcern === 'endodontics' && "Our Endodontics & Preventive Care experts utilize advanced micro-dentistry to address pain and infection while preserving your natural teeth."}
                    {selectedConcern === 'aesthetic' && "Our Aesthetic & Orthodontic specialists can design your perfect smile using minimally invasive veneers, whitening, or clear aligners."}
                  </p>
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Link href={`/services#${selectedConcern}`} className="border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:border-gold-accent hover:text-gold-accent transition-all text-center">
                      View Treatments
                    </Link>
                    <Link href="/contact" className="gold-button text-center">
                      Book Consultation
                    </Link>
                  </div>
                  <button 
                    onClick={() => setSelectedConcern('')}
                    className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors mt-4 block"
                  >
                    Start Over
                  </button>
                </motion.div>
              )}
            </div>
            <div>
              <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">Voices of Transformation</span>
              <div className="relative bg-charcoal-black/40 p-12 border border-white/5">
                <div className="flex gap-1 text-gold-accent mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-white text-2xl italic leading-relaxed mb-10">&quot;The most professional dental experience I&apos;ve had in Dubai. Dr. Moiz explains everything so clearly, and the facility is top-tier.&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden grayscale">
                    <Image 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDct_uH1lcxjgU2AQoVPTMg5oqSx-4jqF0c9IUKFDYUmZ5aJjz_ghdRn6z80OJYDDepJ7f1dClAClz8KBesn1ldrncFX1UEpIRW5_gNRbsfQmWHfVxsSstlGFjGM6vWDYKoOhEmYF9gmPbZ0tpFig-MSe_1Z6Qz0PZGglrwYZxPfDTH9Ca6_y0lyYHtT_AH_toWEu65DfCTgt6VBYKK_VTuqx-XO1IC05u2Mh3vbCogj1XlfKTGRkQHCDVOgpkr1kHZ4wNQuYvJVOM" 
                      alt="Client portrait" 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-display text-lg text-white">Ahmed Khan</div>
                    <div className="text-[9px] text-gold-accent uppercase tracking-[0.2em] font-bold">Business Executive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* End of Scenes */}
    </main>
  );
}
