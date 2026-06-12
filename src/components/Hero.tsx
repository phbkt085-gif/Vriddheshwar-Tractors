import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageHelper from './ImageHelper';

interface HeroProps {
  onEnquire?: () => void;
}

export default function Hero({ onEnquire }: HeroProps) {
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1592982537447-6f296cb34220?q=80&w=2070&auto=format&fit=crop');

  useEffect(() => {
    async function fetchHeroImage() {
      if (!supabase) return;
      const { data } = await supabase.storage.from('public-images').list('hero');
      if (data && data.length > 0) {
        const validFiles = data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder');
        if (validFiles.length > 0) {
          validFiles.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          setHeroImage(`${supabaseUrl}/storage/v1/object/public/public-images/hero/${validFiles[0].name}`);
        }
      }
    }
    fetchHeroImage();
  }, []);

  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-screen flex items-center pt-24 lg:pt-32 pb-12 lg:pb-24 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0" />
      
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          <div className="max-w-3xl text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                Massey Ferguson & TAFE Authorized Dealer
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              मॅसी फर्ग्युसन: <br/>
              <span className="text-red-600">
                शेतकऱ्यांचा खरा साथीदार
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-400 font-medium mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Power, Reliability, and the Legacy of Massey Ferguson. Experience unmatched agricultural excellence with Vrudheshwar Tractors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#models" 
                className="px-8 py-4.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-lg font-black text-center transition-all shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] active:scale-95"
              >
                View Tractors / ट्रॅक्टर पहा
              </a>
              <button 
                onClick={onEnquire}
                className="px-8 py-4.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl text-lg font-black backdrop-blur-md text-center transition-all active:scale-95"
              >
                Book a Test Drive
              </button>
            </div>
          </div>
          
          <div className="relative w-full h-[280px] sm:h-[450px] lg:h-[500px] xl:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group order-1 lg:order-2 mt-4 lg:mt-0">
            <ImageHelper 
              src={heroImage} 
              alt="Tractor in field hero" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[20s] ease-linear"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
          
        </div>
      </div>
    </section>
  );
}
