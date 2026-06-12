import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Models from '../components/Models';
import Deliveries from '../components/Deliveries';
import Facilities from '../components/Facilities';
import Services from '../components/Services';
import EnquiryForm from '../components/EnquiryForm';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  const [selectedMessage, setSelectedMessage] = useState<string | undefined>(undefined);

  const handleEnquire = (modelName: string) => {
    // Map the full tractor name to the internal option values if needed
    // The dropdown in EnquiryForm has slightly shorter names for some, but selecting by name works too
    
    // Simple mapping to match the <select> options if they are different
    let value = modelName;
    if (modelName.includes('MF 241')) value = 'MF 241 PD';
    if (modelName.includes('TAFE 30')) value = 'TAFE 30 DI';
    if (modelName.includes('MF 6028')) value = 'MF 6028';
    if (modelName.includes('MF 7250')) value = 'MF 7250';
    if (modelName.includes('MF 9500')) value = 'MF 9500';
    if (modelName.includes('MF 5118')) value = 'MF 5118';
    
    setSelectedModel(value);
    setSelectedMessage(`I am interested in the ${modelName} model.`);
    
    // Scroll to the enquiry section
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServiceSelect = (serviceId: string) => {
    const serviceName = serviceId.charAt(0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              .toUpperCase() + serviceId.slice(1);
    setSelectedMessage(`I am interested in your ${serviceName} services. Please contact me with more details.`);
    setSelectedModel(undefined); // Reset model if selecting a general service
    
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth">
      <Navbar />
      <main>
        <Hero onEnquire={() => {
          setSelectedMessage("I would like to book a test drive.");
          document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <About />
        <Models onEnquire={handleEnquire} />
        <Facilities />
        <Services onServiceSelect={handleServiceSelect} />
        <Deliveries />
        <EnquiryForm initialModel={selectedModel} initialMessage={selectedMessage} />
      </main>
      <Footer />
    </div>
  );
}
