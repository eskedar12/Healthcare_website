import HeroSection from '../components/home/HeroSection'
import StatsBar from '../components/home/StatsBar'
import AboutSection from '../components/home/AboutSection'
import ServicesSection from '../components/home/ServicesSection'
import DoctorsSection from '../components/home/DoctorsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import FAQSection from '../components/home/FAQSection'
import TrustedBySection from '../components/home/TrustedBySection'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <TestimonialsSection />
      <FAQSection />
      <TrustedBySection />
    </>
  )
}

export default HomePage
