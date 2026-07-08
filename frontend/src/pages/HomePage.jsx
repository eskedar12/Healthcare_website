import HeroSection from '../components/home/HeroSection'
import StatsBar from '../components/home/StatsBar'
import AboutSection from '../components/home/AboutSection'
import ServicesSection from '../components/home/ServicesSection'
import DoctorsSection from '../components/home/DoctorsSection'
import TrustedBySection from '../components/home/TrustedBySection'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <TrustedBySection />
    </>
  )
}

export default HomePage