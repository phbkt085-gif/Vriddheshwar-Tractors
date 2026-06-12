import { Tractor, Wrench, PackageSearch } from 'lucide-react';

interface ServicesProps {
  onServiceSelect?: (serviceId: string) => void;
}

export default function Services({ onServiceSelect }: ServicesProps) {
  const services = [
    {
      id: 'sales',
      title: 'Sales',
      marathi: 'सेल्स',
      desc: 'Expert guidance to choose the right Massey Ferguson or TAFE tractor for your specific farming needs with easy finance options.',
      icon: Tractor,
      color: 'bg-red-50 text-red-600 border-red-100',
    },
    {
      id: 'service',
      title: 'Service',
      marathi: 'सर्व्हिस',
      desc: 'Skilled technicians and automated workshops ensuring minimum downtime and maximum performance for your equipment.',
      icon: Wrench,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'spares',
      title: 'Spares',
      marathi: 'स्पेअर्स',
      desc: '100% genuine spare parts and lubricants readily available over the counter to maintain your tractor\'s longevity.',
      icon: PackageSearch,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black text-red-600 tracking-[0.3em] uppercase mb-4">Total Support</h2>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
            Our Services
          </h3>
          <p className="text-2xl font-bold text-slate-500 mb-6 italic">सेल्स | सर्व्हिस | स्पेअर्स</p>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">We build lifelong partnerships with our farmers through unparalleled post-purchase support.</p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((svc) => (
            <div 
              key={svc.id} 
              onClick={() => onServiceSelect?.(svc.id)}
              className="bg-slate-50 rounded-[2.5rem] p-10 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 border-2 ${svc.color} transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                <svc.icon className="w-10 h-10" />
              </div>
              <h4 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{svc.title}</h4>
              <p className="text-lg font-bold text-slate-400 mb-6 uppercase tracking-widest leading-none">{svc.marathi}</p>
              <p className="text-slate-600 leading-relaxed font-medium text-lg mb-10">{svc.desc}</p>
              
              <div className="flex items-center gap-3 text-red-600 font-black group-hover:gap-5 transition-all text-sm uppercase tracking-[0.2em]">
                <span>Discover More</span>
                <span className="text-xl">→</span>
              </div>
 
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                 <svc.icon className="w-64 h-64" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
