import type { Metadata } from 'next'

const faqItems = [
  {
    question: 'Are the rates on this website final retail prices?',
    answer:
      'No. The rates shown on GoldRateIndia.live are indicative benchmark-style prices meant to help users track market movement. Final retail prices can include making charges, GST, wastage assumptions, and adjustments for stones or design complexity.',
  },
  {
    question: 'Why do gold rates vary by city?',
    answer:
      'Cities usually follow the same broad bullion trend, but local premiums can differ because of logistics, inventory conditions, demand patterns, and retailer competition.',
  },
  {
    question: 'What is the difference between 22K and 24K gold?',
    answer:
      'Twenty-four karat gold is purer and usually better suited to bars and coins. Twenty-two karat is slightly less pure but stronger, making it more practical for most jewellery.',
  },
  {
    question: 'How can I verify gold purity before buying?',
    answer:
      'Check for hallmark information, confirm the karat, review the invoice carefully, and ask the jeweller to explain net gold weight, making charges, and any non-gold components in writing.',
  },
  {
    question: 'Why should I compare more than one jeweller?',
    answer:
      'Because the day’s metal rate may be similar across stores while billing structure differs sharply. Comparing invoices often reveals differences in making charges, labour pricing, and stone-related billing.',
  },
]

export const metadata: Metadata = {
  title: 'FAQ — Gold Rate India',
  description: 'Answers to common questions about gold rates in India, purity, city pricing, and jewellery bills.',
}

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <p className="blog-eyebrow">FAQ</p>
        <h1>Frequently asked questions about gold rates</h1>
        <p>
          These answers are written for everyday buyers who want practical clarity before purchasing jewellery, coins, or bars.
          We focus on the questions that usually affect real money decisions.
        </p>

        {faqItems.map((item) => (
          <div key={item.question} className="faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}
      </main>
    </div>
  )
}
