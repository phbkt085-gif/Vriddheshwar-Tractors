import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ImageHelper from './ImageHelper';
import { supabase } from '../lib/supabase';

export default function About() {
  const [aboutImage, setAboutImage] = useState<string>('/images/dealership-about.jpg');

  useEffect(() => {
    async function loadImage() {
      if (!supabase) return;
      const { data } = await supabase.storage.from('public-images').list('about');
      if (data && data.length > 0) {
        const validFiles = data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder');
        if (validFiles.length > 0) {
          // Sort files to get the newest one based on created_at
          validFiles.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          // Just grab the first uploaded image in the 'about' section
          setAboutImage(`${supabaseUrl}/storage/v1/object/public/public-images/about/${validFiles[0].name}`);
        }
      }
    }
    loadImage();
  }, []);

  const points = [
    "Authorized Massey Ferguson & TAFE Dealer",
    "100% Genuine Spare Parts Guaranteed",
    "Expert Mechanics & Express Service",
    "Easy Finance Options Available"
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          <div className="lg:col-span-6 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-sm font-black text-red-600 tracking-[0.2em] uppercase mb-4">Our Legacy</h2>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
              Vrudheshwar Tractors
            </h3>
            <h4 className="text-2xl font-bold text-slate-500 mb-8 font-serif leading-none italic">वृद्धेश्वर ट्रॅक्टर्स</h4>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              As a premier authorized dealer for Massey Ferguson and TAFE, we are dedicated to empowering the agricultural community of Maharashtra. We provide top-tier machinery, transparent deals, and robust after-sales support.
            </p>
            
            <div className="space-y-4 mb-12 max-w-xl mx-auto lg:mx-0">
              {points.map((point, index) => (
                <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-red-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <span className="text-slate-800 font-bold text-left text-sm md:text-base">{point}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="text-4xl font-black text-red-600">2</div>
                <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mega Branches</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="text-4xl font-black text-red-600">100%</div>
                <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust & Value</div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:col-span-6 order-1 lg:order-2 px-4 sm:px-0">
            <div className="absolute inset-0 md:-inset-4 bg-red-600 opacity-[0.03] rounded-[2rem] md:rounded-[3rem] md:rotate-3 z-0"></div>
            <div className="relative z-10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-slate-100">
              <ImageHelper 
                src={aboutImage} 
                alt="Vrudheshwar Tractors Dealership" 
                className="w-full h-[250px] sm:h-[450px] md:h-[600px] object-cover object-center"
              />
            </div>
            
            <div className="absolute -bottom-4 right-4 md:-bottom-8 md:-right-8 bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl z-20 border border-slate-100 max-w-[170px] md:max-w-[240px]">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
                  <span className="text-white font-black text-xs md:text-xl text-center leading-tight">MF<br/><span className="text-[7px] md:text-[10px] tracking-tighter">TAFE</span></span>
                </div>
                <div>
                  <div className="text-xs md:text-lg font-black text-slate-900 leading-none">Official</div>
                  <div className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

