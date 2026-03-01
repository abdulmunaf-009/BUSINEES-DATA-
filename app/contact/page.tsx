'use client';

import { motion } from 'motion/react';
import { Calendar, Clock, User, Mail, Phone, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="w-full">
      {/* Scene 1: Hero */}
      <section className="scene bg-scene-1 pt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">Private Consultation</span>
            <h1 className="mag-title text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-none">
              Reserve Your <br/> <span className="text-gold-accent italic">Experience</span>
            </h1>
            <p className="text-lg text-slate-300 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
              Step into a world of clinical excellence and bespoke luxury. Schedule your comprehensive assessment with our specialists in Downtown Dubai.
            </p>

            {/* Abstract Visual */}
            <div className="mt-8 relative w-full max-w-sm mx-auto aspect-square border border-white/5 bg-charcoal-grey flex items-center justify-center overflow-hidden group rounded-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/10 to-transparent opacity-50" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border border-gold-accent/20 rounded-full border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border border-gold-accent/10 rounded-full"
              />
              <Sparkles className="w-12 h-12 text-gold-accent/50 relative z-10" strokeWidth={1} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scene 2: Booking Form */}
      <section className="scene bg-scene-2">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-charcoal-grey/80 backdrop-blur-md border border-white/5 p-10 md:p-16 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 rounded-full border border-gold-accent/30 flex items-center justify-center mb-6 bg-gold-accent/10">
                  <Sparkles className="w-8 h-8 text-gold-accent" />
                </div>
                <h3 className="font-display text-3xl text-white mb-4">Request Received</h3>
                <p className="text-slate-400 font-light">Our concierge team will contact you shortly to confirm your appointment details.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="text-center mb-12">
                  <h2 className="mag-title text-3xl md:text-4xl text-white">Appointment Request</h2>
                  <p className="text-slate-400 font-light mt-4">Please provide your details and preferred timing.</p>
                </div>

                <div className="space-y-6">
                  <h3 className="font-display text-xl text-gold-accent border-b border-white/10 pb-4">Patient Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input required type="text" className="w-full bg-charcoal-black border border-white/10 text-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input required type="tel" className="w-full bg-charcoal-black border border-white/10 text-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors" placeholder="+971 50 000 0000" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input required type="email" className="w-full bg-charcoal-black border border-white/10 text-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors" placeholder="john@example.com" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <h3 className="font-display text-xl text-gold-accent border-b border-white/10 pb-4">Clinical Request</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Treatment Category</label>
                    <div className="relative">
                      <select required defaultValue="" className="w-full bg-charcoal-black border border-white/10 text-white pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors appearance-none cursor-pointer">
                        <option value="" disabled>Select a category...</option>
                        <option value="implantology">Implantology & Oral Surgery</option>
                        <option value="prosthodontics">Prosthodontics & Restorative</option>
                        <option value="endodontics">Endodontics & Preventive Care</option>
                        <option value="aesthetic">Aesthetic & Orthodontic Dentistry</option>
                        <option value="consultation">General Consultation / Assessment</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input required type="date" className="w-full bg-charcoal-black border border-white/10 text-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] cursor-pointer" />
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Available Sat-Thu</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Preferred Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select required defaultValue="" className="w-full bg-charcoal-black border border-white/10 text-white pl-12 pr-12 py-4 text-sm focus:outline-none focus:border-gold-accent/50 transition-colors appearance-none cursor-pointer">
                          <option value="" disabled>Select time...</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="09:30">09:30 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="10:30">10:30 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="11:30">11:30 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="12:30">12:30 PM</option>
                          <option value="13:00">01:00 PM</option>
                          <option value="13:30">01:30 PM</option>
                          <option value="14:00">02:00 PM</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="gold-button w-full mt-8">Submit Request</button>
                <p className="text-center text-[10px] text-slate-500 mt-4">Your information is securely encrypted and strictly confidential.</p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Scene 3: Location & Hours */}
      <section className="scene bg-scene-6">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Visit Us</span>
              <h2 className="mag-title text-4xl md:text-5xl text-white mb-8">The Clinic</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold-accent/30 flex items-center justify-center bg-gold-accent/5 shrink-0">
                    <MapPin className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">Location</h4>
                    <p className="text-white font-light text-lg">Downtown Dubai</p>
                    <p className="text-slate-400 font-light mt-1">United Arab Emirates</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold-accent/30 flex items-center justify-center bg-gold-accent/5 shrink-0">
                    <Clock className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">Clinic Hours</h4>
                    <p className="text-white font-light text-lg">Saturday – Thursday</p>
                    <p className="text-gold-accent font-display text-xl mt-1">09:00 AM — 02:00 PM</p>
                    <p className="text-slate-500 text-xs mt-2 italic">Closed on Fridays</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold-accent/30 flex items-center justify-center bg-gold-accent/5 shrink-0">
                    <Phone className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">Direct Line</h4>
                    <p className="text-white font-light text-lg">+971 4 000 0000</p>
                    <p className="text-slate-400 font-light mt-1">For urgent inquiries</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square bg-charcoal-black border border-white/5 relative overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/10 to-transparent opacity-50" />
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#C5A05915_1px,transparent_1px),linear-gradient(to_bottom,#C5A05915_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              <div className="text-center relative z-10">
                <MapPin className="w-12 h-12 text-gold-accent mx-auto mb-4" />
                <p className="text-gold-accent font-display text-xl tracking-widest uppercase">Dubai</p>
                <p className="text-slate-500 text-xs tracking-[0.2em] uppercase mt-2">Premium Location</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scene 4: FAQ */}
      <section className="scene bg-scene-3">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Information</span>
            <h2 className="mag-title text-4xl md:text-5xl text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-charcoal-black/50 border border-white/5 p-8 hover:border-gold-accent/30 transition-colors duration-300"
            >
              <h3 className="font-display text-xl text-gold-accent mb-3">Do you offer virtual consultations?</h3>
              <p className="text-slate-400 font-light leading-relaxed">Yes, for international patients or preliminary aesthetic assessments, we offer secure video consultations prior to your visit to Dubai.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-charcoal-black/50 border border-white/5 p-8 hover:border-gold-accent/30 transition-colors duration-300"
            >
              <h3 className="font-display text-xl text-gold-accent mb-3">What should I bring to my first appointment?</h3>
              <p className="text-slate-400 font-light leading-relaxed">Please bring any previous dental records, X-rays taken within the last 6 months, and your Emirates ID or Passport. Our concierge will guide you through the registration process.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-charcoal-black/50 border border-white/5 p-8 hover:border-gold-accent/30 transition-colors duration-300"
            >
              <h3 className="font-display text-xl text-gold-accent mb-3">Is parking available at the clinic?</h3>
              <p className="text-slate-400 font-light leading-relaxed">Yes, we provide complimentary valet parking for all our patients at our Downtown Dubai location.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
