import { useState, useEffect } from 'react';
import ImageHelper from './ImageHelper';
import { supabase } from '../lib/supabase';

export default function Deliveries() {
  const [images, setImages] = useState<string[]>([]);
  const fallbackImages = Array.from({ length: 8 }, (_, i) => `/images/delivery-${i + 1}.jpg`);

  useEffect(() => {
    async function loadImages() {
      if (!supabase) {
        setImages(fallbackImages);
        return;
      }
      const { data } = await supabase.storage.from('public-images').list('deliveries');
      if (data && data.length > 0) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        // Filter out empty folder placeholder and map to public URLs
        const validFiles = data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder');
        if (validFiles.length > 0) {
           validFiles.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
           const urls = validFiles.map(f => `${supabaseUrl}/storage/v1/object/public/public-images/deliveries/${f.name}`);
           const combined = [...urls, ...fallbackImages].slice(0, 8);
           setImages(combined);
           return;
        }
      }
      setImages(fallbackImages);
    }
    loadImages();
  }, []);

  return (
    <section id="deliveries" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black text-red-600 tracking-[0.3em] uppercase mb-4">Happy Customers</h2>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
            Massey Family
          </h3>
          <p className="text-xl font-bold text-slate-500 mb-6 italic">मॅसी परिवारात आपले स्वागत आहे!</p>
          <p className="text-slate-400 font-medium">Celebrating the joy of new beginnings with our proud farmers.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((src, index) => (
            <div key={index} className="group relative rounded-[2rem] overflow-hidden aspect-square shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500">
              <ImageHelper 
                src={src} 
                alt={`Happy Customer Delivery ${index + 1}`} 
                className="w-full h-full transform group-hover:scale-110 transition-transform duration-[10s]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                <div className="p-6 w-full">
                  <p className="text-white font-black text-xs uppercase tracking-widest drop-shadow-md">Massey Pride</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <a href="#enquiry" className="inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-slate-900 hover:bg-red-600 rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-95">
              Start Your Journey Today
            </a>
        </div>
      </div>
    </section>
  );
}
