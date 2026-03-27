import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Audience from '../components/landing/Audience';
import CTA from '../components/landing/CTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <div className="border-t border-[#111827]" />
        <HowItWorks />
        <div className="border-t border-[#111827]" />
        <Audience />
        <div className="border-t border-[#111827]" />
        <CTA />
      </main>
    </div>
  );
}
