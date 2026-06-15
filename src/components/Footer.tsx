import { Phone, MapPin, Facebook, Instagram, LocateFixed } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="md:col-span-2 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
             <div className="mb-6">
                <span className="text-2xl font-extrabold text-white tracking-tight">Vrudheshwar</span><br/>
                <span className="text-sm font-semibold tracking-widest text-red-500 uppercase">Tractors</span>
             </div>
             <p className="text-slate-400 mb-6 leading-relaxed">
               Authorised dealer for Massey Ferguson and TAFE. Committed to serving the farming community in Maharashtra with excellence.
             </p>
             <div className="flex justify-center md:justify-start gap-4">
               <a href="https://www.facebook.com/share/18yqYRWC8L/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
               </a>
               <a href="https://www.instagram.com/vrudheshwar_tractors?igsh=bTJnbHg2YWs3MWJl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
               </a>
               <a href="https://www.google.com/maps/search/?api=1&query=Vrudheshwar+Tractors+Shevgaon" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <LocateFixed className="w-5 h-5" />
               </a>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left text-center md:text-left">
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Branch 1: Shevgaon (शेवगाव)</h4>
             <a href="https://www.google.com/maps/search/?api=1&query=Vrudheshwar+Tractors+Shevgaon" target="_blank" rel="noopener noreferrer" className="flex items-start justify-center md:justify-start gap-3 mb-4 group text-center md:text-left">
               <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
               <p className="text-slate-400 group-hover:text-white transition-colors">Near Bade Hospital,<br />Nevasa Road, Shevgaon</p>
             </a>
             <div className="flex flex-col gap-2 items-center md:items-start">
               <div className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <a href="tel:+919764979696" className="text-slate-400 hover:text-white">+91 9764979696</a>
               </div>
               <div className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <a href="tel:+917020889300" className="text-slate-400 hover:text-white">+91 7020889300</a>
               </div>
               <div className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <a href="tel:+919763994598" className="text-slate-400 hover:text-white">+91 9763994598</a>
               </div>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Branch 2: Pathardi (पाथर्डी)</h4>
             <a href="https://www.google.com/maps/search/?api=1&query=Vrudheshwar+Tractors+Pathardi" target="_blank" rel="noopener noreferrer" className="flex items-start justify-center md:justify-start gap-3 mb-4 group text-center md:text-left">
               <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
               <p className="text-slate-400 group-hover:text-white transition-colors">Opp. Bharat Petrol Pump,<br />Koradgaon Road, Pathardi</p>
             </a>
             <div className="flex flex-col gap-2 items-center md:items-start">
               <div className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <a href="tel:+918668400550" className="text-slate-400 hover:text-white">+91 8668400550</a>
               </div>
               <div className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <a href="tel:+917020889300" className="text-slate-400 hover:text-white">+91 7020889300</a>
               </div>
             </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 flex items-center gap-2">
            &copy; {new Date().getFullYear()} Vrudheshwar Tractors. All rights reserved. 
            <a href="/admin" className="text-slate-700 hover:text-red-500 transition-colors" title="Admin Login" aria-label="Admin Login">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </a>
          </p>
          <p className="text-sm text-slate-500">
            Contact Person: <strong className="text-slate-300">Tushar Avhad</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
