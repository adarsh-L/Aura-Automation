import { Zap, MapPin, Mail, Code2, MessageCircle, Users } from 'lucide-react';

const footerLinks = {
  Services: ['AI Automation', 'Lead Scoring', 'Workflow Sync', 'Chatbot Deployment'],
  Company: ['About Us', 'Case Studies', 'Careers', 'Blog'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="relative border-t" style={{ borderColor: 'rgba(51,65,85,0.5)', background: 'rgba(15,23,42,0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }}>
                <Zap size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg">Aura</span>
                <span className="text-xs font-medium" style={{ color: '#10B981' }}>Automations</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#64748B' }}>
              Building the autonomous infrastructure that powers the next generation of data-driven businesses.
            </p>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
              <MapPin size={13} style={{ color: '#10B981' }} />
              Bengaluru, Karnataka, India
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
              <Mail size={13} style={{ color: '#3B82F6' }} />
              <a href="mailto:hello@yourdomain.com" className="hover:text-slate-300 transition-colors">
                hello@yourdomain.com
              </a>
            </div>
            {/* Socials */}
            <div className="flex gap-3 mt-2">
              {[
                { Icon: Code2, href: '#', label: 'GitHub' },
                { Icon: MessageCircle, href: '#', label: 'Twitter' },
                { Icon: Users, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 hover:border-blue-500 hover:text-blue-400"
                  style={{ borderColor: 'rgba(51,65,85,0.8)', color: '#475569' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#3B82F6' }}>
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors hover:text-white"
                      style={{ color: '#64748B' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'rgba(51,65,85,0.4)', color: '#334155' }}>
          <span>© {new Date().getFullYear()} Aura Automations. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Engineered in <span style={{ color: '#10B981' }}>Bengaluru</span> with
            <span style={{ color: '#EF4444' }}>♥</span> & AI
          </span>
        </div>
      </div>
    </footer>
  );
}
