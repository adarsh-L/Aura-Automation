import { motion } from 'framer-motion';
import { BrainCircuit, MessagesSquare, GitMerge, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'lead-scoring',
    icon: BrainCircuit,
    iconColor: '#3B82F6',
    iconBg: 'rgba(59,130,246,0.1)',
    badge: 'LLM-Powered',
    badgeColor: '#3B82F6',
    title: 'Intelligent Lead Scoring',
    description:
      'Deploy large language models that analyze inbound leads in real-time — evaluating intent signals, firmographic data, and engagement patterns to surface your highest-value prospects instantly.',
    points: ['Real-time prospect qualification', 'GPT-4 intent analysis', 'Auto-priority routing'],
  },
  {
    id: 'multi-channel',
    icon: MessagesSquare,
    iconColor: '#10B981',
    iconBg: 'rgba(16,185,129,0.1)',
    badge: 'Email + Telegram',
    badgeColor: '#10B981',
    title: 'Multi-Channel Nurturing',
    description:
      'Orchestrate fully automated follow-up sequences across Email and Telegram. Context-aware messaging adapts to each prospect\'s stage, ensuring the right message lands at the perfect moment.',
    points: ['AI-written follow-ups', 'Telegram bot integration', 'Drip sequence automation'],
  },
  {
    id: 'enterprise-sync',
    icon: GitMerge,
    iconColor: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.1)',
    badge: 'n8n Orchestration',
    badgeColor: '#A78BFA',
    title: 'Enterprise Workflow Sync',
    description:
      'Bridge your React frontends directly to Google Sheets, HubSpot, and custom CRM backends via n8n. Eliminate data silos and create a single source of truth across your entire growth stack.',
    points: ['React → Google Sheets sync', 'CRM pipeline automation', 'No-code n8n workflows'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)',
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
            style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}
          >
            WHAT WE BUILD
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            AI Solutions That Drive{' '}
            <span className="gradient-text">Real Revenue</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Every service is engineered end-to-end — from data ingestion to automated action.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.id}
                id={`service-card-${svc.id}`}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glass rounded-2xl p-6 lg:p-8 flex flex-col gap-5 group cursor-default"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: svc.iconBg }}
                >
                  <Icon size={24} style={{ color: svc.iconColor }} />
                </div>

                {/* Badge */}
                <span
                  className="self-start text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${svc.badgeColor}18`, color: svc.badgeColor }}
                >
                  {svc.badge}
                </span>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                    {svc.description}
                  </p>
                </div>

                {/* Points */}
                <ul className="flex flex-col gap-2 mt-auto">
                  {svc.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: svc.iconColor }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Hover arrow */}
                <div
                  className="flex items-center gap-1 text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: svc.iconColor }}
                >
                  Learn more <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
