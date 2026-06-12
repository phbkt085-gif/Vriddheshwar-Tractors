import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', label: 'मुखपृष्ठ', href: '#home' },
    { name: 'Models', label: 'मॉडेल्स', href: '#models' },
    { name: 'Deliveries', label: 'वितरण', href: '#deliveries' },
    { name: 'Facilities', label: 'शोरूम', href: '#facilities' },
    { name: 'Services', label: 'सेवा', href: '#services' },
    { name: 'Enquiry', label: 'चौकशी', href: '#enquiry' },
  ];

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] py-2' : 'bg-white/80 backdrop-blur-xl py-3 md:py-5'}`}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#home" className="flex flex-col group">
              <span className="text-2xl md:text-3xl font-black text-red-600 tracking-tight leading-none group-hover:text-slate-900 transition-colors">Vrudheshwar</span>
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-slate-400 uppercase mt-1">Tractors</span>
            </a>
          </div>
 
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="group flex flex-col items-center relative py-2">
                <span className="text-sm font-black text-slate-800 group-hover:text-red-600 transition-colors tracking-tight">{link.name}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <a
              href="tel:+919545886257"
              className="px-8 py-3.5 bg-red-600 hover:bg-slate-900 text-white rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(220,38,38,0.3)] transition-all flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Sales</span>
            </a>
          </div>
 
          {/* Mobile Menu Button & Call */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+919545886257"
              className="p-3.5 bg-red-600 text-white rounded-2xl shadow-lg active:scale-90 transition-transform"
              aria-label="Call Now"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3.5 text-slate-900 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-red-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 top-[88px] bg-white/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="p-8 space-y-4">
          {links.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 hover:bg-red-50 transition-all group ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{link.name}</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{link.label}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
            </a>
          ))}
          
          <div className={`pt-6 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all`} style={{ transitionDelay: '350ms' }}>
            <a
              href="tel:+919545886257"
              className="w-full flex items-center justify-center gap-4 p-6 bg-slate-900 text-white rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-transform"
            >
              <PhoneCall className="w-6 h-6" />
              <span className="text-xl">Book via Call</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
