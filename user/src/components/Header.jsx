import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group" aria-label="Aura Automations Home">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }}>
                <Zap size={20} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-lg tracking-tight">Aura</span>
              <span className="text-xs font-medium" style={{ color: '#10B981' }}>Automations</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3B82F6, #10B981)' }} />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, '#contact')}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
            id="header-cta"
          >
            <Zap size={15} />
            Get Started
          </a>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden glass border-t border-slate-700"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNav(e, '#contact')}
                className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
              >
                Get Started
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
