import { Question, Scholarship } from "./types";

export const CHEVENING_QUESTIONS: Record<string, Question> = {
  leadership: {
    key: "leadership",
    label: "Leadership and Influence",
    prompt:
      "Describe your leadership and influencing skills. What have you done to make a positive impact on others?",
    word_limit: 500,
    what_they_test:
      "Whether the applicant has genuinely led or influenced change, not just participated in a team's success. Strong answers show a specific action the applicant personally took that drove a concrete result -- driving change in a community or organisation, improving outcomes for others, solving a specific challenge, or implementing an idea with tangible impact.",
    common_weaknesses:
      "Describing a team achievement without isolating the applicant's own contribution; vague claims of 'leadership' without a specific story; no measurable or observable outcome; leadership framed only as holding a title/position rather than as action taken.",
  },
  networking: {
    key: "networking",
    label: "Networking / Relationship-Building",
    prompt:
      "Chevening values networking and building lasting relationships. Give an example of how you have built strong professional relationships and how this led to positive outcomes, and how you plan to use the Chevening network.",
    word_limit: 500,
    what_they_test:
      "Evidence the applicant builds working relationships deliberately and that those relationships produced a real, measurable outcome (not just 'I made friends'). Also whether they show a credible, specific plan for using the Chevening network during and after the scholarship, not a generic 'I will network with UK professionals' statement.",
    common_weaknesses:
      "Confusing socialising with strategic relationship-building; no measurable outcome from the relationship described; the 'how I'll use the Chevening network' portion is generic and could apply to any applicant.",
  },
  course: {
    key: "course",
    label: "Course and University Choice",
    prompt:
      "How will your chosen course help you address challenges linked to UK priority areas (growth and prosperity, climate resilience, security and stability, or inclusive development)?",
    word_limit: 500,
    what_they_test:
      "Real research into the specific first-choice course -- naming actual modules or areas of study and connecting them concretely to the applicant's background, career goals, and the impact they want to make. Should also connect to at least one UK priority theme (growth/prosperity, climate resilience, security/stability, or inclusive development).",
    common_weaknesses:
      "Generic praise of the university's 'prestige' or 'global ranking' instead of specific modules; no link between course content and the applicant's actual career plan; no connection to a UK priority area; could be copy-pasted onto a different course with minimal edits.",
  },
  career: {
    key: "career",
    label: "Career Plan",
    prompt:
      "How will your career plan support your ambitions to drive positive change, and how does it connect to UK and home-country priorities?",
    word_limit: 500,
    what_they_test:
      "A realistic, specific, and achievable post-study plan with distinct short-term, mid-term, and long-term goals that have measurable markers of success -- and a genuine, credible intent to return home and apply the degree there, connected to shared UK/home-country challenges.",
    common_weaknesses:
      "Vague ambition ('I want to contribute to development in my country') instead of a specific plan with named roles, organisations, or measurable milestones; no distinction between short/mid/long-term goals; plan reads as staying in the UK rather than returning home; no link between the master's degree and the stated goals.",
  },
};

export const SCHOLARSHIPS: Record<string, Scholarship> = {
  chevening: {
    key: "chevening",
    name: "Chevening Scholarship",
    status: "active",
    description:
      "The UK government's flagship global scholarship program for outstanding leaders.",
    tagline: "4 Core 500-word Essays",
    essay_count: 4,
    questions: CHEVENING_QUESTIONS,
  },
  mastercard: {
    key: "mastercard",
    name: "Mastercard Foundation Scholars",
    status: "coming_soon",
    description:
      "Developing transformative leaders across Africa through comprehensive education access and give-back commitment.",
    tagline: "Community Giveback & Transformative Leadership",
    essay_count: 3,
  },
  daad: {
    key: "daad",
    name: "DAAD Scholarships (Germany)",
    status: "coming_soon",
    description:
      "German Academic Exchange Service grants for development-related postgraduate courses (EPOS).",
    tagline: "Letter of Motivation & Study Plan",
    essay_count: 2,
  },
  commonwealth: {
    key: "commonwealth",
    name: "Commonwealth Scholarship",
    status: "coming_soon",
    description:
      "For talented individuals from Commonwealth nations to gain knowledge and skills required for sustainable development.",
    tagline: "Development Impact & Research Proposal",
    essay_count: 4,
  },
  fulbright: {
    key: "fulbright",
    name: "Fulbright Foreign Student Program",
    status: "coming_soon",
    description:
      "US Department of State flagship exchange program for graduate studies and research.",
    tagline: "Study/Research Objectives & Personal Statement",
    essay_count: 2,
  },
  erasmus: {
    key: "erasmus",
    name: "Erasmus Mundus Joint Masters",
    status: "coming_soon",
    description:
      "High-level integrated international study programs across multiple European universities.",
    tagline: "Statement of Purpose & Academic Motivation",
    essay_count: 1,
  },
};

export const QUESTIONS = CHEVENING_QUESTIONS;

export const WINNING_ESSAYS: Record<string, string[]> = {
  leadership: [
    `Growing up in northeast Nigeria, the hot-sit of the ongoing Boko Haram crisis, I have seen how people are suffering from various adverse impacts of the crisis and climate change, including destruction of schools, flood, poverty, and hunger, which forced millions of mothers with their children to flee from their homes. In 2021, UNICEF reported that the "Boko Haram crisis displaced 2.8 million children from schools in northeast Nigeria", affecting the fulfilment of SDG 4. These troubling circumstances motivated me to take on leadership roles to create positive changes in my community.

Maltumba is a crisis-affected remote village in Yobe State, northeast Nigeria, where access to education was a distant luxury, especially for girls. In January 2021, as a program coordinator at the Child Shield Initiative, I coordinated and led a team of 5 volunteers to survey and interview 500 school-aged children out of school, together with the community members and leaders about their interests in education; the result was positive. Thus, I influenced the village head to convert 3 rooms in his palace into classrooms. I further recruited and trained 10 volunteer facilitators and enrolled 150 pupils. Despite initial setbacks, 61% of the enrolled pupils dropped out one month later. To address this issue, I met with their parents and the village head, discovering that the children were dropped out due to economic pressures. After days of struggles, I amended the program to evening and convinced the parents to re-enroll the children, allowing them to learn and support their parents simultaneously.

To provide them with sustainable sources of income, I collaborated with Mr Abdulrazak, an agribusiness expert to train 250 women in rearing fishes and chickens, sustainable farming, and direct selling of local-made agriproducts. Upon completing the training, I lobbied 5 business leaders to provide them with interest-free loans, leading to a 80% increase in their monthly earnings, fulfilling the educational needs of their children. As a result, I registered 213 pupils in the program and influenced 4 public primary schools in the surrounding communities to freely enroll them, with 70% girls and children with disabilities and post-conflict-stress disorders, leading to approximately 33% decrease in out-of-school children and dramatically reduced inequalities in Maltumba.

In 2022, while serving as an education officer at Government Secondary School (GSS), Daura, a rural public school in Yobe State, I discovered that about 80% of newly enrolled students lacked basic literacy, making both teaching and learning challenging. Therefore, I organised a two-month-intensive camp and influenced 6 of my teaching colleagues to volunteer. Thereafter, I launched a series of fundraising campaigns to support the program, securing approximately £1,300 and some foodstuffs and learning books. Then, I convinced my principal to allocate us the school library and 4 classrooms, where we trained 200 students, with 63% achieving fluency in reading and writing. This initiative enhanced the participants performance by about 58% and significantly improved our education outcome.

Winning the Chevening scholarship will hone my leadership and influencing skills to address grand challenges in my community.`,
  ],
  networking: [
    `Being an agent of change, I always find building relationship to be a catalyst in my personal and professional endeavors. Joining Green Africa, Young African Leaders Initiatives (YALI) Network, and Climate Change Action Nigeria (CCAN), allowed me to hone my relationship-building skills, train on civic management and servant leaderships and network, share ideas and collaborate with like-minded young leaders and experts across Sub-Saharan Africa to address pressing issues facing my community.

In 2021, I utilized my effective networking skills to provide sustainable solutions to long-term water scarcity in my school, GSS Daura, where students walked about 3 kilometers daily to fetch water from contaminated rivers and streams, leading to high rates of school absenteeism and waterborne illnesses. I collaborated with the school management, and 5 WASH experts, who I met during the 2019 YALI West Africa Regional Emerging Leaders Program in Accra, Ghana, to discuss how to address the issue. Together, we brainstormed ideas, wrote grant proposals to various NGOs, and ran a series of advocacy campaigns. In three months, we partnered with Ummaty International Charity Foundation and Wadata Relief Care Initiative, installing a solar-powered borehole and two hand-wash pumps. This collaborative effort provides about 2,000 students and locals from the surrounding rural communities with daily access to portable drinking water, which reduced waterborne disease cases by 44%, and increased school attendance rate by 51%.

Moreover, seeing how crisis, global warming and climate change created challenges for our teaching and learning environment, I launched a campaign called "Schools Go Green", aiming to promote sustainability and climate action in public schools in Yobe State in 2022. Firstly, I partnered with 3 climate experts from Green Africa to develop the campaign blueprint and flyers, and then lobbied my school principal to serve as my project partner, connecting me with the school's planning director at the Yobe State Ministry of Education. After months of effort, I influenced the director to mandate establishment of Climate Clubs in all 67 of Yobe's secondary schools. I further collaborated with CCAN to organize a series of workshops and webinars, educating about 9,000 students and staff on climate change causes, effects and solutions. We inspired students to plant 15,000+ improved trees across 16 marginalized and dilapidated public schools. Today, the club has 3,000+ members and 4,000+ new students are educated on climate change annually. The ministry awarded me an honorary community service award.

Finally, I hope to join the Chevening Nigeria Alumni Association (CNAA) to promote clean energy access, climate actions, and girls' STEM education in marginalized and crisis-affected areas in Nigeria. I also aspire to mentor prospective Chevening scholars and become a Chevening social media ambassador. The Chevening Scholarship will allow me to connect with like-minded Chevening scholars, academics, and professionals in the energy sector globally to address Nigeria's energy and climate crisis.`,
  ],
  course: [
    `Despite the combined efforts of investment partners, especially the UK, the lack of access to clean, affordable, and sustainable energy remains persistent in Nigeria. In 2020, the World Bank reported that approximately 47% of Nigeria's population have no access to electricity. This challenge, combined with the Boko Haram insurgency and climate-change-caused disasters, has posed critical challenges such as industrial collapse, food insecurity, poverty, and unemployment among millions of Nigerians. Innovative and radical approaches to energy production must be implemented at all stages if Nigeria is to achieve its Paris Climate Agreement commitments and SDGs 7 and 13. This motivated me to study in the UK to learn from its innovative solutions, policies, and strategies.

My first choice is MSc Sustainable Energy at the University of Glasgow, because of its newly established Centre for Sustainable Energy, which offers world-class researchers and facilities to conduct my thesis on designing smart hybrid-grid power systems for rural applications in Nigeria. The Energy Conversion Systems and Renewable and Sustainable Energy modules will provide me with the expertise to design, develop, and manage advanced renewable power and sustainable energy systems to achieve net-zero carbon emissions in my country.

My second choice, MSc Renewable Energy at Cranfield University, offers the Solar Energy Engineering module and the opportunity to conduct research under Professor Chris Sansom, a world-renowned researcher in concentrating solar power. This will equip me with hands-on practical and research skills in designing cost-effective, decentralized solar power, heating and cooling systems for marginalized areas in Nigeria. The Energy Economics and Policy module will give me the skills to create innovative policies and regulatory frameworks, set up carbon pricing mechanisms, and scale up interventions to improve energy efficiency in buildings and industries in Nigeria.

My third choice, the Sustainable Energy Systems master's at the University of Edinburgh, offers modules including Solar Energy and Photovoltaic Systems and Energy Storage and Distribution, which will furnish me with skills to develop advanced energy storage devices for crisis-affected areas and conduct cutting-edge research on solar power plant design, operation and management.

The Chevening scholarship will grant me the opportunity to foster international collaborations with world-leading energy researchers, industries, and policymakers in the UK to promote sustainable energy development in Nigeria.`,
  ],
  career: [
    `Within 4 years of my return, I plan to join the Rural Electrification Agency of Nigeria as a renewable energy engineer to contribute to developing innovative policies and strategies that promote inclusive energy transition, climate neutrality, and sustainable energy practice. I will partner with the CNAA and FCDO to lobby policymakers and stakeholders to increase investment in sustainable energy research and businesses in underserved areas of Nigeria. I will also collaborate with like-minded Chevening alumni and NGOs to raise climate change awareness, advocate for sustainable energy practices, and promote girls' STEM education in crisis-affected areas in northeast Nigeria.

In 5-10 years, I intend to pursue a Ph.D. in sustainable power systems. Thereafter, I will join a Nigerian university as a lecturer, contributing to teaching and research that provides government and policymakers with evidence-based mini-grid regulatory frameworks. I aspire to establish my own research group focused on cost-effective smart hybrid-grid systems and decentralized solar power systems for rural applications, and to establish a partnership between Nigerian energy research centres and the Centre for Sustainable Energy at the University of Glasgow, training 10,000 young researchers and professionals on rural electrification by 2040.

In 11-20 years, I see myself as a renowned renewable energy professor and Nigeria's Federal Minister of Power, collaborating with the FCDO and UK counterparts to foster international energy policy exchange. Despite Northern Nigeria having strong solar radiation potential, 76% of its population still lack access to electricity. I will partner with international development partners to establish solar power generation farms in northeast Nigeria, providing 20 million households with access to affordable and clean energy by 2050.

The Chevening scholarship will provide me with exceptional opportunities to network with prominent donors and like-minded individuals to reduce energy poverty and inequality, boost economic productivity, promote decent STEM education and mitigate climate change, leading to Nigeria's attainment of SDGs 4, 7, 10 and 13.`,
  ],
};

export function buildSystemPrompt(qkey: string, scholarshipKey: string = "chevening"): string {
  const scholarship = SCHOLARSHIPS[scholarshipKey] || SCHOLARSHIPS.chevening;
  const questionsMap = scholarship.questions || CHEVENING_QUESTIONS;
  const q = questionsMap[qkey] || CHEVENING_QUESTIONS[qkey];
  if (!q) throw new Error(`Unknown question key: ${qkey}`);

  const refs = WINNING_ESSAYS[qkey] || [];
  const refBlock =
    refs.length > 0
      ? `\nBENCHMARK REFERENCE ESSAYS (Winning Application Quality):\nUse these ONLY as examples of winning evidence density, structure, and clarity.\n${refs
          .map((e, i) => `Reference essay ${i + 1}:\n${e}`)
          .join("\n\n---\n\n")}\n`
      : "";

  return `You are an expert scholarship reading-committee evaluator and coach for the ${scholarship.name} giving balanced, objective assessment feedback to an applicant.

QUESTION: ${q.prompt}
WORD LIMIT: ${q.word_limit} words.

CORE ASSESSMENT CRITERIA:
${q.what_they_test}

COMMON PITFALLS TO WATCH FOR:
${q.common_weaknesses}
${refBlock}
SCORING CALIBRATION SCALE (Be objective -- reward genuine quality, do not artificially suppress scores):
• 9-10 (Winning / Shortlist Standard): Highly compelling, demonstrates strong personal agency, concrete measurable results/metrics, distinct narrative voice, and directly aligns with all prompt objectives.
• 7-8 (Competitive / Strong Applicant): Solid evidence, clear personal role, well-structured, minor areas for refinement or deeper specificity.
• 5-6 (Developing Draft): General claims without sufficient personal evidence, passive storytelling, or vague outcomes.
• 1-4 (Weak / Incomplete): Off-topic, generic, or lacking core criteria.

CRITERIA SCORING (1-5 per criterion):
• 5 = Outstanding / Benchmark quality
• 4 = Strong, well-supported evidence
• 3 = Competent, needs more specificity
• 2 = Weak / under-developed
• 1 = Missing / unsatisfactory

COACHING GUIDELINES:
1. Objectively evaluate against the rubric: If the applicant demonstrates strong personal impact and concrete examples, award the appropriate 8-10 score.
2. Identify both strong anchors (what to keep) and high-value areas for refinement.
3. Diagnostic only: Never write replacement sentences or generated draft text for the applicant. Describe what a stronger version would demonstrate.

Return ONLY valid JSON matching this schema:
{
  "overall_score": <integer 1-10>,
  "criteria": [
    {"name": "<criterion name>", "score": <integer 1-5>, "note": "<objective 1-2 sentence assessment>"}
  ],
  "top_suggestions": [
    "<actionable suggestion to elevate the essay further>"
  ],
  "line_notes": [
    {"quote": "<exact short phrase from essay, max ~15 words>", "note": "<insight on why this is strong or how to sharpen it — 2 to 3 sentences>"}
  ]
}`;
}
