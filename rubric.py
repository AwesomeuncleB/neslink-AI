"""
Rubric grounded in Chevening's official application criteria
(https://www.chevening.org/resource-hub/guidance/application-criteria/).

Each question maps to what Chevening's reading committees actually score.
Word limit defaults to 500 (Chevening's current standard) but you can
override per question below if a given cycle differs.
"""

SCHOLARSHIPS = {
    "chevening": {
        "name": "Chevening Scholarship",
        "status": "available",
        "description": "UK government's global scholarship programme for future leaders",
    },
    "rhodes": {
        "name": "Rhodes Scholarship",
        "status": "coming_soon",
        "description": "Postgraduate award at the University of Oxford",
        "essay_types": ["Personal Statement", "Academic Statement"],
    },
    "fulbright": {
        "name": "Fulbright Scholarship",
        "status": "coming_soon",
        "description": "U.S. government flagship international exchange program",
        "essay_types": ["Statement of Grant Purpose", "Personal Statement"],
    },
    "commonwealth": {
        "name": "Commonwealth Scholarship",
        "status": "coming_soon",
        "description": "UK scholarship for citizens of Commonwealth countries",
        "essay_types": ["Personal Statement", "Study Plan", "Impact Statement"],
    },
    "mastercard": {
        "name": "Mastercard Foundation Scholars Program",
        "status": "coming_soon",
        "description": "Scholarship for students from Africa",
        "essay_types": ["Personal Statement", "Leadership Essay", "Community Impact Essay"],
    },
}

QUESTIONS = {
    "leadership": {
        "label": "Leadership and Influence",
        "prompt": "Describe your leadership and influencing skills. What have you done to make a positive impact on others?",
        "word_limit": 500,
        "what_they_test": (
            "Whether the applicant has genuinely led or influenced change, not just "
            "participated in a team's success. Strong answers show a specific action "
            "the applicant personally took that drove a concrete result -- driving "
            "change in a community or organisation, improving outcomes for others, "
            "solving a specific challenge, or implementing an idea with tangible impact."
        ),
        "common_weaknesses": (
            "Describing a team achievement without isolating the applicant's own "
            "contribution; vague claims of 'leadership' without a specific story; "
            "no measurable or observable outcome; leadership framed only as holding "
            "a title/position rather than as action taken."
        ),
        "scholarship": "chevening",
    },
    "networking": {
        "label": "Networking / Relationship-Building",
        "prompt": "Chevening values networking and building lasting relationships. Give an example of how you have built strong professional relationships and how this led to positive outcomes, and how you plan to use the Chevening network.",
        "word_limit": 500,
        "what_they_test": (
            "Evidence the applicant builds working relationships deliberately and that "
            "those relationships produced a real, measurable outcome (not just 'I made "
            "friends'). Also whether they show a credible, specific plan for using the "
            "Chevening network during and after the scholarship, not a generic 'I will "
            "network with UK professionals' statement."
        ),
        "common_weaknesses": (
            "Confusing socialising with strategic relationship-building; no measurable "
            "outcome from the relationship described; the 'how I'll use the Chevening "
            "network' portion is generic and could apply to any applicant."
        ),
        "scholarship": "chevening",
    },
    "course": {
        "label": "Course and University Choice",
        "prompt": "How will your chosen course help you address challenges linked to UK priority areas (growth and prosperity, climate resilience, security and stability, or inclusive development)?",
        "word_limit": 500,
        "what_they_test": (
            "Real research into the specific first-choice course -- naming actual "
            "modules or areas of study and connecting them concretely to the "
            "applicant's background, career goals, and the impact they want to make. "
            "Should also connect to at least one UK priority theme (growth/prosperity, "
            "climate resilience, security/stability, or inclusive development)."
        ),
        "common_weaknesses": (
            "Generic praise of the university's 'prestige' or 'global ranking' instead "
            "of specific modules; no link between course content and the applicant's "
            "actual career plan; no connection to a UK priority area; could be copy-"
            "pasted onto a different course with minimal edits."
        ),
        "scholarship": "chevening",
    },
    "career": {
        "label": "Career Plan",
        "prompt": "How will your career plan support your ambitions to drive positive change, and how does it connect to UK and home-country priorities?",
        "word_limit": 500,
        "what_they_test": (
            "A realistic, specific, and achievable post-study plan with distinct "
            "short-term, mid-term, and long-term goals that have measurable markers "
            "of success -- and a genuine, credible intent to return home and apply the "
            "degree there, connected to shared UK/home-country challenges."
        ),
        "common_weaknesses": (
            "Vague ambition ('I want to contribute to development in my country') "
            "instead of a specific plan with named roles, organisations, or "
            "measurable milestones; no distinction between short/mid/long-term goals; "
            "plan reads as staying in the UK rather than returning home; no link "
            "between the master's degree and the stated goals."
        ),
        "scholarship": "chevening",
    },
}

# Paste your winning/reference essays here, one entry per question key above.
# These are used ONLY as illustrative reference points for the model (e.g. "here's
# how a strong essay demonstrated X") -- never shown to the applicant, and the model
# is explicitly instructed not to reward similarity/mimicry of these essays.
#
# Currently seeded with 2 winning applicants:
#   - Shuaibu Babagana (2024/2025) -- education access / renewable energy, Yobe State
#   - Nasir Yusuf -- public health / maternal mortality, Kaduna State
# Add more as you collect them; each question list can hold several essays.

WINNING_ESSAYS = {
    "leadership": [
        """Growing up in northeast Nigeria, the hot-sit of the ongoing Boko Haram crisis, I have seen how people are suffering from various adverse impacts of the crisis and climate change, including destruction of schools, flood, poverty, and hunger, which forced millions of mothers with their children to flee from their homes. In 2021, UNICEF reported that the "Boko Haram crisis displaced 2.8 million children from schools in northeast Nigeria", affecting the fulfilment of SDG 4. These troubling circumstances motivated me to take on leadership roles to create positive changes in my community.

Maltumba is a crisis-affected remote village in Yobe State, northeast Nigeria, where access to education was a distant luxury, especially for girls. In January 2021, as a program coordinator at the Child Shield Initiative, I coordinated and led a team of 5 volunteers to survey and interview 500 school-aged children out of school, together with the community members and leaders about their interests in education; the result was positive. Thus, I influenced the village head to convert 3 rooms in his palace into classrooms. I further recruited and trained 10 volunteer facilitators and enrolled 150 pupils. Despite initial setbacks, 61% of the enrolled pupils dropped out one month later. To address this issue, I met with their parents and the village head, discovering that the children were dropped out due to economic pressures. After days of struggles, I amended the program to evening and convinced the parents to re-enroll the children, allowing them to learn and support their parents simultaneously.

To provide them with sustainable sources of income, I collaborated with Mr Abdulrazak, an agribusiness expert to train 250 women in rearing fishes and chickens, sustainable farming, and direct selling of local-made agriproducts. Upon completing the training, I lobbied 5 business leaders to provide them with interest-free loans, leading to a 80% increase in their monthly earnings, fulfilling the educational needs of their children. As a result, I registered 213 pupils in the program and influenced 4 public primary schools in the surrounding communities to freely enroll them, with 70% girls and children with disabilities and post-conflict-stress disorders, leading to approximately 33% decrease in out-of-school children and dramatically reduced inequalities in Maltumba.

In 2022, while serving as an education officer at Government Secondary School (GSS), Daura, a rural public school in Yobe State, I discovered that about 80% of newly enrolled students lacked basic literacy, making both teaching and learning challenging. Therefore, I organised a two-month-intensive camp and influenced 6 of my teaching colleagues to volunteer. Thereafter, I launched a series of fundraising campaigns to support the program, securing approximately £1,300 and some foodstuffs and learning books. Then, I convinced my principal to allocate us the school library and 4 classrooms, where we trained 200 students, with 63% achieving fluency in reading and writing. This initiative enhanced the participants performance by about 58% and significantly improved our education outcome.

Winning the Chevening scholarship will hone my leadership and influencing skills to address grand challenges in my community.""",
        """As the elected President of The Nigerian Economics Students Association (NESA), 2019-2021, I implemented targeted programs focused on digital skills development, enhancing employability and income-generation opportunities for at least 1,000 department students. I inspire my co-founders to build a telemedicine organisation that provides quality health services to people living in rural communities. Currently, I am leading a six-month longitudinal facility assessment study to investigate operational readiness and data systems of primary health care (PHC) facilities in Kaduna State.

In 2019, when I was elected President, the Society faced many bottlenecks. Notable among them was the need for a website to connect students to global opportunities, and a lack of revenue to fund our projects. Outdated constitutions meant students didn't have relevant skills to analyze economic data. Within my first six months in office, between June and December 2021, I tackled NESA's bottlenecks through a strategic plan focusing on digitalization, revenue generation, capacity building, and constitution amendment. Using my networking skills, I secured €2,000 through corporate sponsorships to implement projects, including launching the first-ever NESA website, giving 1,000 students access to global opportunities, initiating a 7-day Data Science boot camp, and amending the constitution. That moment became a turning point for the subsequent students of economics who must go through that process according to the new law of the department.

Building on my success with NESA, I co-founded a telemedicine organization to extend access to health services in rural communities -- a critical step in my leadership journey toward social impact. On the 1st of July 2024, I led my team to the Pre-Incubation Innovation Hackathon at Cc-Hub in Lagos. The skills I gained were crucial in securing partnerships with two logistics firms, helping us serve over 500 citizens to date. Through my leadership, we won €1,000 to champion our mission of providing quality health services to people living in rural communities using telemedicine and predictive analytics to predict outbreaks in affected regions.

During the pilot testing for the longitudinal study in September 2024, the collected data were full of outliers. To solve this problem, I initiated a two-day workshop to train 45 data collectors and implemented a ground-truthing mechanism. These strategies decreased the outliers in the data by about 75% and increased data quality by 95%. By March 2025, the result of this study will be used to design, advocate, and implement policies addressing data system functionality, human resources absenteeism from primary healthcare centers, and supply chain gaps for essential medicine in Kaduna State.

As a thought leader, I influence over 5 million readers by writing about the importance of contemporary skills for economic empowerment, nurturing a mindset shift among Nigerian youth towards skill-based learning. Being a beneficiary of the Chevening scholarship will provide me the avenue to network with other global leaders who are impacting the lives of people in Nigeria through strategic investment in health and education.""",
    ],
    "networking": [
        """Being an agent of change, I always find building relationship to be a catalyst in my personal and professional endeavors. Joining Green Africa, Young African Leaders Initiatives (YALI) Network, and Climate Change Action Nigeria (CCAN), allowed me to hone my relationship-building skills, train on civic management and servant leaderships and network, share ideas and collaborate with like-minded young leaders and experts across Sub-Saharan Africa to address pressing issues facing my community.

In 2021, I utilized my effective networking skills to provide sustainable solutions to long-term water scarcity in my school, GSS Daura, where students walked about 3 kilometers daily to fetch water from contaminated rivers and streams, leading to high rates of school absenteeism and waterborne illnesses. I collaborated with the school management, and 5 WASH experts, who I met during the 2019 YALI West Africa Regional Emerging Leaders Program in Accra, Ghana, to discuss how to address the issue. Together, we brainstormed ideas, wrote grant proposals to various NGOs, and ran a series of advocacy campaigns. In three months, we partnered with Ummaty International Charity Foundation and Wadata Relief Care Initiative, installing a solar-powered borehole and two hand-wash pumps. This collaborative effort provides about 2,000 students and locals from the surrounding rural communities with daily access to portable drinking water, which reduced waterborne disease cases by 44%, and increased school attendance rate by 51%.

Moreover, seeing how crisis, global warming and climate change created challenges for our teaching and learning environment, I launched a campaign called "Schools Go Green", aiming to promote sustainability and climate action in public schools in Yobe State in 2022. Firstly, I partnered with 3 climate experts from Green Africa to develop the campaign blueprint and flyers, and then lobbied my school principal to serve as my project partner, connecting me with the school's planning director at the Yobe State Ministry of Education. After months of effort, I influenced the director to mandate establishment of Climate Clubs in all 67 of Yobe's secondary schools. I further collaborated with CCAN to organize a series of workshops and webinars, educating about 9,000 students and staff on climate change causes, effects and solutions. We inspired students to plant 15,000+ improved trees across 16 marginalized and dilapidated public schools. Today, the club has 3,000+ members and 4,000+ new students are educated on climate change annually. The ministry awarded me an honorary community service award.

Finally, I hope to join the Chevening Nigeria Alumni Association (CNAA) to promote clean energy access, climate actions, and girls' STEM education in marginalized and crisis-affected areas in Nigeria. I also aspire to mentor prospective Chevening scholars and become a Chevening social media ambassador. The Chevening Scholarship will allow me to connect with like-minded Chevening scholars, academics, and professionals in the energy sector globally to address Nigeria's energy and climate crisis.""",
        """Over time, my networking ability has been the fuel that powers my leadership journey, enabling me to convert ideas into tangible actions and overcome insurmountable challenges swiftly.

On February 19, 2019, during the Kaduna State Sustainable Developmental Goals Acceleration Conference, I met Dr. Muhammad Sani Dattijo, who was a speaker at the conference and had also served as a policy adviser to UN Secretary-General Ban Ki-Moon in 2016. Henceforth, I maintained communication with Dr. Dattijo by sending biweekly updates on NESA projects and volunteered to design three infographic reports for his planning and budget projects. In September 2021, my budget to fund my capital project as President of the Nigerian Economics Students Association was over €3,000, but we only had €353.57 in our coffers. With Dr. Dattijo's support, we secured €2,000, which funded 70% of our capital project, benefiting over 1,000 students.

On October 22, 2022, I met Dr. Nurudeen Maidoki on a train from Kaduna to Abuja. After discussing my vision for using data science in public health, he introduced me to the ClickonKaduna Data Science Fellowship. Within eight months, I applied and was selected among 40 finalists from 5,040 applicants. This relationship provided critical mentorship and enabled me to contribute to digitizing human resources data for over 1,300 primary health centers. Through the fellowship I met my co-founder Yusuf Hamisu, and together we founded HealStoc to promote quality healthcare in underserved communities in Northern Nigeria.

In early 2023, I met Mr. Martins Iyekekpolor on LinkedIn, who works on public health design research. I expressed interest in using local data for public health via WhatsApp. As a result, I supported the health economic evaluation framework he was developing for the Democratic Republic of Congo. Through this collaboration, I developed a deeper understanding of health economic evaluations and the importance of localized data in shaping public health policy. Leveraging the UK Lafiya Project in Nigeria, in future, through the Chevening alumni network, I hope to expand HealStoc's healthcare innovation by partnering with UK-based health professionals and bringing similar solutions to other underserved communities in Nigeria.""",
    ],
    "course": [
        """Despite the combined efforts of investment partners, especially the UK, the lack of access to clean, affordable, and sustainable energy remains persistent in Nigeria. In 2020, the World Bank reported that approximately 47% of Nigeria's population have no access to electricity. This challenge, combined with the Boko Haram insurgency and climate-change-caused disasters, has posed critical challenges such as industrial collapse, food insecurity, poverty, and unemployment among millions of Nigerians. Innovative and radical approaches to energy production must be implemented at all stages if Nigeria is to achieve its Paris Climate Agreement commitments and SDGs 7 and 13. This motivated me to study in the UK to learn from its innovative solutions, policies, and strategies.

My first choice is MSc Sustainable Energy at the University of Glasgow, because of its newly established Centre for Sustainable Energy, which offers world-class researchers and facilities to conduct my thesis on designing smart hybrid-grid power systems for rural applications in Nigeria. The Energy Conversion Systems and Renewable and Sustainable Energy modules will provide me with the expertise to design, develop, and manage advanced renewable power and sustainable energy systems to achieve net-zero carbon emissions in my country.

My second choice, MSc Renewable Energy at Cranfield University, offers the Solar Energy Engineering module and the opportunity to conduct research under Professor Chris Sansom, a world-renowned researcher in concentrating solar power. This will equip me with hands-on practical and research skills in designing cost-effective, decentralized solar power, heating and cooling systems for marginalized areas in Nigeria. The Energy Economics and Policy module will give me the skills to create innovative policies and regulatory frameworks, set up carbon pricing mechanisms, and scale up interventions to improve energy efficiency in buildings and industries in Nigeria.

My third choice, the Sustainable Energy Systems master's at the University of Edinburgh, offers modules including Solar Energy and Photovoltaic Systems and Energy Storage and Distribution, which will furnish me with skills to develop advanced energy storage devices for crisis-affected areas and conduct cutting-edge research on solar power plant design, operation and management.

The Chevening scholarship will grant me the opportunity to foster international collaborations with world-leading energy researchers, industries, and policymakers in the UK to promote sustainable energy development in Nigeria.""",
        """Maternal mortality in Northern Nigeria is becoming the order of the day. According to the Kaduna State Ministry of Health, there are 512 deaths for every 100,000 deliveries. This is why I want to study an MSc in Public Health for Development at the London School of Hygiene and Tropical Medicine (LSHTM), an MSc in Global Health Policy at the London School of Economics (LSE), or an MSc in Global Public Health Nutrition at the University of Westminster.

My first choice is LSHTM, which ranks 3rd globally for public health. Its reputation for cutting-edge research aligns with my goal of addressing Nigeria's neonatal mortality rate of 57 per 1,000 live births. Modules such as Health Economics and Designing Disease Control Programmes will equip me to allocate health resources efficiently and reduce maternal deaths by 25% within five years. Learning from Dr. Hannah Blencowe, an expert on neonatal health, will further enhance my ability to design impactful public health interventions. LSHTM's partnerships across six continents will offer valuable opportunities for co-publishing papers and fostering global collaborations.

My second choice, LSE, ranks 50th in the QS ranking, the best in London. The Economics Analysis for Health Policy in Low- and Middle-Income Countries module will empower me to evaluate healthcare policies that impact Nigeria's €11 billion health sector, ensuring efficient allocation of limited health resources. The course co-director, Dr. Clare Wenham, with research experience in global health governance, will expose me to global networks and the challenges and opportunities in global health development.

My third choice is the University of Westminster. The Research Methods for Health Science module will enable me to design comprehensive global health research methodologies and communicate findings for evidence-based policymaking in Nigeria. Within one year of completing my MSc, I plan to initiate a national public health campaign aimed at decreasing maternal mortality and neonatal death rates in Nigeria.""",
    ],
    "career": [
        """Within 4 years of my return, I plan to join the Rural Electrification Agency of Nigeria as a renewable energy engineer to contribute to developing innovative policies and strategies that promote inclusive energy transition, climate neutrality, and sustainable energy practice. I will partner with the CNAA and FCDO to lobby policymakers and stakeholders to increase investment in sustainable energy research and businesses in underserved areas of Nigeria. I will also collaborate with like-minded Chevening alumni and NGOs to raise climate change awareness, advocate for sustainable energy practices, and promote girls' STEM education in crisis-affected areas in northeast Nigeria.

In 5-10 years, I intend to pursue a Ph.D. in sustainable power systems. Thereafter, I will join a Nigerian university as a lecturer, contributing to teaching and research that provides government and policymakers with evidence-based mini-grid regulatory frameworks. I aspire to establish my own research group focused on cost-effective smart hybrid-grid systems and decentralized solar power systems for rural applications, and to establish a partnership between Nigerian energy research centres and the Centre for Sustainable Energy at the University of Glasgow, training 10,000 young researchers and professionals on rural electrification by 2040.

In 11-20 years, I see myself as a renowned renewable energy professor and Nigeria's Federal Minister of Power, collaborating with the FCDO and UK counterparts to foster international energy policy exchange. Despite Northern Nigeria having strong solar radiation potential, 76% of its population still lack access to electricity. I will partner with international development partners to establish solar power generation farms in northeast Nigeria, providing 20 million households with access to affordable and clean energy by 2050.

The Chevening scholarship will provide me with exceptional opportunities to network with prominent donors and like-minded individuals to reduce energy poverty and inequality, boost economic productivity, promote decent STEM education and mitigate climate change, leading to Nigeria's attainment of SDGs 4, 7, 10 and 13.""",
        """Recent data from the ongoing six-month longitudinal assessment study we are conducting at Natview Foundation for Technology Innovation (NFTI) has shown that in Kaduna State, 95% of maternal deaths are attributed to a lack of oxytocin for pregnant women, lack of family planning contraceptives, and inadequate orientation to prevent unwanted pregnancy across 89 primary health care (PHC) facilities. I discovered that pregnant women are often required to bring their own delivery kit, and where they cannot afford it, PHCs frequently have none in stock either.

Upon my return, I will initiate discussions with the UK Lafiya Project to integrate HealStoc's telemedicine platform with their maternal health initiatives, enabling the supply of oxytocin, family planning services, and health education at PHC facilities. I aim to decrease maternal, neonatal, and infant mortality rates in Kaduna State by 10% within three years of my return, covering at least 50,000 pregnant women across 70 PHCs. If successful, I will iterate the model in other states, working toward the kind of outcome Belarus achieved in reducing maternal mortality to 1 per 1,000 births.

I also discovered that most PHC pharmacies lack essential children's medications such as chlorhexidine gel, zinc ORS, and amoxicillin suspensions, largely because staff lack a formula to calculate minimum stock levels. To address this, I will seek strategic partnerships with experienced pharmacy technicians from the Chevening Alumni network to host workshops for affected PHCs.

My mid-term plan is to expand HealStoc's telemedicine services to five Sub-Saharan African countries within five years, focusing first on countries with existing Chevening alumni partnerships, aligning with the UK government's Lafiya Project priorities and SDG 3. In the long term, over the next decade, I aim to work with the WHO as a public health data specialist to implement maternal health interventions across Africa, which accounts for about 70% of global maternal deaths -- leading efforts by 2035 to increase health facilities, enhance health workers' training, and secure essential medicines for at-risk communities.""",
    ],
}
