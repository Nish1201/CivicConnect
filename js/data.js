/**
 * CivicConnect — Shared Platform Data (js/data.js)
 * Six community challenges at different workflow stages.
 * Not every problem has a proposal, partner support, or active case.
 *
 * Current student-team session for the Student Dashboard: K. Patil & Team (SP-101).
 */

const CURRENT_STUDENT_TEAM = {
  proposalId: "SP-101",
  student: "K. Patil & Team",
  university: "DY Patil College of Engineering, Kolhapur"
};

/** Alias for code that only needs the proposal ID. */
const CURRENT_STUDENT_PROPOSAL_ID = CURRENT_STUDENT_TEAM.proposalId;

const SAMPLE_PROBLEMS = [
  {
    id: "CC-001",
    slug: "borewell-water-silt",
    title: "Our borewell water becomes dirty during the monsoon",
    location: "Kolhapur, Maharashtra",
    state: "Maharashtra",
    district: "Kolhapur",
    category: "Water",
    status: "Exploring",
    coordinates: [16.7050, 74.2433],
    priority: "Critical",
    severity: "High",
    peopleAffected: 850,
    riskLevel: "High",
    reportedDaysAgo: 45,
    priorityReason: "High turbidity spikes and contamination risks during monsoon surges affecting about 850 daily consumers across residential lanes and a childcare centre.",
    shortDescription: "During heavy rains our shared borewell water turns muddy and smells unpleasant. Families wait weeks for lab tests, and costly filters clog quickly, so we have no timely way to check or treat the water.",
    fullDescription: "Residents and a nearby daycare rely on shared borewells for drinking water. During the monsoon, runoff and rapid aquifer recharge wash fine silt, iron traces, and microbial contaminants into shallow borewells, leaving reddish muddy water with an unpleasant odour. Commercial filters clog under heavy silt loads and are expensive for collective upkeep, while central laboratory tests take weeks. There is a clear opportunity for affordable, maintainable point-of-use treatment together with simple, timely community water-quality checks that people can use locally.",
    affectedGroup: "Around 180 resident households (approx. 850 individuals) and a nearby community daycare centre.",
    duration: "Occurs each year during the peak monsoon months; reported 45 days ago.",
    possibleAreas: [
      "Low-cost multi-stage modular filtration combining graded river sand, coconut shell biochar, and coarse gravel with manual backwash.",
      "Visual colourimetric paper indicators and simple optical turbidity gauges for community water checks.",
      "Community-managed silt traps and bio-swale diversion berms to filter runoff before aquifer infiltration."
    ]
  },
  {
    id: "CC-002",
    slug: "vegetable-spoilage-storage",
    title: "Farmers in our area lose vegetables because there is no affordable storage nearby",
    location: "Bangalore Rural, Karnataka",
    state: "Karnataka",
    district: "Bangalore Rural",
    category: "Agriculture",
    status: "Exploring",
    coordinates: [12.9716, 77.5946],
    priority: "High",
    severity: "High",
    peopleAffected: 320,
    riskLevel: "High",
    reportedDaysAgo: 38,
    priorityReason: "Severe crop losses within 24–36 hours of harvest due to lack of affordable local pre-cooling, affecting about 320 smallholder farmers across four village clusters.",
    shortDescription: "Leafy greens and tomatoes wilt within a day of harvest. Cold stores are far away and costly, so growers sell at distress prices or discard produce before it reaches market.",
    fullDescription: "Smallholder farmers harvesting leafy greens, tomatoes, and gourds must sell within hours of picking or face wilting in high ambient heat. Conventional cold storage is distant, designed for large aggregators, and too expensive for village groups. Without affordable farm-gate storage or cooling, growers accept distress prices or lose produce on the road. Decentralised, passive or solar-assisted micro-cooling using local materials could extend shelf life by several days and protect farm incomes where conventional cold-chain access is difficult.",
    affectedGroup: "Smallholder vegetable growers (approx. 320 farming individuals) across neighbouring farm clusters.",
    duration: "Persistent challenge during summer and pre-monsoon heat waves; reported 38 days ago.",
    possibleAreas: [
      "Double-walled zero-energy cool chambers constructed with regional porous brick, moist sand, and natural ventilation.",
      "Solar-assisted mini evaporative chillers with bio-composite insulation from agricultural waste.",
      "Ventilated, reusable moisture-retaining harvest crates with evaporative liners for post-harvest transit."
    ]
  },
  {
    id: "CC-003",
    slug: "rural-school-science-kits",
    title: "Our school does not have enough science and maths equipment for practical learning",
    location: "Kargil, Ladakh",
    state: "Ladakh",
    district: "Kargil",
    category: "Education",
    status: "New",
    coordinates: [34.5539, 76.1349],
    priority: "Medium",
    severity: "Medium",
    peopleAffected: 220,
    riskLevel: "Medium",
    reportedDaysAgo: 60,
    priorityReason: "Limited tactile laboratory learning for about 220 secondary students before state examinations, with moderate educational risk.",
    shortDescription: "Students learn science mostly from blackboard diagrams. Commercial kits are expensive, fragile, and hard to repair or restock when winter roads close.",
    fullDescription: "Government secondary schools in remote alpine valleys serve students from isolated hamlets. Teachers cover physics, chemistry, and biology, but students rarely use real apparatus. Commercial science kits are costly, delicate, difficult to repair locally, and hard to restock during winter closures. Affordable, durable, modular STEM resources built from open designs and locally available materials would support practical learning without depending on fragile imported kits.",
    affectedGroup: "Over 220 secondary school students and teachers in the village cluster.",
    duration: "Ongoing challenge across recent academic sessions; reported 60 days ago.",
    possibleAreas: [
      "Modular optics, electronics, and mechanics experiment boxes from recycled materials and standard hardware.",
      "Low-cost 3D-printable or laser-cut smartphone microscopes for water and plant biology.",
      "Curriculum-aligned guidebooks in local languages with hands-on demonstration models."
    ]
  },
  {
    id: "CC-004",
    slug: "drain-blockage-waste",
    title: "Waste keeps getting into the open drain near our neighbourhood",
    location: "Roorkee, Uttarakhand",
    state: "Uttarakhand",
    district: "Roorkee",
    category: "Sanitation",
    status: "New",
    coordinates: [29.8543, 77.8880],
    priority: "Medium",
    severity: "Medium",
    peopleAffected: 450,
    riskLevel: "Medium",
    reportedDaysAgo: 22,
    priorityReason: "Open drain choking, foul odours, and monsoon backflow affecting about 450 bazaar shoppers, vendors, and nearby lane residents.",
    shortDescription: "Market waste and vegetable scraps fall into the open drain. The lane floods in the rains, smells foul, and municipal machines cannot enter the narrow alley.",
    fullDescription: "In congested bazaar lanes, daily market operations produce vegetable waste, packaging, and organic scrap. Without accessible segregation points, debris enters narrow open stormwater drains. Decaying matter creates sludge, pests, and monsoon overflow onto pedestrian alleys. Municipal machinery cannot navigate these lanes. Community-scale interception, better segregation, and local collection could keep waste out of drains and reduce recurring blockages.",
    affectedGroup: "Local bazaar shopkeepers, pedestrians, and nearby street residents (approx. 450 people).",
    duration: "Observed consistently over recent weeks; reported 22 days ago.",
    possibleAreas: [
      "Gravity-assisted removable drain catch grates with debris barriers and silt trays.",
      "Decentralised aerobic composting for marketplace vegetable and fruit trimmings.",
      "Modular lane collection carts and colour-coded sorting receptacles for tight alleys."
    ]
  },
  {
    id: "CC-005",
    slug: "health-centre-access-ramps",
    title: "It is difficult for wheelchair users to enter the local health centre",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    district: "Pune",
    category: "Accessibility",
    status: "Exploring",
    coordinates: [18.5204, 73.8567],
    priority: "Critical",
    severity: "High",
    peopleAffected: 620,
    riskLevel: "High",
    reportedDaysAgo: 55,
    priorityReason: "Severe access barriers and fall hazards on clinic entrance steps for about 620 elderly and mobility-impaired patients, unresolved for 55 days.",
    shortDescription: "Steep broken steps and uneven paths block elderly and wheelchair users from entering the older health centre. Full rebuilding is hard and expensive.",
    fullDescription: "The rural Primary Health Centre serves outpatient clinics, maternal care, and immunisations for villages in a wide radius. The older building sits on a high masonry plinth with steep, irregular stone steps and no wheelchair access. Structural changes face legal and budget hurdles. Patients on stretchers or wheelchairs are often lifted by relatives up slippery steps. Modular, adaptable, low-cost access improvements—such as demountable ramps and safer approach paths—could restore dignified access without full reconstruction.",
    affectedGroup: "Elderly patients, persons with disabilities, expectant mothers, and clinic staff (approx. 620 regular visitors).",
    duration: "Ongoing accessibility issue since construction; reported 55 days ago.",
    possibleAreas: [
      "Lightweight modular aluminium/steel interlocking access ramps meeting universal gradient guidelines.",
      "Continuous dual handrails with solar-powered step illumination and tactile ground markers.",
      "Interlocking permeable paver pathways that smooth transitions over uneven terrain."
    ]
  },
  {
    id: "CC-006",
    slug: "terracotta-pottery-transit",
    title: "Our pottery gets damaged while being transported to customers",
    location: "Gargoti, Maharashtra",
    state: "Maharashtra",
    district: "Kolhapur",
    category: "Rural Livelihoods",
    status: "New",
    coordinates: [16.3150, 74.1350],
    priority: "Low",
    severity: "Low",
    peopleAffected: 140,
    riskLevel: "Low",
    reportedDaysAgo: 15,
    priorityReason: "High breakage rates in transport threatening livelihood margins for about 35 artisan families, with low acute safety hazard and recent report date.",
    shortDescription: "Handmade earthenware cracks on rough roads to weekly markets. Straw packing shifts during the trip, and commercial foam packing is too costly for artisan families.",
    fullDescription: "Artisan potters produce fragile earthenware coolers, cookware, and ceremonial terracotta. Goods travel on tractor trailers and three-wheelers over unpaved roads to regional weekly markets. Loose straw packing settles during vibration and causes cracks, while commercial bubble wrap and foam are unaffordable and environmentally harmful. Affordable protective packaging and transit frames from local or recyclable materials could reduce breakage and protect rural artisan livelihoods.",
    affectedGroup: "Approximately 35 artisan families (approx. 140 individuals) relying on pottery.",
    duration: "Persistent problem during weekly market supply trips; reported 15 days ago.",
    possibleAreas: [
      "Molded cushioning inserts from agricultural waste (rice husk, bagasse, and natural starch binders).",
      "Modular stackable bamboo or timber crate frameworks with tensioned suspension straps.",
      "Loading and vibration-damping guides tailored for rural three-wheelers and carts."
    ]
  }
];

/**
 * Student Solution Proposals
 * Not every problem has a proposal. Different teams submit different proposals.
 *
 * Stages represented:
 * - CC-001 → SP-101 → SR-201 → AC-001 (accepted + partner + implementing)
 * - CC-002 → SP-102 → SR-202 → AC-002 (partner connected, early implementation)
 * - CC-005 → SP-104 (admin review only; no partner collaboration yet)
 * - CC-003, CC-004, CC-006: reported / under review, no proposal yet
 */
const SAMPLE_STUDENT_PROPOSALS = [
  {
    id: "SP-101",
    problemId: "CC-001",
    problemTitle: "Our borewell water becomes dirty during the monsoon",
    solutionTitle: "Modular Multi-Stage Sand & Biochar Tap Filter with Rapid Colorimetric Indicator",
    student: "K. Patil & Team",
    university: "DY Patil College of Engineering, Kolhapur",
    status: "Accepted",
    stepIndex: 3,
    date: "24 Sep 2026",
    teamSize: 4,
    approach: "Gravity-fed multi-stage filtration with colorimetric indicator strips",
    description: "A gravity-fed multi-stage filtration unit using regional gravel, river sand, and activated coconut biochar, paired with low-cost visual indicator strips to verify turbidity below 5 NTU.",
    detailedPlan: "The team engineered a 3-chamber cylindrical filtration module that mounts directly to shared borewell stands. Stage 1 captures coarse silt (>40 microns); Stage 2 uses activated coconut biochar to adsorb chemical residues and odor; Stage 3 uses fine quartz sand and slow sand bio-layer for bacterial reduction. An integrated visual indicator allows villagers to verify clarity before consumption.",
    requestedSupport: "Field testing equipment (calibrated NTU meter) and lab verification support from regional water testing facilities."
  },
  {
    id: "SP-102",
    problemId: "CC-002",
    problemTitle: "Farmers in our area lose vegetables because there is no affordable storage nearby",
    solutionTitle: "Zero-Electricity Evaporative Cooling Chamber with Bio-Composite Insulation",
    student: "AgriTech Innovation Lab",
    university: "University of Agricultural Sciences (UAS), Bangalore",
    status: "Shortlisted",
    stepIndex: 2,
    date: "18 Sep 2026",
    teamSize: 5,
    approach: "Double-walled evaporative cooling with agricultural waste insulation",
    description: "A 150kg modular cool chamber using porous clay bricks, wet sand, and agricultural husk insulation panels, lowering chamber temperature by 8-12°C passively.",
    detailedPlan: "The chamber utilizes double porous brick walls filled with saturated coarse river sand. A passive solar updraft chimney draws air through wet mesh, maintaining relative humidity at 85-90% and temperature 10-12°C below ambient without electrical power. Tested to preserve leafy vegetables for 5-7 days.",
    requestedSupport: "Material sponsorship for trial chamber construction and coordination with local farmer producer collectives."
  },
  {
    id: "SP-104",
    problemId: "CC-005",
    problemTitle: "It is difficult for wheelchair users to enter the local health centre",
    solutionTitle: "Modular Rapid-Deployment Universal Access Ramp with Dual Handrails",
    student: "Department of Civil Engineering",
    university: "COEP Technological University, Pune",
    status: "Under Review",
    stepIndex: 1,
    date: "28 Sep 2026",
    teamSize: 4,
    approach: "Interlocking non-invasive modular structural steel & perforated aluminum ramp",
    description: "Pre-engineered, bolt-together gradient ramp (1:12 slope) with perforated slip-resistant decking, continuous dual handrails, and tactile paving.",
    detailedPlan: "A demountable system that anchors without damaging historic masonry plinths. Adjustable leveling legs accommodate uneven terrain. Includes tactile guidance strips at entrance transitions and solar-phosphorescent safety edges.",
    requestedSupport: "Fabrication workshop access, structural testing certification, and micro-grant for aluminum materials."
  }
];

/**
 * Partner Support Offers
 * Only some proposals have partner collaboration.
 * Connected & Supporting = active partner collaboration.
 * Offered = interest recorded, not yet a collaboration.
 */
const SAMPLE_SUPPORT_REQUESTS = [
  {
    id: "SR-201",
    problemId: "CC-001",
    problemTitle: "Our borewell water becomes dirty during the monsoon",
    proposalId: "SP-101",
    supportType: "Technical Validation & Lab Equipment",
    partnerCategory: "Technical Partner",
    organization: "WaterAid India Regional Technical Cell",
    status: "Connected & Supporting",
    date: "25 Sep 2026",
    description: "Providing calibrated digital turbidity testing meters, laboratory microbial test verification, and filtration flow rate optimization guidance for the student filtration pilot."
  },
  {
    id: "SR-202",
    problemId: "CC-002",
    problemTitle: "Farmers in our area lose vegetables because there is no affordable storage nearby",
    proposalId: "SP-102",
    supportType: "Materials & Farmer Trial Plot",
    partnerCategory: "Farmer Collective / FPO",
    organization: "Kisan Farmer Producer Organization (FPO)",
    status: "Connected & Supporting",
    date: "20 Sep 2026",
    description: "Providing village trial site access, masonry materials for trial chambers, and direct coordination with 60 local vegetable growers."
  },
  {
    id: "SR-204",
    problemId: "CC-005",
    problemTitle: "It is difficult for wheelchair users to enter the local health centre",
    proposalId: "SP-104",
    supportType: "CSR Micro-grant & Fabrication Support",
    partnerCategory: "CSR Foundation",
    organization: "Accessible India Civic Foundation",
    status: "Offered",
    date: "29 Sep 2026",
    description: "Offering a CSR grant of ₹35,000 for structural aluminum and safety handrail fabrication, alongside technical accessibility auditing."
  }
];

/**
 * Active Cases — only where proposal + partner support have progressed toward implementation.
 * Flagship chain: CC-001 → SP-101 → SR-201 → AC-001
 */
const SAMPLE_ACTIVE_CASES = [
  {
    id: "AC-001",
    problemId: "CC-001",
    problemTitle: "Our borewell water becomes dirty during the monsoon",
    location: "Kolhapur, Maharashtra",
    proposalId: "SP-101",
    proposalTitle: "Modular Multi-Stage Sand & Biochar Tap Filter with Rapid Colorimetric Indicator",
    team: "K. Patil & Team (DY Patil College of Engg)",
    studentTeam: "K. Patil & Team (DY Patil College of Engg)",
    supportId: "SR-201",
    partner: "WaterAid India Regional Technical Cell",
    partnerOrg: "WaterAid India Regional Technical Cell",
    supportType: "Technical Validation & Lab Equipment",
    stage: "In Progress",
    stageIndex: 3,
    lastUpdated: "03 Oct 2026",
    summary: "First modular filter unit mounted at community borewell #2; turbidity reduced from 42 NTU to 3.8 NTU during trial run."
  },
  {
    id: "AC-002",
    problemId: "CC-002",
    problemTitle: "Farmers in our area lose vegetables because there is no affordable storage nearby",
    location: "Bangalore Rural, Karnataka",
    proposalId: "SP-102",
    proposalTitle: "Zero-Electricity Evaporative Cooling Chamber with Bio-Composite Insulation",
    team: "AgriTech Innovation Lab (UAS Bangalore)",
    studentTeam: "AgriTech Innovation Lab (UAS Bangalore)",
    supportId: "SR-202",
    partner: "Kisan Farmer Producer Organization (FPO)",
    partnerOrg: "Kisan Farmer Producer Organization (FPO)",
    supportType: "Materials & Farmer Trial Plot",
    stage: "In Progress",
    stageIndex: 3,
    lastUpdated: "28 Sep 2026",
    summary: "Trial chamber foundation laid at village collection point; agricultural waste insulation panels prepared."
  }
];

function findProblemById(idOrSlug) {
  if (!idOrSlug) return null;
  const normalized = String(idOrSlug).trim().toLowerCase();
  return SAMPLE_PROBLEMS.find(p =>
    p.id.toLowerCase() === normalized ||
    (p.slug && p.slug.toLowerCase() === normalized)
  ) || null;
}

function findProposalById(id) {
  if (!id) return null;
  const normalized = String(id).trim().toLowerCase();
  return SAMPLE_STUDENT_PROPOSALS.find(p => p.id.toLowerCase() === normalized) || null;
}

function findSupportById(id) {
  if (!id) return null;
  const normalized = String(id).trim().toLowerCase();
  return SAMPLE_SUPPORT_REQUESTS.find(s => s.id.toLowerCase() === normalized) || null;
}

function findActiveCaseById(id) {
  if (!id) return null;
  const normalized = String(id).trim().toLowerCase();
  return SAMPLE_ACTIVE_CASES.find(c => c.id.toLowerCase() === normalized) || null;
}

function getDistinctStates() {
  const states = new Set();
  SAMPLE_PROBLEMS.forEach(p => {
    if (p.state) states.add(p.state);
  });
  return Array.from(states).sort();
}

function getDistrictsForState(state) {
  const districts = new Set();
  SAMPLE_PROBLEMS.forEach(p => {
    if (!state || state === 'all' || p.state.toLowerCase() === state.toLowerCase()) {
      if (p.district) districts.add(p.district);
    }
  });
  return Array.from(districts).sort();
}
