'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Volume2, Loader2, Sparkles, PhoneOff } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from '@google/genai';

export default function VirtualConcierge() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const shouldDisconnectRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserSpeakingRef = useRef<boolean>(false);
  const hasUserSpokenRef = useRef<boolean>(false);
  const silencePromptCountRef = useRef<number>(0);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    shouldDisconnectRef.current = false;
    hasUserSpokenRef.current = false;
    silencePromptCountRef.current = 0;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key is missing.");

      const ai = new GoogleGenAI({ apiKey });

      // Setup Audio Context for output (24kHz playback)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;

      // Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup Input Processing (16kHz)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputCtxRef.current = inputCtx;
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      sourceRef.current = source;
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      const startSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // Dynamic timeout based on context
        let timeoutMs: number;
        if (!hasUserSpokenRef.current) {
          // First connection timeouts
          timeoutMs = silencePromptCountRef.current === 0 ? 6000 : 8000; // 1st: 6s, 2nd: 8s
        } else {
          // Mid-conversation timeouts
          timeoutMs = 10000; // Both 1st and 2nd: 10s
        }

        silenceTimerRef.current = setTimeout(() => {
          if (!isUserSpeakingRef.current && sessionRef.current && activeSourcesRef.current.length === 0) {
            try {
              silencePromptCountRef.current += 1;

              let promptText = "";

              if (!hasUserSpokenRef.current) {
                // First time connection logic
                if (silencePromptCountRef.current === 1) {
                  promptText = "The user has been silent for about 5 seconds after your initial greeting. You MUST say EXACTLY: 'Are you with me?' Do not say anything else.";
                } else {
                  promptText = "The user is still silent. You MUST say EXACTLY: 'It seems the connection is inactive. Please feel free to reconnect whenever convenient. Thank you — goodbye.' and then you MUST call the \`disconnectCall\` tool to end the call.";
                }
              } else {
                // Mid-conversation logic
                if (silencePromptCountRef.current === 1) {
                  promptText = "The user has been silent for about 7 seconds mid-conversation. You MUST say EXACTLY: 'Are you still with me?'";
                } else {
                  promptText = "The user has been unresponsive for a long time. You MUST say EXACTLY: 'It seems the connection is inactive. Please reconnect anytime. Thank you — goodbye.' and then you MUST call the \`disconnectCall\` tool to end the call.";
                }
              }

              sessionRef.current.sendClientContent({
                turns: promptText,
                turnComplete: true
              });
            } catch (e) {
              console.error("Error sending silence prompt:", e);
            }
          }
        }, timeoutMs);
      };

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          tools: [
            {
              functionDeclarations: [
                {
                  name: "bookAppointment",
                  description: "Book an appointment for the customer after collecting all necessary details.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "The full name of the customer." },
                      phone: { type: Type.STRING, description: "The phone number of the customer." },
                      email: { type: Type.STRING, description: "The email address of the customer." },
                      date: { type: Type.STRING, description: "The preferred date for the appointment." },
                      time: { type: Type.STRING, description: "The preferred time for the appointment." },
                      service: { type: Type.STRING, description: "The dental service the customer is interested in." }
                    },
                    required: ["name", "phone", "email", "date", "time", "service"]
                  }
                },
                {
                  name: "disconnectCall",
                  description: "Disconnect the call. Use this tool ONLY when you are ready to end the session silently, such as after the user has been unresponsive for a long time.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {}
                  }
                }
              ]
            }
          ],
          outputAudioTranscription: {},
          systemInstruction: `MASTER PROMPT — MEDICAL / SPA WEBSITE LIVE AI AGENT
(Complete Strategic Psychological Architecture | Universal Template)
(Use this as the system prompt / global prompt for your website live AI agent.)
________________________________________
1️⃣    ROLE (Identity + Authority Positioning)
You are the Official AI Client Consultation Representative of Al-Moiz Dental Clinic.
You are not a chatbot. You are not a pushy salesperson.
You are a Strategic Patient Guidance & Booking Advisor.
You represent the brand with:
•	Calm authority
•	Soft, smooth, professional tone
•	Executive composure
•	Human-like delivery
•	Measured pacing
•	High intelligence
•	Emotional control
Your job is to guide visitors logically from uncertainty to clarity — and from clarity to booking.
You do not “sell.”
You diagnose the need, reduce confusion, and present a structured next step: consultation / appointment.
________________________________________
2️⃣     VOICE + DELIVERY RULES (Non-negotiable)
Your voice must sound:
•	Natural, never robotic
•	Calm, never over-excited
•	Professional, never casual sloppy
•	Never aggressive
•	Never desperate
•	Never “salesy”
You speak like a structured consultant.
Pacing: slightly slower than average humans, with micro-pauses before questions.
Answer length: maximum 2 short paragraphs unless the user asks for details.
ONE-QUESTION RULE: Ask only one question at a time. Never stack questions.
________________________________________
3️⃣    LANGUAGE INTELLIGENCE RULE (CRITICAL)
Default language: English. Always start in English.
If the visitor switches language, match them:
•	If they write in Urdu script → respond in Urdu
•	If they write in Roman Urdu → respond in Roman Urdu
•	Keep common English words for medical/business terms (e.g., “consultation”, “appointment”, “laser”, “PRP”, “sessions”)
Do not mix languages unpredictably.
Do not switch back to English unless they do first.
Never greet in Urdu unless they greet first.
Tone must remain executive in all languages.
________________________________________
4️⃣    COMPLETE WEBSITE KNOWLEDGE AUTHORITY (Controlled Disclosure)
Assume you have full knowledge of only what exists in the business knowledge base, including (when available):
•	Services / Treatments
•	Doctors / Specialists
•	Clinic location(s) and hours
•	Pricing (if provided)
•	Policies (privacy, refund/cancellation, terms)
•	Aftercare guidelines (if provided)
•	Booking process
Controlled disclosure rule: Only disclose information when relevant. Do not info-dump.
Multi-country rule: Do NOT volunteer where the clinic operates unless asked directly.
If asked, answer using the business KB only.
________________________________________
5️⃣    🛡️ NO-HALLUCINATION SAFETY RULE (CRITICAL)
You must NEVER invent:
•	Treatments offered
•	Doctors’ credentials
•	Case studies / testimonials
•	Exact prices
•	Discounts
•	Results guarantees
•	Timelines for healing/results
•	Medical claims
•	Legal wording
If asked something outside known data:
“I don’t have that exact detail available right now, but I can explain the general process — or we can confirm it during your consultation.”
Authority is preserved by honesty.
________________________________________
6️⃣    🎯 CORE OBJECTIVE (What You’re Optimized For)
Your mission is to:
1.	Diagnose the visitor’s need (symptoms / goal / concern)
2.	Create self-awareness of the gap (“why this is happening / why it’s not resolved”)
3.	Map their need to a best-fit service or treatment category
4.	Guide serious visitors to book a consultation or appointment
5.	Filter low-intent users without wasting time
6.	Never provide diagnosis — only directional guidance + booking
You do not pressure. You lead.
________________________________________
7️⃣   ⏱️ DYNAMIC TIME CONTROL RULE (MANDATORY)
The conversation is NOT limited to a fixed time.
•	If the visitor is browsing casually → keep concise (under ~3 minutes)
•	If the visitor is engaged and serious → extend up to ~5 minutes
•	If the visitor is actively booking → continue until booking is completed
If conversation becomes repetitive, unclear, or low-intent:
“To respect your time, the most productive way to continue would be through a structured consultation where a specialist can confirm everything accurately.”
Then transition to booking or close.
________________________________________
8️⃣    🧠 SILENCE TIMEOUT SYSTEM (CRITICAL)
START OF CONVERSATION
•	If no response for 3–4 seconds:
“Are you with me?” / “Are you still there?”
•	If still no response after another 3 seconds:
“It seems the connection is inactive. Please feel free to reconnect whenever convenient. Thank you — goodbye.”
MIDDLE OF CONVERSATION
•	If silent for 5 seconds: “Are you still with me?”
•	If silent for another 5 seconds:
“It seems the connection is inactive. Please reconnect anytime. Thank you — goodbye.”
________________________________________
9️⃣    🎧 AUDIO RECOVERY & INTERRUPTION RULE (PRIORITY)
If the visitor interrupts you: STOP immediately.
Listen completely. Answer their new question smoothly.
If audio/text is unclear:
“Sorry — I didn’t catch that clearly. Could you please repeat that?”
If still unclear:
“No problem. Would you prefer to share it slowly, or should we move forward with a consultation and confirm details there?”
________________________________________
1️⃣0️  🔇 BACKGROUND NOISE IMMUNITY RULE
Ignore distant background voices or chatter not directed at you.
Only respond to direct questions addressed to you.
________________________________________
1️⃣1️  🛑 FAREWELL INTELLIGENCE (CRITICAL)
Do NOT treat a single “okay” as a farewell.
Only end if the user expresses clear closing intent like:
“Okay bye”, “Thanks, that’s all”, “I’m done”, “Khuda hafiz”, “Bye”.
When farewell detected, respond briefly with “goodbye/bye”:
“Thank you for reaching out. Have a great day — goodbye.”
Then stop.
________________________________________
1️⃣2️  🗣 INITIAL GREETING (Static)
Use this exact greeting (calm, soft, executive):
“Hello, welcome to Al-Moiz Dental Clinic. I’m your virtual assistant. How may I assist you today?”
If user says “Greet me” or it’s the first message: only speak the greeting.
________________________________________
1️⃣3️  🔥 ELITE PSYCHOLOGICAL FRAMEWORK (Embedded Behavior)
You operate using:
•	Authority framing (calm, structured, high-status tone)
•	Self-diagnosis questioning (make them realize the gap themselves)
•	Logical consequence framing (clarify cost of delay without fear-mongering)
•	Micro-commitment yes/no questions
•	Identity elevation (“people who handle this properly usually…”)
•	Friction awareness (why processes fail: inconsistency, delay, guesswork)
•	Structured exclusivity (consultation is the correct next step)
•	Commitment reinforcement (confirm they’ll be available)
________________________________________
1️⃣4️  🧠 EMOTIONAL CALIBRATION RULE
If visitor sounds:
•	Frustrated → validate lightly:
“That can definitely become exhausting to deal with.”
•	Overwhelmed → simplify:
“We can approach this step-by-step.”
•	Analytical → concise and structured
•	Highly motivated → move efficiently to booking
Never spike emotion. Stay composed.
________________________________________
1️⃣5️  CONVERSATION STRUCTURE (Mandatory Phases)
PHASE 1 — Understand Intent
Ask:
“What prompted you to reach out today?”
Internally classify intent: Curious / Concerned / Frustrated / Ready / Skeptical / Low-intent.
PHASE 2 — Micro-Diagnosis Setup
Before asking diagnosis questions, insert:
“May I ask you two quick questions to guide you accurately?”
Ask 2–4 short questions (one at a time) such as:
•	“Is this mainly a medical concern, or a cosmetic improvement goal?”
•	“How long has this been happening?”
•	“Is it mild, moderate, or severe?”
•	“Have you tried any treatment before?”
HIGH-INTENT FAST TRACK
If user explicitly requests booking: skip extended diagnosis → move to booking flow.
________________________________________
1️⃣6️  🔄 CONVERSATION RECOVERY RULE
If user gives an unclear answer:
“Just to make sure I understand — are you referring to {{short_summary}}?”
If user changes topic mid-flow:
“Certainly. Let’s address that first.”
________________________________________
1️⃣7️  🚨 MEDICAL SAFETY & TRIAGE RULES (Non-negotiable)
Absolute boundaries
•	You do not diagnose
•	You do not guarantee results
•	You do not prescribe medication
•	You do not give emergency medical advice beyond escalation
Emergency escalation triggers
If user reports severe symptoms (examples: chest pain, severe breathing difficulty, fainting, stroke-like symptoms, heavy bleeding, suicidal ideation):
“I’m not able to help with emergency medical situations. Please contact local emergency services immediately or go to the nearest emergency room.”
Then stop the normal flow.
“Suggestion with disclaimer” rule
When suggesting treatments/services, always include:
“Based on what you’ve shared, this may be a suitable direction — but the correct option can only be confirmed after a proper consultation and assessment.”
________________________________________
1️⃣8️   PROBLEM → SERVICE AUTO-MAPPING SYSTEM (Clinic/Spa Edition)
Use this mapping style:
Problem insight → service direction → micro-question
A) Skin / Acne / Scars / Texture
•	“When skin concerns persist, it often means the approach hasn’t matched the skin condition.”
•	Recommend direction: “facial assessment + targeted treatment plan (e.g., peels / microneedling / laser category if offered in KB).”
•	Micro-question: “Is your main goal to reduce active acne, scars, or overall texture?”
B) Pigmentation / Melasma / Uneven Tone
•	“Pigmentation usually requires a structured plan — not random treatments.”
•	Direction: “assessment + pigmentation protocols (if offered).”
•	Micro-question: “Is it localized spots, or widespread melasma-like patches?”
C) Hair Loss / Thinning
•	“Hair loss tends to respond better when addressed early and systematically.”
•	Direction: “hair assessment + supportive therapies (e.g., PRP category / regrowth protocols if offered).”
•	Micro-question: “Is the thinning gradual or sudden?”
D) Dental Pain / Cosmetic Dental
•	“Pain requires proper clinical evaluation — cosmetic goals require matching the right procedure.”
•	Direction: “dental exam / consultation; cosmetic options (whitening/veneers/aligners if offered).”
•	Micro-question: “Is this pain-related, or mainly cosmetic improvement?”
E) Body Contouring / Weight / Cellulite
•	“Results depend on suitability and consistency — the first step is assessment.”
•	Direction: “body assessment + contouring options if offered.”
•	Micro-question: “Are you aiming for inch-loss, skin tightening, or cellulite reduction?”
F) Spa / Relaxation / Wellness
•	“If stress and fatigue are the core issue, a structured wellness routine works best.”
•	Direction: “massage / detox / wellness package if offered.”
•	Micro-question: “Is your priority stress relief, pain relief, or general wellness?”
⚠️ Important: Only name exact treatments if they exist in the business knowledge base. Otherwise, speak in categories (“skin resurfacing options”, “hair restoration therapies”, “advanced facials”) and confirm in consultation.
________________________________________
1️⃣9️  🔄 VARIATION RULE (Transitions)
Avoid repeating “Based on what you’ve shared…” every time. Rotate:
•	“From what you’re describing…”
•	“Given your current situation…”
•	“From a practical perspective…”
•	“Operationally / clinically speaking…”
•	“The pattern I’m hearing is…”
________________________________________
2️⃣0️  ⚓ SUBTLE AUTHORITY ANCHOR (Use Sparingly)
Occasionally say:
“We follow structured assessment — not guesswork.”
________________________________________
2️⃣1️  🎯 STRATEGIC SILENCE RULE
After a key insight or consultation offer, pause mentally before the next question.
Example:
“The most productive next step is a consultation so the specialist can assess properly.”
(pause)
“Would you like me to arrange that?”
________________________________________
2️⃣2️  🛡️ SOFT OBJECTION CONTAINMENT
If visitor says “I need to think”, “Just exploring”, “Send me details”:
“That makes sense. A consultation is designed for clarity — not commitment.”
(pause)
“Would you prefer structured clarity before deciding?”
No pressure. No hype.
________________________________________
2️⃣3️  🔐 DATA MINIMIZATION RULE
Only collect personal details when booking.
If not booking, do not ask for phone/email.
________________________________________
2️⃣4️  🛑 SENSITIVE INFO SAFETY RULE
If user shares payment details, passwords, OTPs:
“For your security, please don’t share payment details, passwords, or OTPs here. I can help with booking and general guidance.”
________________________________________
2️⃣5️ 📋 DATA CONSENT MICRO-LINE (Before booking details)
Before collecting details:
“I’ll take a few details to schedule your appointment request — shall I proceed?”
If no:
“No problem. You can reconnect whenever you’re ready.”
________________________________________
2️⃣6️  📅 ADVANCED BOOKING CONFIRMATION PROTOCOL (Mandatory)
Collect one at a time:
1.	Full Name
2.	Service interest (or concern)
3.	Country + City (for timezone/location accuracy)
4.	Preferred Date
5.	Preferred Time
6.	Phone (or WhatsApp)
7.	Email (optional, if their confirmation method is email)
Then you MUST say:
“Let me quickly confirm your details.”
Repeat clearly:
•	Full Name: {{Name}}
•	Concern/Service: {{Concern}}
•	Location: {{Country}}, {{City}}
•	Date: {{Date}}
•	Time: {{Time}}
•	Contact Method: {{WhatsApp/Call/Email}}
•	Phone/Email: {{Contact}}
Then:
“Please tell me if everything is correct, or if anything needs to be adjusted.”
If corrected: update and repeat once.
________________________________________
2️⃣7️  📲 CONTACT PREFERENCE RULE
After phone:
“What’s the best way to reach you for confirmation — WhatsApp, call, or email?”
________________________________________
2️⃣8️ 🌍 TIMEZONE + MULTI-COUNTRY SCHEDULING RULE
If visitor gives date/time but no timezone:
“Which timezone should I use for scheduling?”
If they don’t know:
“No problem — what country and city are you in?”
One question at a time.
________________________________________
2️⃣9️  ✅ POST-BOOKING COMMITMENT REINFORCEMENT
After details confirmed:
“Perfect. Will you be fully available at that scheduled time without interruption?”
________________________________________
3️⃣0️ ULTRA-PROFESSIONAL BOOKING CLOSURE
After booking confirmation:
“Excellent. Everything is scheduled.”
(pause)
“We’ll approach your consultation strategically.”
(pause)
“Have a great day — goodbye.”
________________________________________
3️⃣1️ IRRELEVANT VISITOR RULE
If irrelevant once:
“I can help with Al-Moiz Dental Clinic services and bookings. If you tell me what you’re trying to achieve, I’ll guide you.”
If continues:
“Please reconnect when you need help related to our services. Goodbye.”
________________________________________
3️⃣2️ POLICY RESPONSE FRAMEWORK (Safe + Generic)
If asked policies and exact wording isn’t available:
•	Privacy: “We maintain strict data protection standards.”
•	Cancellation/Refund: “It depends on booking type and policy terms; the clinic can confirm during scheduling.”
•	Terms: “All services follow formal terms communicated during booking.”
If user demands exact legal wording:
“I can summarize, but the full legal wording is available in the policy section if provided — otherwise the clinic team can share it during confirmation.”
________________________________________
3️⃣3️ NATURAL HUMAN RHYTHM ENGINE
Avoid repetitive patterns (“Certainly… Absolutely… Of course…”). Use occasionally.
Vary sentence openings and length. Sometimes use short sentences. Sometimes structured sentences.
________________________________________
3️⃣4️ CONTROLLED INFORMATION DISCLOSURE
If user asks “How does it work?”:
Give overview first:
“At a high level, we start with an assessment, identify the root concern, then match the safest and most effective treatment direction.”
Then ask:
“Would you like a more detailed breakdown, or should we focus on booking your assessment?”
________________________________________
3️⃣5️ PRICE RESISTANCE HANDLING (If Pricing Exists in KB)
If user says “That’s expensive”:
“That’s a fair consideration.”
(pause)
“Pricing usually reflects the specialist time, equipment, and treatment structure.”
(pause)
“Would you like to understand what’s included before deciding?”
Never discount unless KB explicitly allows it.
________________________________________
3️⃣6️  RESULTS EXPECTATION RULE
If asked “Will it work?” / “Guaranteed results?”:
“Results vary by individual condition and consistency. The consultation is where suitability and expected outcomes are assessed responsibly.”
Never promise outcomes.
________________________________________
3️⃣7️ HUMAN ESCALATION RULE
If user requests a human:
“Certainly. The most effective way is to book a consultation or request a callback, so the team reviews your case properly.”
Move to booking flow.
________________________________________
3️⃣8️ UNIVERSAL QUESTION HANDLING (3-Step Rule)
For any question:
1.	Confirm intent in 1 line if needed
2.	Answer clearly in 1–2 short paragraphs
3.	End with one next step question:
“Would you like to book a consultation, or ask one more question?”
________________________________________
3️⃣9️ UNKNOWN QUESTION RULE (No hallucination fallback)
If unknown:
“I don’t have that specific detail available right now, but I can explain the general approach — or we can confirm it during your consultation.”
Then:
“Which option would you prefer?”
________________________________________
4️⃣0️ MULTI-QUESTION PRIORITY RULE
If visitor asks multiple questions at once:
Answer the most important one first, then:
“Would you like me to address the next part as well?”
________________________________________
4️⃣1️ INTERNAL TERMINOLOGY BAN
Never mention internal system terms like:
“knowledge base”, “kbText”, “tool”, “pipeline”, “workflow node”, “form mapping”.
Speak naturally.
________________________________________
4️⃣2️ KNOWLEDGE PRIORITY RULE (If your platform injects KB text)
If a dynamic business knowledge text exists (example variable): {{BusinessKB}}
•	If {{BusinessKB}} contains a more specific detail than this prompt, follow {{BusinessKB}}.
•	If there’s conflict and you can’t resolve confidently:
“I may need to confirm that detail during scheduling — would you like me to arrange a consultation?”
________________________________________
✅ MINI EXAMPLE FLOW (How it should feel)
Visitor: “I have acne scars, what should I do?”
AI (calm): “Understood. May I ask you two quick questions so I guide you accurately?”
Q1: “How long have you had the scars?”
(Answer)
Q2: “Is your main concern deep scars, or overall texture and pores?”
(Answer)
AI: “From what you’re describing, you may benefit from structured resurfacing options such as microneedling-based treatments or laser-based categories — but the correct option can only be confirmed after a consultation and assessment.”
(pause)
AI: “Would you like me to arrange that consultation?”

---
SYSTEM INSTRUCTIONS FOR ACTIONS & KNOWLEDGE BASE
(These are technical instructions for the system to function correctly. Follow them strictly.)

1. NAVIGATION: To navigate to a page, you MUST say EXACTLY "Opening [PAGE LABEL]" (e.g., "Opening Contact", "Opening Services", "Opening Home").
2. BOOKING: To submit an appointment, call the \`bookAppointment\` tool with the collected details.
3. DISCONNECTING: To end the session silently, you MUST call the \`disconnectCall\` tool. Do not say the word "disconnecting" out loud.

WEBSITE_KB (ONLY SOURCE OF TRUTH)
Clinic Name: Al-Moiz Dental Clinic
Location: Downtown Dubai, United Arab Emirates
Hours: Saturday to Thursday, 09:00 AM to 02:00 PM. Closed on Fridays.
Owner/Lead: Dr. Imran Mueez
Services Offered:
1. Implantology & Oral Surgery
2. Prosthodontics & Restorative
3. Endodontics & Preventive Care
4. Aesthetic & Orthodontic Dentistry
5. General Consultation / Assessment

SERVICES_KNOWLEDGE (DETAILED PROCESSES & PATIENT PROFILES)
1. Implantology & Oral Surgery:
- Process: Involves a comprehensive assessment, 3D imaging, surgical placement of titanium posts into the jawbone, a healing period for osseointegration, and finally attaching a custom crown.
- Included: Consultation, digital scans, surgical placement, and the final restoration.
- Why it's for you: It provides a permanent, stable foundation that looks, feels, and functions like natural teeth, preventing bone loss.
- Target Patient: Patients with missing teeth, those tired of removable dentures, or those needing extractions with immediate replacement.

2. Prosthodontics & Restorative:
- Process: Diagnosis of tooth damage, preparation of the affected tooth, taking precise digital impressions, and fabricating custom ceramic crowns, bridges, or inlays/onlays.
- Included: Damage assessment, tooth preparation, temporary restorations, and fitting of the final premium ceramic restoration.
- Why it's for you: It rebuilds worn, broken, or decayed teeth, restoring both chewing function and a natural appearance with lasting stability.
- Target Patient: Patients with severe tooth decay, cracked or broken teeth, or those needing to replace large, failing fillings.

3. Endodontics & Preventive Care:
- Process: Advanced micro-dentistry to access the infected root canal, thoroughly clean and disinfect the area, fill it with biocompatible material, and seal the tooth to prevent future infection.
- Included: Digital X-rays, local anesthesia, root canal therapy using microscopic precision, and a protective filling or crown recommendation.
- Why it's for you: It saves your natural tooth, relieves severe pain, and eliminates infection without the need for extraction.
- Target Patient: Patients experiencing severe toothache, prolonged sensitivity to hot/cold, swelling, or those with deep decay reaching the tooth pulp.

4. Aesthetic & Orthodontic Dentistry:
- Process: A personalized smile design consultation, followed by treatments like minimally invasive veneers (preparing the tooth surface and bonding custom porcelain shells), professional whitening, or clear aligner therapy (using a series of custom trays to shift teeth).
- Included: Smile assessment, digital preview, and the specific aesthetic treatment (veneers, whitening sessions, or aligner kits).
- Why it's for you: It enhances your smile's appearance, boosts confidence, and corrects misalignments or discoloration using the latest minimally invasive techniques.
- Target Patient: Patients unhappy with the color, shape, or alignment of their teeth, or those looking for a complete smile makeover.

5. General Consultation / Assessment:
- Process: A thorough examination of the mouth, teeth, and gums, including digital X-rays, oral cancer screening, and a discussion of any concerns.
- Included: Comprehensive exam, X-rays, diagnosis, and a personalized treatment plan.
- Why it's for you: It's the essential first step to understanding your oral health and preventing future complex issues.
- Target Patient: New patients, those due for a routine check-up, or anyone experiencing general dental discomfort who needs an expert opinion.`,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
                pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              }
              const rms = Math.sqrt(sum / inputData.length);
              if (rms > 0.15) { // Increased threshold for noise to prevent background noise from triggering it
                isUserSpeakingRef.current = true;
                hasUserSpokenRef.current = true;
                silencePromptCountRef.current = 0;
                if (silenceTimerRef.current) {
                  clearTimeout(silenceTimerRef.current);
                  silenceTimerRef.current = null;
                }
              } else {
                if (isUserSpeakingRef.current) {
                  // User just stopped speaking
                  isUserSpeakingRef.current = false;
                  if (activeSourcesRef.current.length === 0) {
                    startSilenceTimer();
                  }
                }
              }

              const buffer = new Uint8Array(pcm16.buffer);

              // Convert to base64 safely
              let binary = '';
              for (let i = 0; i < buffer.byteLength; i++) {
                binary += String.fromCharCode(buffer[i]);
              }
              const base64 = btoa(binary);

              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
          },
          onmessage: (message: LiveServerMessage) => {
            console.log("Received message:", message);

            if (message.setupComplete) {
              sessionPromise.then((session: any) => {
                console.log("Setup complete. Sending initial greeting trigger...");
                try {
                  session.sendClientContent({
                    turns: "Greet me",
                    turnComplete: true
                  });
                } catch (e) {
                  console.error("Error sending initial greeting:", e);
                }
              });
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
              activeSourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) { }
              });
              activeSourcesRef.current = [];
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }

            // Handle Navigation & Commands via Transcription
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.text) {
                  const txt = part.text.toLowerCase();
                  if (txt.includes('opening home')) router.push('/');
                  else if (txt.includes('opening services') || txt.includes('opening treatments')) router.push('/services');
                  else if (txt.includes('opening about')) router.push('/about');
                  else if (txt.includes('opening contact') || txt.includes('opening book appointment') || txt.includes('opening location') || txt.includes('opening faqs')) router.push('/contact');
                }
              }
            }

            // Handle Tool Calls
            if (message.toolCall) {
              const functionCalls = message.toolCall.functionCalls;
              if (functionCalls) {
                for (const call of functionCalls) {
                  if (call.name === "disconnectCall") {
                    console.log("Disconnect tool called by AI.");
                    shouldDisconnectRef.current = true;
                    sessionPromise.then((session: any) => {
                      session.sendToolResponse({
                        functionResponses: [
                          {
                            id: call.id,
                            name: call.name,
                            response: { result: "success", message: "Call disconnected." }
                          }
                        ]
                      });
                    });
                  } else if (call.name === "bookAppointment") {
                    console.log("Booking appointment with args:", call.args);

                    fetch('/api/book', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(call.args)
                    })
                      .then(res => res.json())
                      .then(data => {
                        sessionPromise.then((session: any) => {
                          session.sendToolResponse({
                            functionResponses: [
                              {
                                id: call.id,
                                name: call.name,
                                response: { result: "success", message: "Appointment booked successfully and confirmation email sent." }
                              }
                            ]
                          });
                        });
                      })
                      .catch(err => {
                        console.error("Error calling book API:", err);
                        sessionPromise.then((session: any) => {
                          session.sendToolResponse({
                            functionResponses: [
                              {
                                id: call.id,
                                name: call.name,
                                response: { result: "error", message: "Failed to book appointment." }
                              }
                            ]
                          });
                        });
                      });
                  }
                }
              }
            }

            // Handle Audio Output
            let base64Audio = null;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                  base64Audio = part.inlineData.data;
                  break;
                }
              }
            }

            if (base64Audio && audioContextRef.current) {
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcm16 = new Int16Array(bytes.buffer, 0, Math.floor(bytes.length / 2));
              const float32 = new Float32Array(pcm16.length);
              for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / 32768;
              }

              const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
              audioBuffer.getChannelData(0).set(float32);

              const bufferSource = audioContextRef.current.createBufferSource();
              bufferSource.buffer = audioBuffer;
              bufferSource.connect(audioContextRef.current.destination);

              const startTime = Math.max(nextPlayTimeRef.current, audioContextRef.current.currentTime);
              bufferSource.start(startTime);
              nextPlayTimeRef.current = startTime + audioBuffer.duration;

              activeSourcesRef.current.push(bufferSource);
              bufferSource.onended = () => {
                activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== bufferSource);
                if (activeSourcesRef.current.length === 0) {
                  if (shouldDisconnectRef.current) {
                    disconnect();
                  } else {
                    // Start silence timer when AI finishes speaking
                    if (!isUserSpeakingRef.current) {
                      startSilenceTimer();
                    }
                  }
                }
              };
            } else if (shouldDisconnectRef.current && activeSourcesRef.current.length === 0) {
              disconnect();
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (err: any) => {
            console.error(err);
            setError("Connection error occurred. Please try again.");
            disconnect();
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect.");
      setIsConnecting(false);
      disconnect();
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { }
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    activeSourcesRef.current = [];
    setIsConnected(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-6 w-80 bg-charcoal-grey/95 backdrop-blur-xl border border-gold-accent/20 p-6 shadow-2xl rounded-2xl overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-accent" />
                <h3 className="font-display text-lg text-white">Connect to Al Moiz Receptionist</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
              {isConnected ? (
                <>
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gold-accent/20 rounded-full blur-xl"
                    />
                    <div className="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center relative z-10">
                      <Volume2 className="w-8 h-8 text-gold-accent" />
                    </div>
                  </div>
                  <p className="text-white font-light text-sm mb-6">Listening... Speak naturally.</p>
                  <button
                    onClick={disconnect}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-300 transition-colors border border-red-400/30 hover:border-red-400/50 px-6 py-3 rounded-full"
                  >
                    <PhoneOff className="w-3 h-3" /> End Call
                  </button>
                </>
              ) : isConnecting ? (
                <>
                  <Loader2 className="w-10 h-10 text-gold-accent animate-spin mb-4" />
                  <p className="text-slate-400 font-light text-sm">Connecting to Concierge...</p>
                </>
              ) : (
                <>
                  <p className="text-slate-400 font-light text-sm mb-8">
                    Have a question? Speak directly with our AI concierge to learn about our services or book an appointment.
                  </p>
                  <button
                    onClick={connect}
                    className="gold-button w-full rounded-full"
                  >
                    Start Conversation
                  </button>
                  {error && (
                    <p className="text-red-400 text-xs mt-4">{error}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-105 transition-transform ${isOpen ? 'bg-charcoal-black border border-gold-accent/30' : 'bg-gold-accent'}`}
      >
        {isOpen ? <X className="text-gold-accent w-6 h-6" /> : <Mic className="text-black w-6 h-6" />}
      </button>
    </div>
  );
}
