export interface Article {
  id: string;
  category: string;
  location: string;
  title: string;
  description: string;
  imageUrl: string;
  biasLeft: number;
  biasCenter: number;
  biasRight: number;
  sourcesCount: number;
  author: string;
  publishedDate: string;
  readTime: string;
  paragraphs: string[];
  highlights: string[];
  relatedIds: string[];
}

export const mockArticles: Article[] = [
  {
    id: "1",
    category: "Politics",
    location: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    description: "The proposal includes stricter limits on uranium enrichment and enhanced verification measures.",
    imageUrl: "/trump_portrait_official.jpg",
    biasLeft: 20,
    biasCenter: 31,
    biasRight: 49,
    sourcesCount: 12,
    author: "David Morgan",
    publishedDate: "May 31, 2026",
    readTime: "12 min read",
    paragraphs: [
      "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
      "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
      "\"This is a take-it-or-leave-it proposal,\" a senior administration official told the Wall Street Journal. \"The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.\"",
      "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
      "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
      "European allies have urged both sides to continue negotiations. \"We believe diplomacy is still the best path forward,\" said a spokesperson for the EU's foreign policy chief.",
      "Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration's tougher stance. \"This is the kind of leadership that was missing in the past,\" said Israeli Prime Minister Benjamin Netanyahu in a statement.",
      "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached—or if tensions will escalate further."
    ],
    highlights: [
      "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment and the removal of enriched uranium stockpiles.",
      "The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.",
      "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
      "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
      "Israel supports the tougher stance, praising the administration's determination to prevent Iran from acquiring nuclear weapons."
    ],
    relatedIds: ["4", "5", "7", "9", "10", "12"]
  },
  {
    id: "2",
    category: "Health",
    location: "United States",
    title: "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence",
    description: "New studies suggest that dynamic antioxidants found in grapes play a key role in longevity and heart health.",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80",
    biasLeft: 18,
    biasCenter: 42,
    biasRight: 40,
    sourcesCount: 7,
    author: "Elena Rostova",
    publishedDate: "May 30, 2026",
    readTime: "8 min read",
    paragraphs: [
      "A comprehensive review of scientific literature has strengthened the case for classifying grapes as a 'superfood,' highlighting their significant impact on cardiovascular health, cognitive function, and cellular longevity.",
      "The review, published in the Journal of Nutritional Science, synthesized data from over thirty clinical trials. Researchers identified key natural compounds in grapes—specifically resveratrol and various polyphenols—that show a direct correlation with reduced arterial inflammation and improved blood flow.",
      "In addition to heart health, emerging pilot studies suggest that regular grape consumption may enhance memory retention and cognitive agility in older adults, likely by combating oxidative stress in brain tissues.",
      "While nutritionists caution that whole grapes are always preferable to processed grape juices due to fiber content, the evidence indicates that adding fresh grapes to daily diets provides substantial long-term metabolic benefits."
    ],
    highlights: [
      "Synthesized data from over 30 clinical trials shows a strong link between grape consumption and reduced cardiovascular inflammation.",
      "Resveratrol and polyphenols found in grapes are key compounds contributing to improved arterial blood flow.",
      "Regular consumption is associated with memory improvements in older adults by combating local oxidative stress.",
      "Whole fresh grapes are highly recommended over juices to maximize dietary fiber and health outcomes."
    ],
    relatedIds: ["1", "3", "6", "8", "9", "10"]
  },
  {
    id: "3",
    category: "Science",
    location: "Switzerland",
    title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    description: "Large Hadron Collider data reveals anomalous lepton behavior, suggesting the existence of a new force carrier.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    biasLeft: 16,
    biasCenter: 62,
    biasRight: 22,
    sourcesCount: 8,
    author: "Marcus Vance",
    publishedDate: "May 29, 2026",
    readTime: "10 min read",
    paragraphs: [
      "Physicists at the European Organization for Nuclear Research (CERN) have announced the discovery of anomalies in decay data that cannot be explained by the Standard Model of particle physics.",
      "The measurements, captured by the LHCb detector, show that bottom quarks decay into muons and electrons at slightly asymmetric rates, violating the Standard Model principle of lepton universality.",
      "If verified, the finding points to the presence of undiscovered particles—such as leptoquarks or a new Z' boson—that interact differently with different leptons.",
      "The significance of the result is approaching the 'five-sigma' threshold required to declare a formal discovery. Research teams at Fermilab and KEK in Japan are currently reviewing their own datasets to confirm the asymmetry."
    ],
    highlights: [
      "CERN researchers have detected decays of bottom quarks that deviate from Standard Model predictions.",
      "The data reveals a violation of lepton universality, as bottom quarks decay into muons and electrons at asymmetric rates.",
      "The findings hint at the possible existence of new physical entities, like leptoquarks or a novel Z' boson.",
      "Teams are collaborating globally to push measurements past the formal five-sigma discovery threshold."
    ],
    relatedIds: ["2", "7", "8", "9", "10", "11"]
  },
  {
    id: "4",
    category: "World",
    location: "Nicaragua",
    title: "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    description: "Human rights organizations call for investigation into treatment of Miskito politician who died in hospital.",
    imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
    biasLeft: 54,
    biasCenter: 28,
    biasRight: 18,
    sourcesCount: 63,
    author: "Sofia Gutierrez",
    publishedDate: "May 28, 2026",
    readTime: "9 min read",
    paragraphs: [
      "Prominent indigenous leader Brooklyn Rivera, who represented the Miskito people of Nicaragua's Caribbean coast, has died in a military hospital after spending nearly three years in detention.",
      "Rivera, a former member of the National Assembly and critic of President Daniel Ortega's government, was arrested in 2023 under state security charges that international human rights groups characterized as politically motivated.",
      "Family members and independent advocates allege that Rivera was denied adequate medical care for chronic health conditions during his incarceration, leading to a severe deterioration in his physical state.",
      "The United Nations High Commissioner for Human Rights has called on the Nicaraguan authorities to perform a transparent, independent investigation into the circumstances surrounding his custody and death."
    ],
    highlights: [
      "Indigenous Miskito leader Brooklyn Rivera has passed away in hospital after three years in government custody.",
      "Rivera was a key critic of President Ortega and was arrested in 2023 under security charges.",
      "Human rights groups allege medical neglect during detention and are calling for independent investigations.",
      "The UN High Commissioner has requested transparency and accountability from Nicaraguan authorities."
    ],
    relatedIds: ["1", "5", "6", "9", "10", "12"]
  },
  {
    id: "5",
    category: "World",
    location: "Middle East",
    title: "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    description: "Diplomatic efforts intensify in New York as cross-border military operations expand in southern Lebanon.",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80",
    biasLeft: 22,
    biasCenter: 35,
    biasRight: 43,
    sourcesCount: 15,
    author: "Rami Al-Khoury",
    publishedDate: "May 27, 2026",
    readTime: "11 min read",
    paragraphs: [
      "The United Nations Security Council has scheduled an emergency session following a major escalation in cross-border ground operations in southern Lebanon.",
      "Reports indicate that armored units have advanced past the Blue Line at multiple points, engaging local defense forces in dense firefights. The military command stated that the actions are targeted operations designed to neutralize rocket launching structures.",
      "In Beirut, government officials condemned the operations as a severe violation of national sovereignty and called for an immediate, unconditional ceasefire under international supervision.",
      "Diplomats in New York are drafting a resolution demanding the cessation of hostilities, though representatives warn that veto discussions could delay immediate binding actions."
    ],
    highlights: [
      "The UN Security Council calls an emergency meeting following ground advancements into southern Lebanon.",
      "Military forces engaged in firefights to neutralize cross-border launching infrastructure.",
      "The Lebanese government has condemned the operation as a violation of sovereignty and requested a ceasefire.",
      "International diplomats are negotiating a draft resolution to halt the escalation in New York."
    ],
    relatedIds: ["1", "4", "6", "9", "10", "12"]
  },
  {
    id: "6",
    category: "Business",
    location: "Global",
    title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    description: "Crude prices fall below key benchmarks as global manufacturing indicators signal cooling demand patterns.",
    imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80",
    biasLeft: 25,
    biasCenter: 50,
    biasRight: 28,
    sourcesCount: 11,
    author: "Sarah Jenkins",
    publishedDate: "May 26, 2026",
    readTime: "7 min read",
    paragraphs: [
      "International crude oil benchmarks fell on Monday following reports that key members of OPEC+ are discussing a gradual reduction of voluntary supply cuts starting next quarter.",
      "The potential output increase coincides with weak manufacturing data from major global economies, fueling market concerns over a surplus in oil supply.",
      "Analysts note that while some producers prefer keeping prices high by limiting volume, others are eager to increase production to support domestic fiscal balance sheets.",
      "Market volatility is expected to continue leading up to the formal OPEC+ ministerial meeting, where production targets will be locked in."
    ],
    highlights: [
      "Crude oil prices declined on reports of OPEC+ discussing output increases starting next quarter.",
      "Slowing global manufacturing indicators are raising concerns over a potential supply surplus.",
      "Producer nations are divided between maintaining high prices and expanding volume for fiscal support.",
      "Markets anticipate high volatility ahead of the upcoming OPEC+ target setting meeting."
    ],
    relatedIds: ["2", "4", "5", "8", "9", "10"]
  },
  {
    id: "7",
    category: "Technology",
    location: "United States",
    title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    description: "The massive heavy-lift rocket achieved orbital trajectory goals before a controlled splashdown in the Indian Ocean.",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
    biasLeft: 12,
    biasCenter: 45,
    biasRight: 49,
    sourcesCount: 9,
    author: "Alex Chen",
    publishedDate: "May 25, 2026",
    readTime: "9 min read",
    paragraphs: [
      "SpaceX has completed another test flight of its Starship spacecraft, achieving critical milestones in its flight profile, including a successful hot-stage separation and a controlled booster landing demonstration.",
      "The vehicle launched from Starbase in Texas, climbing to a peak altitude before performing a controlled reentry through the atmosphere, demonstrating advanced thermal shielding capabilities.",
      "The flight represents a major step forward for NASA's Artemis program, which relies on Starship as the human landing system for upcoming lunar missions, as well as Elon Musk's long-term Mars ambitions.",
      "Engineers are currently recovering data from the telemetry stream to prepare for the next integration test flight later this year."
    ],
    highlights: [
      "SpaceX's Starship completed a milestone test flight, showing successful separation and booster control.",
      "The ship demonstrated thermal shield resilience during atmospheric reentry.",
      "Starship's progress is critical for NASA's Artemis program and future Mars transport architectures.",
      "Engineers are compiling telemetry data to optimize the next test flight configuration."
    ],
    relatedIds: ["1", "3", "8", "9", "10", "11"]
  },
  {
    id: "8",
    category: "Business",
    location: "United States",
    title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    description: "The tech giant announces Apple Intelligence, bringing generative writing tools and context-aware Siri to consumers.",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
    biasLeft: 15,
    biasCenter: 40,
    biasRight: 45,
    sourcesCount: 10,
    author: "David Lee",
    publishedDate: "May 24, 2026",
    readTime: "6 min read",
    paragraphs: [
      "Apple has announced the release of Apple Intelligence, a suite of deep machine learning features integrated directly into iOS, iPadOS, and macOS.",
      "The updates bring advanced tools for text rewriting, photo cleanup, and custom notification prioritization, all leveraging on-device processing to protect user privacy.",
      "Siri has also received a major overhaul, utilizing a large language model to maintain conversational context and perform complex in-app actions on behalf of users.",
      "The features will roll out in beta next month for devices equipped with modern Apple Silicon chips, representing a major strategic shift in Apple's product lineup."
    ],
    highlights: [
      "Apple has launched Apple Intelligence, integrating machine learning across iOS, iPadOS, and macOS.",
      "The suite features writing tools, notification sorting, and on-device processing for privacy.",
      "Siri has been upgraded to a large language model capable of processing conversational context.",
      "Beta releases will start next month for modern Apple Silicon chips."
    ],
    relatedIds: ["2", "3", "6", "7", "9", "10"]
  },
  {
    id: "9",
    category: "Climate",
    location: "Global",
    title: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    description: "Copernicus confirms global temperature anomalies continue to set monthly records amid rising carbon emissions.",
    imageUrl: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=600&q=80",
    biasLeft: 33,
    biasCenter: 34,
    biasRight: 33,
    sourcesCount: 14,
    author: "Clara Dupont",
    publishedDate: "May 23, 2026",
    readTime: "8 min read",
    paragraphs: [
      "The European Union's Copernicus Climate Change Service has reported that global temperatures in 2025 are on track to make it one of the three warmest years on record.",
      "Data shows that surface air temperatures have consistently exceeded historical baselines, fueled by greenhouse gas accumulations and lingering El Niño conditions.",
      "The anomalies are manifesting as severe drought conditions in Central America, record sea-surface temperatures, and accelerated polar ice sheet melting.",
      "Climate scientists warn that without immediate reductions in fossil fuel dependency, the global average temperature could consistently exceed the 1.5°C threshold established by the Paris Agreement."
    ],
    highlights: [
      "EU's Copernicus Service reports 2025 global temperatures are tracking toward the top three warmest on record.",
      "Surface temperatures are consistently exceeding baselines due to emissions and El Niño conditions.",
      "Global impacts include severe droughts, sea-surface warming, and polar ice melting.",
      "Scientists warn of risks exceeding the 1.5°C Paris Agreement limit without fossil fuel cuts."
    ],
    relatedIds: ["1", "2", "3", "10", "11", "12"]
  },
  {
    id: "10",
    category: "Economy",
    location: "United States",
    title: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    description: "Federal Reserve Chairman emphasizes a data-dependent path, signaling that interest rate cuts remain conditional.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    biasLeft: 30,
    biasCenter: 45,
    biasRight: 25,
    sourcesCount: 13,
    author: "Robert Miller",
    publishedDate: "May 22, 2026",
    readTime: "9 min read",
    paragraphs: [
      "The Federal Reserve has voted to keep the federal funds rate unchanged, stating that while inflation has moderating trends, it remains above the central bank's two percent target.",
      "The policy statement highlighted strong job growth and solid economic activity, suggesting that monetary tightness is necessary to bring inflation down.",
      "Fed Chairman Jerome Powell reiterated that future actions will remain strictly data-dependent, refusing to commit to a specific timeline for interest rate reductions.",
      "Financial markets reacted with slight declines, as investors adjusted expectations for any near-term easing of borrowing costs."
    ],
    highlights: [
      "The Federal Reserve has kept the target interest rate steady, citing lingering inflation pressures.",
      "Strong employment and business metrics suggest monetary tightness will be maintained.",
      "Chairman Powell emphasized a data-driven approach with no committed timeline for cuts.",
      "Markets dropped slightly as prospects of near-term rate cuts diminished."
    ],
    relatedIds: ["1", "2", "3", "6", "8", "9"]
  },
  {
    id: "11",
    category: "Soccer",
    location: "Europe",
    title: "Real Madrid Win Champions League After Comeback Victory in Final",
    description: "Late goals secure the club's historic title extension in a thrilling second-half turnabout at Wembley.",
    imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80",
    biasLeft: 10,
    biasCenter: 20,
    biasRight: 70,
    sourcesCount: 26,
    author: "Pierre Laurent",
    publishedDate: "May 21, 2026",
    readTime: "7 min read",
    paragraphs: [
      "Real Madrid has claimed another UEFA Champions League title, defeating their opponents with two late goals in a dramatic final at Wembley Stadium.",
      "Despite being dominated in the first half, the Spanish giants maintained defensive stability and capitalization on late corner kicks and counter-attacks to secure the trophy.",
      "The victory adds another European cup to the club's unmatched history, cementing their status as the most successful team in Champions League history.",
      "Fans celebrated across Madrid, while managers praised the squad's resilience and veteran leadership under pressure."
    ],
    highlights: [
      "Real Madrid won the UEFA Champions League final with two late second-half goals at Wembley.",
      "The club weathered first-half pressure before capitalizing on late counter-attacks.",
      "The trophy expands Real Madrid's record-setting count of European championships.",
      "Resilience and coaching decisions were credited for turning the match in the second half."
    ],
    relatedIds: ["3", "7", "9", "12"]
  },
  {
    id: "12",
    category: "Environment",
    location: "Canada",
    title: "Wildfires Force Thousands to Evacuate Across Western Canada",
    description: "High winds and record dryness fuel aggressive blazes, triggering local states of emergency and highway closures.",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80",
    biasLeft: 27,
    biasCenter: 33,
    biasRight: 40,
    sourcesCount: 17,
    author: "Liam O'Connor",
    publishedDate: "May 20, 2026",
    readTime: "8 min read",
    paragraphs: [
      "Aggressive wildfire activity has forced thousands of residents to evacuate their homes across Western Canada as dry conditions and heavy winds accelerate blaze propagation.",
      "Local authorities have declared states of emergency in several municipalities, establishing temporary shelters and closing main highway routes due to visibility issues and encroaching flames.",
      "Firefighting crews from multiple provinces have deployed to assist local units, though dry weather patterns continue to limit containment progress.",
      "Meteorologists warn that seasonal temperature anomalies mean the risk of new flare-ups will remain elevated for the next several weeks."
    ],
    highlights: [
      "Expanding wildfires have triggered evacuations and states of emergency in Western Canada.",
      "Dry conditions and strong winds are accelerating the spread of the blazes.",
      "Emergency services have shut down major roadways and opened shelters for evacuees.",
      "Firefighters from neighboring regions have arrived to support containment efforts."
    ],
    relatedIds: ["1", "4", "5", "9", "11"]
  },
];
