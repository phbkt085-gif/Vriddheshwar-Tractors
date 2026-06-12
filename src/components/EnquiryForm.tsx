import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface EnquiryFormProps {
  initialModel?: string;
  initialMessage?: string;
}

export default function EnquiryForm({ initialModel, initialMessage }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    model: initialModel || '',
    message: initialMessage || ''
  });

  React.useEffect(() => {
    if (initialModel || initialMessage) {
      setFormData(prev => ({ 
        ...prev, 
        model: initialModel || prev.model,
        message: initialMessage || prev.message
      }));
    }
  }, [initialModel, initialMessage]);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit enquiry');
      }

      setStatus('success');
      setFormData({ name: '', phone: '', model: '', message: '' });
      
      // Reset success status after a delay
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <section id="enquiry" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-[800px] h-[800px] bg-red-600 rounded-full -top-96 -right-96 blur-[120px]"></div>
        <div className="absolute w-[600px] h-[600px] bg-slate-800 rounded-full -bottom-48 -left-48 blur-[100px]"></div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row">
          
          <div className="lg:w-5/12 bg-slate-900 p-10 lg:p-20 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
               <Loader2 className="w-64 h-64 animate-[spin_20s_linear_infinite]" />
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight relative z-10">
              Ready to <br/>
              <span className="text-red-600">upgrade</span> <br/>
              your farm?
            </h3>
            <p className="text-slate-400 mb-12 text-lg font-medium relative z-10">
              Book a test drive or request a callback to learn more about our tractors. Our experts are standing by.
            </p>
            
            <div className="space-y-8 relative z-10">
              {[
                { title: "Expert Guide", desc: "Right tractor for your land" },
                { title: "Test Drive", desc: "Feel the massive power" },
                { title: "Easy Pay", desc: "Finance & Spot approvals" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-red-600 transition-colors">
                    <span className="text-red-600 font-black text-xl">{i + 1}</span>
                  </div>
                  <div>
                    <h5 className="font-black text-lg leading-none mb-1">{item.title}</h5>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-7/12 p-10 lg:p-20">
            <h4 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Direct Enquiry</h4>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="phone" className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>
 
              <div className="space-y-3">
                <label htmlFor="model" className="text-xs font-black text-slate-400 uppercase tracking-widest">Interested Model</label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select a model...</option>
                  <option value="MF 241 PD">MF 241 PD 4WD (42 HP)</option>
                  <option value="TAFE 30 DI">TAFE 30 DI Orchard Plus (30 HP)</option>
                  <option value="MF 6028">MF 6028 Maxpro (28 HP)</option>
                  <option value="Massey Dynatrack">Massey Dynatrack Series</option>
                  <option value="MF 7250">MF 7250 PowerUp (50 HP)</option>
                  <option value="MF 9500">MF 9500 (50 HP)</option>
                  <option value="MF 5118">MF 5118 4WD (20 HP)</option>
                  <option value="Other">Other / Not sure</option>
                </select>
              </div>
 
              <div className="space-y-3">
                <label htmlFor="message" className="text-xs font-black text-slate-400 uppercase tracking-widest">Additional Notes</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-bold resize-none placeholder:text-slate-300"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>
 
              {status === 'success' && (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-[2rem] flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <p className="text-green-900 font-bold">Successfully sent! We'll call you back shortly.</p>
                </div>
              )}
 
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-5 bg-red-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:grayscale"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Submit Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
