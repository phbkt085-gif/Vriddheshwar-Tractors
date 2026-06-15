import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ChevronRight, LogOut } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { name: 'Home', label: 'मुखपृष्ठ', href: '#home' },
    { name: 'Models', label: 'मॉडेल्स', href: '#models' },
    { name: 'Deliveries', label: 'वितरण', href: '#deliveries' },
    { name: 'Facilities', label: 'शोरूम', href: '#facilities' },
    { name: 'Services', label: 'सेवा', href: '#services' },
    { name: 'Enquiry', label: 'चौकशी', href: '#enquiry' },
  ];

  return (
    <>
      <nav className={`fixed top-0 z-[40] w-full transition-all duration-500 ${isScrolled ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] py-2' : 'bg-white/80 backdrop-blur-xl py-3 md:py-5'}`}>
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14">
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
              href="tel:+919764979696"
              className="px-8 py-3.5 bg-red-600 hover:bg-slate-900 text-white rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(220,38,38,0.3)] transition-all flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Sales</span>
            </a>
          </div>
 
          {/* Mobile Menu Button & Call */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+919764979696"
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
    </nav>

    {/* Mobile Sidebar Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`lg:hidden fixed inset-y-0 right-0 w-[72vw] sm:w-[300px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="pt-8 px-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="inline-flex items-center gap-3 relative pb-2 border-b-[3px] border-red-700 pr-4">
              <div className="w-10 h-10 bg-[#0f172a] rounded flex items-center justify-center border border-slate-700 shadow-sm">
                 <span className="text-amber-500 font-bold text-lg leading-none mt-0.5">VT</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-slate-900 leading-none">VRUDHESHWAR</span>
                <span className="text-[12px] font-semibold text-slate-500 leading-tight mt-0.5">Tractors</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 -mt-1 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 px-0 scrollbar-hide">
          {links.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              className={`block w-full py-3 text-center border-b border-slate-100 text-slate-600 hover:text-red-700 hover:bg-slate-50 transition-all ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
              style={{ transitionDelay: `${100 + i * 50}ms` }}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-[15px] font-medium tracking-wide">{link.name}</span>
            </a>
          ))}
        </div>

        <div className={`p-6 mt-auto space-y-3 bg-white/90 backdrop-blur-sm border-t border-slate-50 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all`} style={{ transitionDelay: '350ms' }}>
          <a
            href="tel:+919764979696"
            className="w-full flex items-center justify-center py-3.5 px-4 bg-[#b91c1c] hover:bg-red-800 text-white rounded-md font-medium shadow-sm transition-all text-[15px]"
          >
            Call Sales
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-all text-[15px]"
          >
            <LogOut className="w-[18px] h-[18px] text-slate-500" />
            <span>Close Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
