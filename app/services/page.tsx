'use client';

import { motion } from 'motion/react';
import { 
  ScanFace, 
  Microscope, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  Smile, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  HeartPulse,
  ChevronRight
} from 'lucide-react';

const pillars = [
  {
    icon: ScanFace,
    title: "Digital Diagnostics",
    desc: "Advanced 3D CBCT imaging and intraoral scanning for precise treatment planning and predictable outcomes."
  },
  {
    icon: Microscope,
    title: "Guided Surgery",
    desc: "Computer-guided implant placement ensuring optimal positioning, minimal invasiveness, and faster recovery."
  },
  {
    icon: BookOpen,
    title: "Evidence-Based",
    desc: "Strict adherence to internationally recognized clinical protocols and peer-reviewed dental methodologies."
  }
];

type Service = {
  title: string;
  overview?: string;
  whoItsFor?: string[];
  details?: string[];
  info?: string;
  healing?: string;
};

type Category = {
  id: string;
  title: string;
  icon: any;
  description: string;
  services: Service[];
};

const serviceCategories: Category[] = [
  {
    id: "implantology",
    title: "Implantology",
    icon: Activity,
    description: "Permanent solutions for missing teeth using digitally guided surgical protocols and titanium implant systems.",
    services: [
      {
        title: "Single Tooth Implant",
        overview: "A titanium implant is surgically placed into the jawbone to replace the root of a missing tooth. After healing, a custom-made crown is attached to restore natural function and aesthetics.",
        whoItsFor: ["Patients missing one tooth", "Individuals wanting fixed replacement", "Those seeking long-term stability"],
        details: ["Digital scan and bone assessment", "Surgical implant placement", "Healing phase (osseointegration)", "Crown placement"],
        info: "Implants preserve bone structure and prevent shifting of adjacent teeth.",
        healing: "Mild swelling for 2–3 days. Normal activity usually resumes next day."
      },
      {
        title: "Full Arch Implants (All-on-X)",
        overview: "A full set of teeth is supported using 4–6 strategically placed implants, restoring full function and aesthetics.",
        whoItsFor: ["Patients missing most or all teeth", "Loose denture wearers", "Severe tooth breakdown cases"],
        details: ["Fixed solution", "Immediate function (in selected cases)", "Improved chewing ability"],
        info: "Ideal alternative to removable dentures."
      },
      {
        title: "Bone Grafting",
        overview: "Bone augmentation procedure to rebuild jaw structure before implant placement.",
        whoItsFor: ["Patients with bone loss", "Long-term missing teeth cases", "Trauma-related bone damage"],
        healing: "Healing Time: 3–6 months depending on graft type."
      }
    ]
  },
  {
    id: "prosthodontics",
    title: "Prosthodontics & Restorative",
    icon: Activity,
    description: "Rehabilitation of damaged, worn, or missing teeth to restore bite stability, comfort, and aesthetics.",
    services: [
      {
        title: "Crowns",
        overview: "A custom-made cap placed over a damaged tooth to restore strength and appearance.",
        whoItsFor: ["Broken teeth", "Large fillings", "Root canal treated teeth"],
        details: ["Zirconia", "Porcelain-fused-to-metal", "E-max (aesthetic cases)"]
      },
      {
        title: "Bridges",
        overview: "A fixed restoration anchored to adjacent teeth to replace missing teeth.",
        whoItsFor: ["1–2 missing adjacent teeth", "Patients not opting for implants"]
      },
      {
        title: "Complete Dentures",
        overview: "Custom-made removable prosthesis to replace all teeth.",
        whoItsFor: ["Fully edentulous patients", "Those seeking removable options"]
      },
      {
        title: "Partial Dentures",
        overview: "Custom-made removable prosthesis to replace multiple missing teeth.",
        whoItsFor: ["Multiple missing teeth", "Budget-conscious solutions"],
        details: ["Acrylic", "Cast metal framework"]
      },
      {
        title: "Occlusal Analysis & Bite Rehab",
        overview: "Comprehensive evaluation and correction of bite alignment to restore functional harmony.",
        whoItsFor: ["Worn teeth", "TMJ discomfort", "Bite collapse cases"]
      }
    ]
  },
  {
    id: "endodontics",
    title: "Endodontics & Preventive Care",
    icon: ShieldCheck,
    description: "Preventive and infection-control treatments focused on long-term oral health.",
    services: [
      {
        title: "Root Canal Treatment (RCT)",
        overview: "Removal of infected pulp, cleaning of root canals, sealing to prevent reinfection.",
        whoItsFor: ["Severe tooth pain", "Infection", "Deep decay"],
        healing: "Post-Treatment: Crown usually recommended for protection."
      },
      {
        title: "Scaling & Polishing",
        overview: "Professional removal of plaque and tartar to prevent gum disease.",
        whoItsFor: ["Gum bleeding", "Plaque buildup", "Routine maintenance"],
        healing: "Recommended Frequency: Every 6 months."
      },
      {
        title: "Tooth Fillings",
        overview: "Material: Tooth-colored composite resin.",
        whoItsFor: ["Cavities", "Minor fractures"]
      },
      {
        title: "Routine Checkups",
        overview: "Comprehensive oral health monitoring and early detection.",
        details: ["Oral examination", "Digital imaging", "Early detection screening"]
      }
    ]
  },
  {
    id: "aesthetic",
    title: "Aesthetic & Orthodontic",
    icon: Smile,
    description: "Minimally invasive cosmetic enhancements designed for natural-looking results.",
    services: [
      {
        title: "Teeth Whitening",
        overview: "Method: Professional in-clinic whitening system.",
        whoItsFor: ["Stained teeth", "Discoloration"]
      },
      {
        title: "Veneers",
        overview: "Material: Porcelain or composite.",
        whoItsFor: ["Gaps", "Minor misalignment", "Shape irregularities"]
      },
      {
        title: "Smile Design",
        overview: "Comprehensive aesthetic transformation tailored to your facial features.",
        whoItsFor: ["Comprehensive aesthetic transformation"],
        details: ["Digital smile preview", "Shape correction", "Color optimization"]
      },
      {
        title: "Orthodontics (Braces)",
        overview: "Alignment correction for functional and aesthetic improvements.",
        whoItsFor: ["Crooked teeth", "Bite issues"],
        details: ["Metal braces", "Clear aligner therapy (if offered)"]
      }
    ]
  }
];

export default function ServicesPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="scene bg-scene-1 pt-32">
        <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="text-gold-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">Clinical Practice</span>
          <h1 className="mag-title text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-none">
            Specialist <br/> <span className="text-gold-accent italic">Dental Care</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
            Comprehensive restorative and aesthetic dentistry delivered with clinical precision using digital diagnostics and evidence-based protocols.
          </p>
        </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="scene bg-scene-2">
        <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-charcoal-grey border border-white/5 p-10 hover:border-gold-accent/30 transition-colors duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-3xl group-hover:bg-gold-accent/10 transition-colors duration-500" />
                <Icon className="w-10 h-10 text-gold-accent mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-2xl text-white mb-4">{pillar.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-light">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="scene bg-scene-3">
        <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-40">
          {serviceCategories.map((category, idx) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id} className="relative scroll-mt-32" id={category.id}>
                {/* Category Header */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="mb-16 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-white/10 pb-12"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border border-gold-accent/30 flex items-center justify-center bg-gold-accent/5">
                      <CategoryIcon className="w-8 h-8 text-gold-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="font-display text-4xl md:text-5xl text-white mb-2">{category.title}</h2>
                      <p className="text-slate-400 max-w-2xl font-light">{category.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block text-gold-accent/20 font-display text-8xl leading-none">
                    0{idx + 1}
                  </div>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.services.map((service, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                      className="bg-charcoal-grey/50 border border-white/5 p-8 hover:border-gold-accent/20 transition-all duration-500 group flex flex-col h-full relative overflow-hidden"
                    >
                      {/* Abstract Visual Header */}
                      <div className="h-32 w-full mb-8 relative overflow-hidden bg-charcoal-black border border-white/5 flex items-center justify-center group-hover:border-gold-accent/30 transition-colors">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/5 to-transparent opacity-50" />
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 20 + sIdx * 5, repeat: Infinity, ease: "linear" }} 
                          className="w-16 h-16 border border-gold-accent/20 rounded-full border-dashed absolute" 
                        />
                        <CategoryIcon className="w-6 h-6 text-gold-accent/50 relative z-10" />
                      </div>

                      <h3 className="font-display text-2xl text-gold-accent mb-4 flex items-center justify-between">
                        {service.title}
                        <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                      </h3>
                      
                      {service.overview && (
                        <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light">
                          {service.overview}
                        </p>
                      )}

                      <div className="mt-auto space-y-6">
                        {service.whoItsFor && (
                          <div>
                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-3">Who it&apos;s for</h4>
                            <ul className="space-y-2">
                              {service.whoItsFor.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                  <CheckCircle2 className="w-4 h-4 text-gold-accent/70 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {service.details && (
                          <div>
                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-3">Details</h4>
                            <ul className="space-y-2">
                              {service.details.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                  <ArrowRight className="w-4 h-4 text-gold-accent/50 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(service.info || service.healing) && (
                          <div className="pt-6 border-t border-white/5 space-y-3">
                            {service.info && (
                              <div className="flex items-start gap-3 text-sm text-slate-300 bg-gold-accent/5 p-4 rounded-sm border border-gold-accent/10">
                                <Info className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                                <span>{service.info}</span>
                              </div>
                            )}
                            {service.healing && (
                              <div className="flex items-start gap-3 text-sm text-slate-300 bg-white/5 p-4 rounded-sm border border-white/5">
                                <HeartPulse className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{service.healing}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="scene bg-scene-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-accent/10 via-charcoal-grey to-charcoal-grey border border-gold-accent/20 p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C5A05905_1px,transparent_1px),linear-gradient(to_bottom,#C5A05905_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          <div className="relative z-10">
            <h2 className="mag-title text-4xl md:text-5xl text-white mb-6">Schedule Your Clinical Consultation</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-light">
              Every treatment begins with a comprehensive assessment and digital evaluation to determine the most predictable solution for your case.
            </p>
            <a href="/contact" className="gold-button inline-block text-center">Request Appointment</a>
          </div>
        </motion.div>
        </div>
      </section>
    </main>
  );
}
