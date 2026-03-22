import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Gold Rate India',
  description: 'Privacy policy for GoldRateIndia.live, including cookies, analytics, and Google AdSense.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <h1>Privacy Policy</h1>
        <p className="text-sm" style={{ color: 'rgba(245,240,232,0.45)' }}>
          Last updated: 22 March 2026
        </p>

        <p>
          GoldRateIndia.live (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy Policy
          explains what information we collect when you use our website, how we use cookies and similar technologies, how
          advertising partners such as Google AdSense may process data, and the choices available to you. By using
          GoldRateIndia.live, you agree to the practices described here. If you do not agree, please discontinue use of the site.
        </p>

        <h2>Information We Collect</h2>
        <p>
          <strong>Information you provide voluntarily.</strong> If you email us (for example via the address listed on our
          Contact page), we receive your email address, any name you include, and the contents of your message. We use this
          information solely to respond to your enquiry or to improve our services.
        </p>
        <p>
          <strong>Information collected automatically.</strong> When you visit GoldRateIndia.live, our servers and third-party
          service providers may automatically log technical data such as your IP address (often truncated or anonymised),
          browser type, device type, referring URL, pages viewed, and approximate geographic region derived from IP. This data
          helps us secure the site, understand aggregate traffic patterns, and maintain reliability.
        </p>

        <h2>Cookies</h2>
        <p>
          We and our partners use cookies and similar storage technologies. <strong>Essential cookies</strong> are required
          for basic site functionality, security, and load balancing. <strong>Analytics cookies</strong> help us measure
          aggregated usage (for example, which pages are popular) so we can improve performance and content.{' '}
          <strong>Advertising cookies</strong> may be set by ad networks to deliver, limit, or measure ads, and in some cases
          to personalise ad content based on your interests or prior visits.
        </p>
        <p>
          You can control cookies through your browser settings. Blocking certain cookies may limit site features or ad
          personalisation. For more about managing ad cookies, see the Google AdSense section below.
        </p>

        <h2>Google AdSense &amp; Advertising</h2>
        <p>
          We may use Google AdSense or other Google advertising products to display ads. Google may use cookies, mobile
          advertising IDs, or similar technologies to serve ads based on your prior visits to our site or other sites. Google&apos;s
          use of advertising cookies enables it and its partners to serve ads to users based on their visits to
          GoldRateIndia.live and/or other websites on the Internet.
        </p>
        <p>
          You may opt out of personalised advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          , or the industry page at{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info choices
          </a>
          . For EU users, Google also provides information about ad personalisation via{' '}
          <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer">
            Ads Settings (signed in)
          </a>
          .
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Operate, maintain, and secure GoldRateIndia.live;</li>
          <li>Analyse aggregated traffic to improve layout, performance, and content;</li>
          <li>Display and measure advertising where enabled;</li>
          <li>Respond to communications you initiate;</li>
          <li>Comply with applicable law or protect our legal rights.</li>
        </ul>
        <p>We do not sell your personal information in the conventional sense of selling lists of names and emails.</p>

        <h2>Third-Party Services</h2>
        <p>
          We may rely on vendors that process data on our behalf. These can include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Google Analytics</strong> — website analytics. See Google&apos;s privacy information at{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
            .
          </li>
          <li>
            <strong>Google AdSense</strong> — advertising. See{' '}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
              Google&apos;s Advertising Policies
            </a>{' '}
            and{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Privacy Policy
            </a>
            .
          </li>
        </ul>
        <p>
          Third-party services have their own privacy policies. We encourage you to review them. We are not responsible for the
          practices of third parties except as described in this policy.
        </p>

        <h2>Data Retention</h2>
        <p>
          Server logs and analytics data may be retained for a limited period consistent with operational needs, security, and
          legal obligations. Email correspondence may be retained as long as necessary to address your request or maintain
          records. Aggregated or anonymised data may be retained longer because it no longer identifies you.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          GoldRateIndia.live is not directed at children under 13 (or the minimum age required in your jurisdiction). We do not
          knowingly collect personal information from children. If you believe a child has provided us personal information,
          please contact us and we will take reasonable steps to delete it.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the &quot;Last updated&quot; date at the
          top of this page. Material changes may be highlighted on the site or communicated where appropriate. Continued use after
          changes constitutes acceptance of the updated policy.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy-related questions or requests, please reach out via our{' '}
          <Link href="/contact">Contact</Link> page or email{' '}
          <a href="mailto:hello@goldrateindia.live">hello@goldrateindia.live</a>.
        </p>
      </main>
    </div>
  )
}
