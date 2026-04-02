import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Gold Rate India',
  description: 'Contact GoldRateIndia.live for corrections, advertising, or city requests.',
}

export default function ContactPage() {
  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <h1>Contact Us</h1>
        <p>
          We welcome feedback from readers, jewellers, and partners. Use the sections below to route your message to the right
          topic—we are a small team, so please allow a few business days for a reply.
        </p>

        <h2>Email</h2>
        <p>
          General enquiries:{' '}
          <a href="mailto:goldratesindia4@gmail.com">goldratesindia4@gmail.com</a>
        </p>

        <h2>Rate Corrections</h2>
        <p>
          If you believe a displayed rate, label, or chart point is materially wrong for your city or date, email us with the
          city name, karat, source you rely on (e.g. local board, invoice screenshot with sensitive details removed), and the
          timestamp you observed. We cannot guarantee immediate updates, but verified issues help us improve our pipelines.
        </p>

        <h2>Advertising Enquiries</h2>
        <p>
          Brands offering jewellery, gold investment products, bullion services, or related financial education may advertise
          with us subject to suitability and compliance review. Write to{' '}
          <a href="mailto:goldratesindia4@gmail.com">goldratesindia4@gmail.com</a> with &quot;Advertising&quot; in the subject line,
          your company name, campaign goals, and preferred placement (display, sponsored content outline, or newsletter—if
          available). We do not endorse advertisers; ads are labelled in line with network policies.
        </p>

        <h2>City Requests</h2>
        <p>
          Want another metro or tier-1 city added to the selector? Tell us which city, why it matters to your audience, and any
          public data sources you recommend. We prioritise requests that improve coverage for large reader groups.
        </p>

        <h2>Editorial Questions</h2>
        <p>
          If you have corrections or suggestions for our city guides, FAQs, calculators, or gold buying articles, email us with
          the page URL and a short explanation. We review good-faith feedback carefully because accuracy and clarity matter more
          than publishing volume.
        </p>

        <h2>Partnerships</h2>
        <p>
          We are open to carefully reviewed partnerships relevant to gold rates, jewellery education, and buyer tools. If you
          represent a brand or jeweller and want to discuss a sponsorship or listing idea, send a clear proposal that explains
          what readers would gain from it.
        </p>
      </main>
    </div>
  )
}
