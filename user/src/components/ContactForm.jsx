import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import FormField from './FormField';

// ─── CONFIG ────────────────────────────────────────────────────────────────────
// Set these values via environment variables (recommended) or replace the
// fallback strings below with your own endpoints before deploying.
//
// VITE_WEBHOOK_URL  — Your n8n webhook URL.
//   The webhook should accept POST requests with JSON body:
//   { name, email, mobile, interest, budget }
//
// VITE_TELEGRAM_BOT_URL — Deep-link to your Telegram bot (https://t.me/YOUR_BOT).
//   NOTE (Telegram Integration):
//   When the user clicks the Telegram button below and sends their email address
//   to the bot, the n8n workflow matches it against the lead record in Supabase,
//   stores the Telegram Chat ID, and activates the notification channel.
const WEBHOOK_URL =
  import.meta.env.VITE_WEBHOOK_URL ||
  'https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID';

const TELEGRAM_BOT_URL =
  import.meta.env.VITE_TELEGRAM_BOT_URL ||
  'https://t.me/YOUR_TELEGRAM_BOT';

const INTEREST_OPTIONS = [
  { value: '', label: 'Select an area of interest…' },
  { value: 'AI Automation', label: 'AI Automation' },
  { value: 'Software Development', label: 'Software Development' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Chatbot Deployment', label: 'Chatbot Deployment' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select your budget bracket…' },
  { value: '< $5,000', label: '< $5,000' },
  { value: '$5,000 - $20,000', label: '$5,000 – $20,000' },
  { value: '$20,000+', label: '$20,000+' },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  mobile: '',
  interest: '',
  budget: '',
};

const INITIAL_ERRORS = {
  name: '',
  email: '',
  mobile: '',
  interest: '',
  budget: '',
};

function validate(values) {
  const errs = { ...INITIAL_ERRORS };
  if (!values.name.trim()) {
    errs.name = 'Full name is required.';
  } else if (values.name.trim().length < 2) {
    errs.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errs.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errs.email = 'Please enter a valid email address.';
  }

  if (!values.mobile.trim()) {
    errs.mobile = 'Mobile number is required.';
  } else if (!/^\+?[\d\s\-().]{7,20}$/.test(values.mobile.trim())) {
    errs.mobile = 'Please enter a valid international mobile number (e.g. +91 98765 43210).';
  }

  if (!values.interest) {
    errs.interest = 'Please select a project interest.';
  }

  if (!values.budget) {
    errs.budget = 'Please select a budget bracket.';
  }

  return errs;
}

function hasErrors(errs) {
  return Object.values(errs).some(Boolean);
}

// ─── SUCCESS CARD ──────────────────────────────────────────────────────────────
function SuccessCard() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6"
      id="success-card"
    >
      {/* Animated check */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.12)' }}
        >
          <CheckCircle2 size={40} style={{ color: '#10B981' }} />
        </div>
        <span
          className="absolute inset-0 rounded-full"
          style={{ animation: 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite', border: '2px solid #10B981' }}
        />
      </div>

      <div>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Inquiry Received!</h3>
        <p className="text-base md:text-lg max-w-md mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
          Our AI agent is now analyzing your requirements to build a{' '}
          <span style={{ color: '#10B981' }}>custom automation roadmap</span> tailored to your business.
        </p>
      </div>

      {/* Telegram CTA */}
      <a
        id="telegram-cta-btn"
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group w-full sm:w-auto justify-center"
        style={{
          background: 'linear-gradient(135deg, #229ED9, #1A85C0)',
          boxShadow: '0 0 32px rgba(34,158,217,0.35)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.15 13.61l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.998.948z" />
        </svg>
        Get Instant Updates on Telegram
        <ExternalLink size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </a>

      {/* Handshake instructions */}
      <div
        className="w-full rounded-xl p-4 border text-sm leading-relaxed text-left"
        style={{
          background: 'rgba(59,130,246,0.05)',
          borderColor: 'rgba(59,130,246,0.2)',
          color: '#94A3B8',
        }}
      >
        <span className="font-bold" style={{ color: '#60A5FA' }}>📌 NOTE:</span> To link your account
        for <strong style={{ color: '#CBD5E1' }}>WhatsApp &amp; Telegram notifications</strong>, click the
        button above and reply with the{' '}
        <strong style={{ color: '#10B981' }}>Email Address you just used in the form</strong>. Our AI
        agent will verify and activate your notification channel within minutes.
      </div>
    </motion.div>
  );
}

// ─── CONTACT FORM ──────────────────────────────────────────────────────────────
export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(values);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);

    if (hasErrors(errs)) return;

    const formData = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      mobile: values.mobile.trim(),
      interest: values.interest,
      budget: values.budget,
    };

    setStatus('loading');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      console.log('Response:', data);

      setStatus('success'); // ✅ only AFTER confirmed success
    } catch (err) {
      console.error('Error:', err);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setValues(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
    setStatus('idle');
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4 border"
            style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.3)', color: '#60A5FA' }}
          >
            LET'S BUILD TOGETHER
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Start Your{' '}
            <span className="gradient-text">AI Transformation</span>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: '#64748B' }}>
            Tell us about your project and our AI agent will build a custom roadmap — within hours.
          </p>
        </motion.div>

        {/* Form / Success card */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <SuccessCard key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                id="inquiry-form"
                className="glass rounded-2xl p-6 md:p-10 flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    id="field-name"
                    label="Full Name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    placeholder="Arjun Sharma"
                    autoComplete="name"
                  />
                  <FormField
                    id="field-email"
                    label="Email Address"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="arjun@company.com"
                    autoComplete="email"
                  />
                </div>

                <FormField
                  id="field-mobile"
                  label="Mobile Number"
                  type="tel"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.mobile}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  hint="Supports international formats (e.g. +1, +44, +91)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    id="field-interest"
                    label="Project Interest"
                    type="select"
                    name="interest"
                    value={values.interest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.interest}
                    options={INTEREST_OPTIONS}
                  />
                  <FormField
                    id="field-budget"
                    label="Budget Bracket"
                    type="select"
                    name="budget"
                    value={values.budget}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.budget}
                    options={BUDGET_OPTIONS}
                  />
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      key="error-banner"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
                      style={{
                        background: 'rgba(239,68,68,0.06)',
                        borderColor: 'rgba(239,68,68,0.3)',
                        color: '#FCA5A5',
                      }}
                    >
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                      <div>
                        <span className="font-semibold" style={{ color: '#EF4444' }}>Connection failed.</span>{' '}
                        Our webhook is temporarily unreachable. Please{' '}
                        <button
                          type="button"
                          onClick={handleReset}
                          className="underline font-semibold hover:opacity-80 transition-opacity"
                          style={{ color: '#EF4444' }}
                          id="try-again-btn"
                        >
                          try again
                        </button>{' '}
                        or email us directly at{' '}
                        <a
                          href="mailto:hello@yourdomain.com"
                          className="underline hover:opacity-80 transition-opacity"
                          style={{ color: '#FCA5A5' }}
                        >
                          hello@yourdomain.com
                        </a>
                        .
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  id="submit-inquiry-btn"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    boxShadow: status === 'loading' ? 'none' : '0 0 40px rgba(59,130,246,0.35)',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending to AI Agent…
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Service Inquiry
                    </>
                  )}
                </button>

                <p className="text-center text-xs" style={{ color: '#475569' }}>
                  🔒 Your data is encrypted and never shared with third parties.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
