import { motion } from 'framer-motion';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const scrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-20">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-24 left-8 md:left-24 w-64 h-64 rounded-full pointer-events-none animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-32 right-8 md:right-24 w-80 h-80 rounded-full pointer-events-none animate-float-delayed"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider border"
              style={{
                background: 'rgba(59,130,246,0.08)',
                borderColor: 'rgba(59,130,246,0.3)',
                color: '#60A5FA',
              }}
            >
              <Sparkles size={13} />
              AI-POWERED AUTOMATION — BENGALURU
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-5xl"
          >
            Your Business,{' '}
            <span className="gradient-text">Powered by Autonomous Intelligence.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            We bridge the gap between complex data and actionable growth using{' '}
            <span style={{ color: '#CBD5E1' }}>custom-built AI agents</span> and{' '}
            <span style={{ color: '#CBD5E1' }}>multi-channel orchestration</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-2">
            <a
              href="#contact"
              id="hero-cta-primary"
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                boxShadow: '0 0 40px rgba(59,130,246,0.35)',
              }}
            >
              Start Your AI Journey
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              id="hero-cta-secondary"
              onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-800 border border-slate-700 hover:border-slate-500"
            >
              <Bot size={18} />
              Explore Services
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8 pt-8 border-t w-full max-w-xl"
            style={{ borderColor: 'rgba(51,65,85,0.6)' }}
          >
            {[
              { value: '10x', label: 'Faster Lead Qualification' },
              { value: '95%', label: 'Workflow Automation' },
              { value: '24/7', label: 'AI Agent Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0F172A, transparent)' }}
      />
    </section>
  );
}
