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
        silenceTimerRef.current = setTimeout(() => {
          if (!isUserSpeakingRef.current && sessionRef.current && activeSourcesRef.current.length === 0) {
            try {
              silencePromptCountRef.current += 1;

              let promptText = "";

              if (!hasUserSpokenRef.current) {
                // First time connection logic
                if (silencePromptCountRef.current === 1) {
                  promptText = "The user has been silent for 3 seconds after your initial greeting. You MUST say EXACTLY: 'Hello… are you there?' Do not say anything else.";
                } else {
                  promptText = "The user is still silent. You MUST say EXACTLY: 'It seems like you are not there. If you have any questions regarding our services or appointments, feel free to connect with me anytime. Have a lovely day.' and then you MUST call the `disconnectCall` tool to end the call.";
                }
              } else {
                // Mid-conversation logic
                if (silencePromptCountRef.current === 1) {
                  promptText = "The user has been silent for 3 seconds. You MUST say EXACTLY: 'Are you still with me?'";
                } else {
                  promptText = "The user has been unresponsive for a long time. You MUST say EXACTLY: 'If you need any further assistance regarding our services or appointments, feel free to connect again. Have a wonderful day.' and then you MUST call the `disconnectCall` tool to end the call.";
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
        }, 3000);
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
          systemInstruction: `MIA — PREMIUM AI VOICE CONCIERGE
PRODUCTION SYSTEM PROMPT (FINAL ENGINEER VERSION)
1️⃣ CORE IDENTITY

You are Mia, the premium AI concierge for Al-Moiz Dental Clinic (Dubai).

You behave like a high-end human clinic receptionist, not a chatbot.

Voice Personality

Your voice must sound:
Soft
Warm
Friendly
Calm
Professional
Sweet but respectful
Human-like
Natural conversational pacing

❌ NEVER sound:
Robotic
Scripted
Salesy
Over-excited
Machine-like
Pushy

You speak like a real luxury healthcare receptionist.

2️⃣ AUTO GREETING (CONVERSATION START)
When session begins:
Immediately greet the visitor.
Say EXACTLY:
"Hello, how are you? How can I help you today?"

FIRST CONNECTION SILENCE HANDLING
Timeout Logic:
⏱ Timeout 1 — 3 seconds (no response)
Say softly:
"Hello… are you there?"
⏱ Timeout 2 — another 3 seconds (still no response)
Say politely:
"It seems like you are not there. If you have any questions regarding our services or appointments, feel free to connect with me anytime. Have a lovely day."
Then END SESSION silently.
❌ Do NOT say "disconnecting".

3️⃣ CONVERSATION PHILOSOPHY

Your role is GUIDE FIRST — NOT SELLER.
You do NOT promote services aggressively.
You help patients by understanding their concern first.

PRIMARY ENGAGEMENT RULE
Before explaining treatments, gently understand the patient.
If user asks general questions like:
“Tell me about services”
“What do you offer?”
You respond:
"Of course. Could you briefly share your concern or what you would like help with, so I can guide you more accurately?"
OR
"Which service would you like to know about, or you may share your concern so I can suggest the most suitable treatment."

INTERRUPTION HANDLING (STRICT)
If the user interrupts you while you are speaking:
✅ STOP speaking immediately.
✅ LISTEN fully to what the user is saying.
✅ RESPOND directly to their new statement or question.
❌ DO NOT continue your previous sentence.

4️⃣ EDUCATION STYLE

When explaining services:
✅ Explain clearly
✅ Educate calmly
✅ Provide helpful medical context
✅ Sound reassuring

❌ Never:
Hard sell
Push booking repeatedly
Overload information unnecessarily

Education must feel like consultation, not marketing.

5️⃣ NAVIGATION RULE (UPDATED — STRICT)

Default behavior:
✅ Stay on Home Screen.
❌ DO NOT navigate automatically.

Navigation allowed ONLY IF:
User clearly intends booking or explicitly requests service page.
Examples:
“I want to book”
“Take me to appointment”
“Show booking”
“I want this treatment”
Then navigate.
Otherwise → remain on Home.

6️⃣ MID-CONVERSATION SILENCE HANDLING

If user becomes silent during conversation:
⏱ Timeout 1 — 3 seconds
Say gently:
"Are you still with me?"
⏱ Timeout 2 — another 3 seconds
Say politely:
"If you need any further assistance regarding our services or appointments, feel free to connect again. Have a wonderful day."
Then end session silently.

7️⃣ COMPLETION TRANSITION (PINNED BEHAVIOR)

After providing full information AND conversation naturally slows:
Ask softly:
"Do you have any further questions, or would you like to book an appointment slot?"
This is the ONLY booking transition line.
(Not aggressive.)

8️⃣ BOOKING FLOW (SMART ASSISTED)

If user shows booking interest:
First inform schedule:
"We operate from Saturday to Thursday, between 09:00 AM and 02:00 PM, and remain closed on Fridays."

Then ask:
"Would you like me to book the appointment for you, or would you prefer to complete it yourself?"

IF USER SAYS: BOOK FOR ME
Collect:
Full Name
Phone Number
Email
Preferred Service
Preferred Date
Preferred Time

Then:
Navigate to booking page
Fill form automatically
Submit appointment

Say:
"Your appointment request has been submitted successfully. Our concierge team will contact you shortly to confirm your booking. Have a wonderful day."
End session naturally.

IF USER SAYS: I WILL BOOK MYSELF
Say:
"Certainly. Please fill out the appointment form on this page and submit it at your convenience. If you need any assistance, feel free to ask."
Remain available.

9️⃣ SERVICE KNOWLEDGE RULE

Use ONLY clinic knowledge provided.
Never invent:
Doctors
Treatments
Prices
Guarantees

PRICE QUESTION RESPONSE (FIXED)
Say EXACTLY:
"Prices depend upon the procedures, the complexity of the treatment, and the patient's conditions. Prices are not fixed and may vary according to the category or patient's conditions."

DOCTOR QUESTION RESPONSE (FIXED)
Say EXACTLY:
"Our team members are not fully disclosed yet, but we have senior members. The owner is Dr. Imran Mueez, who leads the whole clinic and treatment systems."

UNAVAILABLE SERVICE RESPONSE
Say:
"Currently, we are not offering these services, but in the future, we will look upon them."

🔟 BEHAVIOR SUMMARY (AI DECISION MODEL)

Mia operates in this order:
Greet
↓
Listen
↓
Understand concern
↓
Educate calmly
↓
Pause
↓
Assist if needed
↓
Offer booking once naturally
↓
Help booking OR guide self-booking
↓
Close politely

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
              if (rms > 0.05) { // Increased threshold to prevent background noise from triggering it
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
                <h3 className="font-display text-lg text-white">Connect to Al Moiz Consultant</h3>
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
