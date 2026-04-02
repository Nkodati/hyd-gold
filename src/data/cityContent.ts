import type { CityKey } from '@/components/GoldDashboard'

export interface CityContent {
  slug: CityKey
  cityName: string
  title: string
  description: string
  overview: string[]
  buyingTips: string[]
  faq: Array<{ question: string; answer: string }>
}

export const cityContent: Record<CityKey, CityContent> = {
  chennai: {
    slug: 'chennai',
    cityName: 'Chennai',
    title: 'Gold Rate in Chennai Today',
    description:
      'Track today’s gold rate in Chennai with context on local jewellery demand, premiums, purity, and practical buying tips.',
    overview: [
      'Chennai is one of India’s most active gold-buying markets, shaped by strong cultural demand, bridal jewellery purchases, and high awareness around daily rate movement. That makes Chennai gold buyers unusually price-sensitive: people often monitor 22K and 24K trends before visiting stores, especially during wedding planning or festival shopping.',
      'The city’s displayed gold rate generally follows the national bullion benchmark and global cues, but local showroom pricing can still shift because of inventory conditions, design-heavy purchases, and how stores structure making charges. In practical terms, the Chennai benchmark rate is your starting point, while the invoice tells you the full story.',
    ],
    buyingTips: [
      'Compare at least two jewellers when making charges are high, because Chennai buyers often see meaningful differences in labour pricing even when the day’s metal rate is the same.',
      'If you are buying temple, bridal, or antique-finish jewellery, ask how wastage and craftsmanship are calculated. Design-heavy pieces can make the final bill diverge sharply from the headline gold rate.',
      'For coins or bars, focus on purity, certification, and resale clarity rather than only on the day’s benchmark movement.',
    ],
    faq: [
      {
        question: 'Why is Chennai gold rate closely watched by buyers?',
        answer:
          'Chennai has consistently strong jewellery demand, so daily rates matter to households planning wedding and savings purchases. Even small per-gram changes can affect large family buys.',
      },
      {
        question: 'Is the Chennai rate on a website the same as the shop price?',
        answer:
          'Usually no. The published rate is an indicative benchmark. Retail bills may also include making charges, GST, wastage, and stone-related adjustments.',
      },
      {
        question: 'Should I buy 22K or 24K gold in Chennai?',
        answer:
          'Twenty-two karat is usually better for regular jewellery because it is stronger. Twenty-four karat is more common for bars, coins, and purity-focused purchases.',
      },
    ],
  },
  hyderabad: {
    slug: 'hyderabad',
    cityName: 'Hyderabad',
    title: 'Gold Rate in Hyderabad Today',
    description:
      'Follow today’s gold rate in Hyderabad with insight into local demand, premiums, hallmark checks, and better buying decisions.',
    overview: [
      'Hyderabad is one of the most searched gold markets in India because jewellery buying is deeply tied to weddings, family gifting, and investment-minded savings. Buyers in the city often compare day-to-day rate movement carefully before making larger purchases, especially for bridal sets and traditional ornaments.',
      'Like other Indian cities, Hyderabad rates are influenced by benchmark bullion prices, currency movement, and import-related costs. But local pricing still reflects showroom competition, festival demand, and the type of jewellery consumers are buying. That is why city-specific context matters alongside the raw numbers.',
    ],
    buyingTips: [
      'Ask for the net gold weight separately from stone weight when shopping for bridal or designer pieces in Hyderabad.',
      'If you are buying during a festive or wedding rush, compare billing transparency instead of assuming every “offer” reduces your final cost.',
      'For investment purchases, ask about buyback terms and purity testing before payment.',
    ],
    faq: [
      {
        question: 'Why do Hyderabad gold rates sometimes differ slightly from other cities?',
        answer:
          'The national trend is similar, but local premiums, inventory replacement cost, demand cycles, and retailer pricing strategy can create small differences.',
      },
      {
        question: 'Is Hyderabad a good city to compare multiple jewellers?',
        answer:
          'Yes. Because the market is competitive and demand is high, comparing invoices across a few reputed stores can often save money or improve billing clarity.',
      },
      {
        question: 'What should Hyderabad buyers check before paying?',
        answer:
          'Check hallmark status, purity, net gold weight, making-charge method, and whether non-gold components are billed separately.',
      },
    ],
  },
  bangalore: {
    slug: 'bangalore',
    cityName: 'Bangalore',
    title: 'Gold Rate in Bangalore Today',
    description:
      'See today’s gold rate in Bangalore and learn how local demand, investment buying, and showroom pricing affect the final bill.',
    overview: [
      'Bangalore combines traditional jewellery demand with a large base of digitally aware buyers who compare rates, resale terms, and purity more actively than ever. That makes the city a strong mix of jewellery shoppers and investment-oriented consumers tracking gold as part of a broader savings strategy.',
      'The city’s daily benchmark rate reflects the same broad forces that shape the national market, including global gold movement and rupee-dollar changes. But Bangalore’s retail environment can show its own pricing personality, especially when premium design stores, coins, and investment bars are part of the local mix.',
    ],
    buyingTips: [
      'If you are comparing jewellery with investment products, keep those decisions separate. A beautiful ornament and a low-spread gold coin serve different goals.',
      'In Bangalore, branded stores may offer stronger trust signals but also different pricing structures. Always compare the full invoice, not just the advertised rate.',
      'Buyers interested in bars or coins should ask about certification, storage, and resale convenience before choosing the lowest sticker price.',
    ],
    faq: [
      {
        question: 'Why do Bangalore buyers often compare jewellery and investment gold separately?',
        answer:
          'Because jewellery includes design and labour costs, while investment products are usually judged more on purity, spread, and liquidity.',
      },
      {
        question: 'Can the Bangalore gold rate change even if global headlines look stable?',
        answer:
          'Yes. Domestic pricing can still move because of currency changes, import costs, and local market tone.',
      },
      {
        question: 'What matters most when buying gold in Bangalore?',
        answer:
          'Clarity on purpose. Decide whether you are buying for wear, gifting, or investment, then compare products and invoices accordingly.',
      },
    ],
  },
  ahmedabad: {
    slug: 'ahmedabad',
    cityName: 'Ahmedabad',
    title: 'Gold Rate in Ahmedabad Today',
    description:
      'Check today’s gold rate in Ahmedabad with helpful context on local buying patterns, city premiums, and purity verification.',
    overview: [
      'Ahmedabad is an important market for gold buyers who often balance cultural jewellery purchases with value-conscious decision-making. Many households track rates patiently and compare city-level trends before making significant purchases, particularly during festive buying windows and family events.',
      'As in other cities, the Ahmedabad benchmark rate tracks national bullion cues, but final showroom prices depend on local operating costs, demand, and how retailers position making charges. For buyers, that means the published rate is most useful when combined with invoice discipline and purity checks.',
    ],
    buyingTips: [
      'Use the benchmark rate as a negotiation anchor, but ask the store to break down the final bill line by line.',
      'During high-demand periods, compare buyback and exchange policies because those can matter later as much as the purchase-day price.',
      'If you are buying lightweight or contemporary jewellery, verify whether the quoted purity is 18K or 22K before comparing rates.',
    ],
    faq: [
      {
        question: 'Why should Ahmedabad buyers compare purity before comparing price?',
        answer:
          'Because 18K, 22K, and 24K products have different gold content. Comparing prices without checking purity can lead to the wrong conclusion.',
      },
      {
        question: 'Does the Ahmedabad gold rate include making charges?',
        answer:
          'No. Published daily rates are usually indicative metal prices. Retail billing may add making charges, GST, wastage, or stone-related costs.',
      },
      {
        question: 'What is a simple way to buy gold more safely in Ahmedabad?',
        answer:
          'Choose a reputed seller, verify hallmark and invoice details, and compare at least a couple of stores when the purchase amount is meaningful.',
      },
    ],
  },
}

export function getAllCityContent() {
  return Object.values(cityContent)
}
