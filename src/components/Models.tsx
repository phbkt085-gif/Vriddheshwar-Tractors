import { useState, useEffect } from 'react';
import ImageHelper from './ImageHelper';
import { supabase } from '../lib/supabase';

export const initialTractors = [
  { id: 1, name: 'MF 241 PD 4WD', hp: '42 HP', feature: 'Unmatched traction and durability', marathi: 'अप्रतिम ट्रॅक्शन आणि टिकाऊपणा', img: '/src/assets/images/mf_241_pd_4wd_1781420204615.jpg' },
  { id: 2, name: 'TAFE 30 DI Orchard Plus', hp: '30 HP', feature: 'Perfect for orchard farming', marathi: 'फळबागांसाठी एकदम उत्तम', img: '/src/assets/images/tafe_30_di_orchard_1781420223171.jpg' },
  { id: 3, name: 'MF 6028 Maxpro', hp: '28 HP', feature: 'Compact yet powerful', marathi: 'कॉम्पॅक्ट पण शक्तिशाली', img: '/src/assets/images/mf_6028_maxpro_1781420238675.jpg' },
  { id: 4, name: 'MF 6026 Maxpro', hp: '26 HP', feature: 'Powerful and reliable performance', marathi: 'शक्तिशाली आणि विश्वासार्ह कामगिरी', img: '/src/assets/images/mf_6026_maxpro_1781416335576.jpg' },
  { id: 5, name: 'MF 7250 PowerUp', hp: '50 HP', feature: 'Heavy-duty performance', marathi: 'दमदार हेवी-ड्यूटी कामगिरी', img: '/src/assets/images/mf_7250_powerup_1781420256417.jpg' },
  { id: 6, name: 'MF 9500 Eco', hp: '50 HP', feature: 'Smart series for smart farmers', marathi: 'स्मार्ट शेतकऱ्यांसाठी स्मार्ट मालिका', img: '/src/assets/images/mf_9500_eco_1781420273457.jpg' },
  { id: 7, name: 'MF 5118 4WD', hp: '20 HP', feature: 'Efficient mini tractor', marathi: 'कार्यक्षम मिनी ट्रॅक्टर', img: '/src/assets/images/mf_5118_4wd_1781420290161.jpg' },
  { id: 8, name: 'MF 5225 DI', hp: '25 HP', feature: 'Best option for versatile farming', marathi: 'बहुमुखी शेतीसाठी उत्तम पर्याय', img: '/src/assets/images/mf_5225_di_1781416353233.jpg' },
  { id: 9, name: 'MF 7235 DI', hp: '35 HP', feature: 'Equipped with advanced technology', marathi: 'प्रगत तंत्रज्ञानाने सज्ज', img: '/src/assets/images/mf_7235_di_1781416366866.jpg' },
  { id: 10, name: '246 Massey Dynatrack', hp: '46 HP', feature: 'Smart tractor for precision farming', marathi: 'अचूक शेतीसाठी स्मार्ट ट्रॅक्टर', img: '/src/assets/images/mf_246_dynasmart_1781416379804.jpg' },
  { id: 11, name: 'MF 254 Massey Dynatrack', hp: '50 HP', feature: 'Versatile and efficient power', marathi: 'अष्टपैलू आणि कार्यक्षम शक्ती', img: '/src/assets/images/mf_254_dynasmart_1781416393710.jpg' },
  { id: 12, name: '254 Massey Dynatrack Super Stork', hp: '50 HP', feature: 'Ultimate power and performance', marathi: 'अंतिम शक्ती आणि कार्यक्षमता', img: '/src/assets/images/mf_254_super_stork_1781417732451.jpg' },
  { id: 13, name: 'MF 7250 DI Challenger', hp: '50 HP', feature: 'Ready for challenging terrains', marathi: 'आव्हानात्मक क्षेत्रांसाठी सज्ज', img: '/src/assets/images/mf_7250_challenger_1781416406643.jpg' },
  { id: 14, name: 'MF 8055 Boss', hp: '50 HP', feature: 'Truly the boss of the field', marathi: 'शेतीचा खऱ्या अर्थाने बॉस', img: '/src/assets/images/mf_8055_boss_1781416422305.jpg' },
  { id: 15, name: 'MF 9563', hp: '60 HP', feature: 'Big power for massive challenges', marathi: 'मोठ्या आव्हानांसाठी मोठी शक्ती', img: '/src/assets/images/mf_9563_tractor_1781416436026.jpg' },
];

interface ModelsProps {
  onEnquire?: (modelName: string) => void;
}

export default function Models({ onEnquire }: ModelsProps) {
  const [tractors] = useState(initialTractors);

  const handleEnquire = (modelName: string) => {
    if (onEnquire) {
      onEnquire(modelName);
    }
  };

  return (
    <section id="models" className="py-20 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black text-red-600 tracking-[0.3em] uppercase mb-4">Our Fleet</h2>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
            Featured Models
          </h3>
          <p className="text-xl text-slate-500 mb-2 font-bold italic">प्रमुख ट्रॅक्टर मॉडेल्स</p>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">Explore our powerful lineup of Massey Ferguson and TAFE tractors designed to conquer any field.</p>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {tractors.map((tractor) => (
            <div key={tractor.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)] transition-all duration-500 border border-slate-100 group">
              <div className="relative h-64 overflow-hidden bg-slate-50">
                <div className="absolute top-5 right-5 z-20 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
                  {tractor.hp}
                </div>
                <ImageHelper 
                  src={tractor.img} 
                  alt={tractor.name} 
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">{tractor.name}</h4>
                <div className="space-y-1 mb-8">
                  <p className="text-sm font-bold text-slate-500">{tractor.feature}</p>
                  <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">{tractor.marathi}</p>
                </div>
                <button 
                  onClick={() => handleEnquire(tractor.name)}
                  className="w-full py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-slate-900/10"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-red-600/20 sm:col-span-1 lg:col-span-1 xl:col-span-1 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
             <h4 className="text-3xl font-black text-white mb-3 relative z-10 leading-none">Custom<br/>Solutions</h4>
             <p className="text-red-100 font-medium mb-8 relative z-10">Looking for something specific? Our team is here to help.</p>
             <a href="#enquiry" className="px-8 py-4 bg-white text-red-600 font-black rounded-2xl hover:scale-105 transition-transform w-full relative z-10 shadow-xl">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
