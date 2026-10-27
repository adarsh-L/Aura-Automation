import { motion } from 'framer-motion';
import { DatabaseZap, BrainCircuit, Send } from 'lucide-react';

const steps = [
  {
    id: 'data-capture',
    step: '01',
    icon: DatabaseZap,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    title: 'Data Capture',
    description:
      'Multi-source intake pipelines harvest lead data from web forms, CRMs, and social signals. Every submission triggers a real-time n8n workflow, logging structured records to Google Sheets and your CRM simultaneously.',
    tags: ['Google Sheets', 'n8n Webhooks', 'CRM Ingestion'],
  },
  {
    id: 'ai-qualification',
    step: '02',
    icon: BrainCircuit,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'AI Qualification',
    description:
      'A GPT-4 powered scoring engine evaluates each lead across 12+ intent dimensions — budget signals, timeline fit, industry relevance, and more. Prospects are ranked and tagged automatically within seconds.',
    tags: ['GPT-4 Scoring', 'Intent Analysis', 'Auto-Tagging'],
  },
  {
    id: 'automated-outreach',
    step: '03',
    icon: Send,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    title: 'Automated Outreach',
    description:
      'High-priority leads receive personalised, context-aware messages via Email and Telegram within minutes of qualification. Sequences adapt based on engagement, ensuring zero manual follow-up overhead.',
    tags: ['Email Automation', 'Telegram Bot', 'Smart Sequences'],
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4 border"
            style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.3)', color: '#60A5FA' }}
          >
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            From Signal to{' '}
            <span className="gradient-text">Signed Deal</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            A three-phase autonomous pipeline that turns raw data into closed revenue.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-1/2 top-8 bottom-8 w-px -translate-x-px hidden sm:block timeline-line opacity-30" />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  id={`process-step-${step.id}`}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-12 last:pb-0"
                >
                  {/* Step number + icon (center on md) */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center gap-2 sm:w-12">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: step.bg, border: `2px solid ${step.color}40` }}
                    >
                      <Icon size={22} style={{ color: step.color }} />
                    </div>
                    <span className="text-xs font-bold tabular-nums" style={{ color: step.color }}>
                      {step.step}
                    </span>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 glass rounded-2xl p-6 md:p-8 ml-0 sm:ml-4">
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ background: `${step.color}12`, color: step.color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
