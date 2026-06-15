import { useState, useEffect } from 'react';
import ImageHelper from './ImageHelper';
import { MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const initialFacilities = [
  { name: 'Shevgaon Showroom', desc: 'State-of-the-art display', img: '/images/showroom-shevgaon.jpg' },
  { name: 'Pathardi Showroom', desc: 'Wide range available', img: '/images/showroom-pathardi.jpg' },
  { name: 'Modern Workshop', desc: 'Expert maintenance & repairs', img: '/images/workshop.jpg' },
  { name: 'Spares Counter', desc: '100% Genuine TAFE/Massey parts', img: '/images/spares-counter.jpg' },
];

export default function Facilities() {
  const [facilities, setFacilities] = useState(initialFacilities);

  useEffect(() => {
    async function loadImages() {
      if (!supabase) return;
      const { data } = await supabase.storage.from('public-images').list('facilities');
      if (data && data.length > 0) {
        const validFiles = data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder');
        if (validFiles.length > 0) {
          // Sort files to get the newest ones based on created_at
          validFiles.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          
          setFacilities(prev => {
            const newFacilities = [...prev];
            // Overwrite images based on order uploaded
            validFiles.forEach((file, idx) => {
              if (idx < newFacilities.length) {
                newFacilities[idx].img = `${supabaseUrl}/storage/v1/object/public/public-images/facilities/${file.name}`;
              }
            });
            return newFacilities;
          });
        }
      }
    }
    loadImages();
  }, []);

  return (
    <section id="facilities" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <h2 className="text-xs font-black text-red-500 tracking-[0.3em] uppercase mb-4">Infrastructure</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
              Official Hubs
            </h3>
            <p className="text-2xl font-bold text-slate-500 mb-6 italic">आमचे शोरूम आणि वर्कशॉप</p>
            <p className="text-slate-400 font-medium text-lg lg:max-w-xl">
              Visit our highly equipped facilities designed for a premium buying experience and reliable after-sales service.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-2">
             <a href="https://www.google.com/maps/search/?api=1&query=Vrudheshwar+Tractors+Shevgaon" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-black text-white bg-white/5 px-6 py-3 rounded-2xl border border-white/10 uppercase tracking-widest hover:bg-white/10 hover:border-red-600 transition-all group">
                <MapPin className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" /> Shevgaon
             </a>
             <a href="https://www.google.com/maps/search/?api=1&query=Vrudheshwar+Tractors+Pathardi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-black text-white bg-white/5 px-6 py-3 rounded-2xl border border-white/10 uppercase tracking-widest hover:bg-white/10 hover:border-red-600 transition-all group">
                <MapPin className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" /> Pathardi
             </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {facilities.map((facility, index) => (
            <div key={index} className="group relative rounded-[2.5rem] overflow-hidden aspect-video bg-slate-800 border border-slate-800 shadow-2xl">
              <ImageHelper 
                src={facility.img} 
                alt={facility.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[10s]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                <h4 className="text-3xl font-black text-white mb-1 tracking-tight leading-none">{facility.name}</h4>
                <p className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">{facility.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
