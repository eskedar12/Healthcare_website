import { useState } from 'react'
import SectionLabel from '../ui/SectionLabel'
import SectionTitle from '../ui/SectionTitle'
import useFetch from '../../hooks/useFetch'
import FAQS from '../../data/faqs'

const FAQItem = ({ faq, open, onToggle }) => (
  <div className="border-b border-cream-darker">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-6 py-6 text-left"
      aria-expanded={open}
    >
      <span className="font-serif text-text-dark text-lg lg:text-xl">
        {faq.question}
      </span>
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full border border-forest/30 flex items-center justify-center text-forest transition-transform duration-300 ${
          open ? 'rotate-45' : ''
        }`}
      >
        +
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        open ? 'max-h-60 pb-6' : 'max-h-0'
      }`}
    >
      <p className="font-sans text-sm text-text-body leading-relaxed max-w-2xl">
        {faq.answer}
      </p>
    </div>
  </div>
)

const FAQSection = () => {
  const { data } = useFetch('/content/home')
  const faqs = data?.data?.faqs?.length ? data.data.faqs : FAQS
  const [openId, setOpenId] = useState(faqs[0]?.id)

  return (
    <section className="bg-cream-dark py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Frequently asked questions</SectionTitle>
        </div>

        <div>
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              open={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
