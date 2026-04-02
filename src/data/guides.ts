export interface GuideSection {
  heading: string
  paragraphs: string[]
}

export interface GuidePage {
  slug: string
  title: string
  description: string
  eyebrow: string
  sections: GuideSection[]
}

export const guides: GuidePage[] = [
  {
    slug: '22k-vs-24k-gold',
    title: '22K vs 24K Gold: Which One Should You Buy?',
    description:
      'Understand the difference between 22K and 24K gold in India, including purity, durability, pricing, and when each option makes sense.',
    eyebrow: 'Buying Guide',
    sections: [
      {
        heading: 'The practical difference between 22K and 24K',
        paragraphs: [
          'The simplest difference is purity. Twenty-four karat gold is closer to pure gold, while 22K contains a slightly smaller share of gold and a slightly larger share of alloy metals. That difference affects both price and usability. Because 24K is softer, it is not always ideal for intricate jewellery meant for frequent wear. Twenty-two karat is usually stronger, which is why it is widely used for ornaments in India.',
          'For everyday buyers, the more useful question is not which one is “better” in the abstract, but which one suits the purpose of the purchase. If you want coins or bars and purity is your main concern, 24K often makes more sense. If you want jewellery that balances value and durability, 22K is usually more practical.',
        ],
      },
      {
        heading: 'How pricing changes between 22K and 24K',
        paragraphs: [
          'Because 24K contains more gold, it is usually priced higher per gram than 22K. But the final bill does not depend only on purity. Jewellery purchases also include making charges, GST, and sometimes wastage or stone-related costs. That means a buyer should never compare only the headline per-gram number without asking how the store calculates the rest of the invoice.',
          'A useful habit is to compare both purity and billing structure together. Some shoppers get distracted by a low-looking daily rate without noticing that the product purity is different from what they assumed. Clear comparison starts with checking whether you are evaluating 22K against 22K, or 24K against 24K.',
        ],
      },
      {
        heading: 'When each one makes sense',
        paragraphs: [
          'Choose 24K when your goal is purity-focused buying, typically for bars, coins, or investment-style purchases. Choose 22K when you want jewellery that is intended to be worn, gifted, exchanged, or passed down. In many family purchases, 22K is the middle ground between metal value and everyday practicality.',
          'The best choice depends on use, not on prestige. A buyer who knows the purpose of the purchase will usually make a better decision than a buyer who focuses only on the karat number.',
        ],
      },
    ],
  },
  {
    slug: 'gold-making-charges-explained',
    title: 'Gold Making Charges Explained for Jewellery Buyers',
    description:
      'Learn what making charges are, why they vary, and how they can affect your gold jewellery bill more than a small daily rate move.',
    eyebrow: 'Pricing Guide',
    sections: [
      {
        heading: 'Why making charges matter so much',
        paragraphs: [
          'Many buyers focus heavily on the daily gold rate and ignore making charges until the invoice stage. That is a mistake, because making charges can meaningfully increase the total cost of a jewellery purchase. In some cases, the difference in labour pricing between two stores matters more than a small difference in the quoted metal rate.',
          'Making charges are the amount the jeweller adds for designing, crafting, finishing, and handling the ornament. More intricate pieces usually attract higher charges, while plain designs may be priced more simply. The key is that buyers should treat this as a major pricing line item, not as a minor extra.',
        ],
      },
      {
        heading: 'Why stores calculate them differently',
        paragraphs: [
          'Some jewellers quote making charges as a percentage of gold value, while others may quote a flat rate per gram or per piece. This is one reason headline offers can be confusing. Two stores may appear to be offering similar rates but produce very different final bills once labour pricing is included.',
          'The right question is not “What is your gold rate?” but “How is the final bill calculated?” Ask for a breakdown of metal value, making charges, GST, and any additional design or stone-related line items. That makes comparison far easier and reduces unpleasant surprises at payment time.',
        ],
      },
      {
        heading: 'How buyers can compare better',
        paragraphs: [
          'Use a calculator or rough estimate before entering the store so you know what range is reasonable. Then ask for a written estimate from more than one jeweller, especially when the purchase amount is large. A transparent invoice is a stronger sign of value than a flashy “discount” sign with no billing detail.',
          'A small daily dip in the gold rate is helpful, but clear making-charge discipline often saves more money in practice. Smart buyers compare both.',
        ],
      },
    ],
  },
  {
    slug: 'bis-hallmark-guide',
    title: 'BIS Hallmark Guide: How to Check Gold Purity with Confidence',
    description:
      'A simple BIS Hallmark guide for Indian gold buyers who want to verify purity and reduce the risk of confusion before payment.',
    eyebrow: 'Purity Guide',
    sections: [
      {
        heading: 'Why hallmarking matters',
        paragraphs: [
          'A hallmark helps buyers verify that a gold product is being sold through a recognised purity framework rather than through a vague verbal claim. That matters because gold purchases are often large, emotional, and made during time-sensitive family events. Verification reduces the chance of paying for a quality level you are not actually receiving.',
          'For cautious buyers, hallmark awareness is one of the simplest forms of protection. It does not replace invoice checking, but it does give you a firmer base for trust.',
        ],
      },
      {
        heading: 'How to use hallmark checks in the real world',
        paragraphs: [
          'Ask the jeweller to show the hallmark details on the piece and explain the stated purity clearly. Then make sure the invoice matches what you were told. A clear explanation from the seller is a positive sign; hesitation or vagueness is a reason to slow down.',
          'You do not need to become a technical expert in one day. You just need enough confidence to verify purity, compare sellers, and make sure the invoice supports the claim being made at the counter.',
        ],
      },
      {
        heading: 'Hallmarking is part of a larger buying process',
        paragraphs: [
          'Even a hallmarked piece should be checked alongside net gold weight, making charges, stone deductions, and buyback policy. Purity matters, but so does billing transparency. Good buying decisions come from looking at the full picture rather than relying on one symbol alone.',
          'That is why trustworthy rate and content sites should explain both hallmarking and invoice structure together. One protects quality; the other protects value.',
        ],
      },
    ],
  },
  {
    slug: 'best-time-to-buy-gold-for-wedding',
    title: 'Best Time to Buy Gold for Weddings in India',
    description:
      'A practical guide to buying wedding gold in India without overpaying, panicking over daily moves, or ignoring invoice details.',
    eyebrow: 'Wedding Guide',
    sections: [
      {
        heading: 'Wedding buying is different from casual jewellery shopping',
        paragraphs: [
          'Wedding purchases are larger, more emotional, and more time-sensitive than ordinary jewellery buys. Families often need multiple pieces, custom work, or culturally important designs, which means timing matters for more than just the metal rate. Inventory, design lead time, and billing clarity all matter too.',
          'Because wedding jewellery bills can be substantial, even small planning improvements can make a noticeable difference. The best strategy is usually to begin research early rather than waiting for a single “perfect” price day.',
        ],
      },
      {
        heading: 'How to think about timing',
        paragraphs: [
          'Instead of trying to predict the exact market bottom, monitor rates over a window of days or weeks and decide in advance how much volatility you are comfortable with. For large purchases, staggered buying can reduce stress and help families avoid committing the entire budget at a short-term peak.',
          'If the wedding date is fixed, delaying too long can backfire. Design finalisation, fitting, and store rush periods may become bigger risks than the benefit of chasing a slightly lower benchmark rate.',
        ],
      },
      {
        heading: 'What matters more than market timing',
        paragraphs: [
          'Final invoice quality matters more than many buyers realise. For bridal purchases, making charges, wastage assumptions, and stone billing can be significant. Comparing two or three stores can therefore be more valuable than obsessing over a tiny day-to-day shift in the raw gold price.',
          'A good wedding gold purchase is one where the price is understandable, the quality is clear, and the family feels confident about the seller. That usually beats trying to outguess the market by a few hundred rupees.',
        ],
      },
    ],
  },
  {
    slug: 'gold-vs-silver-buying-guide',
    title: 'Gold vs Silver: Which Metal Makes More Sense for Your Goal?',
    description:
      'Compare gold and silver for gifting, jewellery, savings, and market tracking in India with a practical buyer-focused lens.',
    eyebrow: 'Comparison Guide',
    sections: [
      {
        heading: 'Different metals, different roles',
        paragraphs: [
          'Gold and silver are often grouped together, but buyers usually choose them for different reasons. Gold is more deeply connected to long-term savings, weddings, and high-value gifting. Silver is often more accessible, more industrially influenced, and more price-flexible for smaller purchases or cultural use.',
          'That means the right choice depends on the goal. Someone buying a bridal set, family heirloom, or value-dense gift may naturally lean toward gold. Someone seeking a lower-cost entry point or a different kind of purchase may find silver more practical.',
        ],
      },
      {
        heading: 'How to compare them intelligently',
        paragraphs: [
          'Do not compare gold and silver only by asking which one moved more today. Compare them by use case, resale expectations, storage comfort, and the size of purchase you want to make. A small silver purchase can be easier to enter, but it serves a different role than a major gold buy.',
          'Price movement alone can be misleading. The decision should be based on why you are buying, not just on which chart looks more exciting this week.',
        ],
      },
      {
        heading: 'What many first-time buyers get wrong',
        paragraphs: [
          'Some first-time buyers assume silver is simply a cheaper substitute for gold. In reality, it is a different product with its own behaviour, uses, and buyer expectations. Others assume gold is always the “serious” option even when their actual budget and purpose suggest otherwise.',
          'The best purchase is the one that matches your goal honestly. If you know why you are buying, the right metal becomes easier to identify.',
        ],
      },
    ],
  },
  {
    slug: 'gold-investment-options-india',
    title: 'Gold Investment Options in India: Jewellery, Coins, ETFs, or Bonds?',
    description:
      'Explore common gold investment options in India and understand why jewellery is not always the best tool for investment-focused buyers.',
    eyebrow: 'Investment Guide',
    sections: [
      {
        heading: 'Not every gold purchase is an investment purchase',
        paragraphs: [
          'A lot of confusion comes from treating all gold buying as if it serves the same purpose. Jewellery can hold value, but it is often purchased for wear, gifting, emotion, and cultural meaning as much as for metal content. Investment-style products are judged more on purity, spread, liquidity, and storage convenience.',
          'That is why buyers should start by deciding whether they want wearable value or investment exposure. Once that is clear, the right product category becomes easier to compare.',
        ],
      },
      {
        heading: 'How different options fit different goals',
        paragraphs: [
          'Coins and bars appeal to buyers who want physical metal with relatively straightforward purity considerations. ETFs and similar market-linked products appeal to those who want exposure without handling physical storage. Sovereign gold bonds have their own structure and may suit buyers who are comfortable with a different product format and holding period.',
          'Each format has trade-offs. Physical products feel tangible but may involve spreads and storage questions. Financial products can be efficient, but they are not the same experience as holding jewellery or bullion in hand.',
        ],
      },
      {
        heading: 'What this means for everyday readers',
        paragraphs: [
          'If your goal is adornment or family gifting, jewellery may be completely appropriate. If your goal is pure investment efficiency, you may want to compare other options rather than assuming jewellery is automatically best. The key is not to confuse emotional value with financial efficiency.',
          'Good decision-making begins when the purchase goal is named honestly. That one step prevents a lot of regret later.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-read-gold-jewellery-invoice',
    title: 'How to Read a Gold Jewellery Invoice Before You Pay',
    description:
      'Learn how to read a gold jewellery invoice, understand key billing lines, and spot the details that matter before payment.',
    eyebrow: 'Invoice Guide',
    sections: [
      {
        heading: 'Why invoices deserve more attention',
        paragraphs: [
          'Many buyers spend a lot of time watching the gold rate and very little time reading the invoice. That is backwards. The invoice tells you what you are actually being charged for, how purity is being represented, and whether the jeweller has explained non-gold costs properly.',
          'A clear invoice is one of the strongest signals that a seller is operating transparently. If the invoice feels vague, rushed, or incomplete, it becomes much harder for the buyer to judge value.',
        ],
      },
      {
        heading: 'Key lines to review',
        paragraphs: [
          'Check the purity, the net gold weight, the rate applied, the making-charge line, GST, and any separate charges for stones or non-gold components. If something is bundled into a single unclear number, ask for it to be explained. Buyers should not feel embarrassed about requesting clarity when they are making a meaningful purchase.',
          'The goal is not confrontation. The goal is alignment. If both seller and buyer are looking at the same numbers clearly, trust improves.',
        ],
      },
      {
        heading: 'The invoice is where comparison becomes real',
        paragraphs: [
          'Two jewellers can quote a similar rate but produce very different invoice totals because they structure the rest of the bill differently. That is why serious comparison only begins when the invoice or estimate is itemised. Until then, price comparisons are often incomplete.',
          'A buyer who understands invoices is much harder to confuse. That alone can lead to better purchase outcomes.',
        ],
      },
    ],
  },
  {
    slug: 'wedding-gold-budget-planning',
    title: 'How to Plan a Wedding Gold Budget Without Guesswork',
    description:
      'A simple framework for planning a wedding gold budget in India while keeping rates, labour costs, and priorities under control.',
    eyebrow: 'Budget Guide',
    sections: [
      {
        heading: 'Start with purpose, not panic',
        paragraphs: [
          'Wedding gold spending can grow quickly when families buy reactively instead of planning intentionally. The best starting point is to list what is essential, what is tradition-driven, and what is optional. Once that list exists, the budget becomes easier to control.',
          'Many households overspend not because the gold rate moved dramatically, but because the purchase scope expanded without clear limits. Planning protects more than prediction does.',
        ],
      },
      {
        heading: 'Build the budget in layers',
        paragraphs: [
          'Separate metal value, making charges, GST, and design-heavy extras. Do not keep all of these inside one vague budget number. When costs are separated, families can make trade-offs intelligently. They may choose a lighter design, a different timing strategy, or fewer high-labour pieces without feeling that the whole purchase plan has collapsed.',
          'This layered view also makes jeweller comparisons easier because you know which part of the bill is changing and why.',
        ],
      },
      {
        heading: 'Confidence is part of the budget outcome',
        paragraphs: [
          'A wedding gold budget succeeds not only when it stays within range, but when the family understands the final bill and feels comfortable with the choices made. Transparency reduces regret. Confusion creates second thoughts.',
          'That is why good planning, clear invoices, and realistic expectations matter as much as the daily gold rate itself.',
        ],
      },
    ],
  },
]

export function getAllGuides() {
  return guides
}

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}
