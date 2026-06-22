/************************************************************************
 * VicThree Defence — Mock Tests : GRADING BACKEND (multi-test)
 * ---------------------------------------------------------------------
 * Grades submissions SERVER-SIDE so answer keys never reach the browser,
 * and logs every submission to a Google Sheet.
 *
 * This one web app serves ALL your tests. Each test has its own answer
 * key inside ANSWER_KEYS, keyed by the same id used in the site
 * (tests/<id>.json and tests.json). The front-end sends that id with
 * every submission so the right key is used.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ FIRST-TIME DEPLOY                                                  │
 * ├──────────────────────────────────────────────────────────────────┤
 * │ 1. https://script.google.com → New project.                        │
 * │ 2. Delete default code, paste THIS whole file in. Save.            │
 * │ 3. (Optional) Run `setup` once and authorize, to create the sheet. │
 * │ 4. Deploy ▸ New deployment ▸ type: Web app                         │
 * │      Execute as: Me   |   Who has access: Anyone                   │
 * │    Deploy → Authorize → copy the /exec URL.                        │
 * │ 5. Paste that URL into docs/app.js → CONFIG.BACKEND_URL.           │
 * ├──────────────────────────────────────────────────────────────────┤
 * │ ADDING A NEW TEST LATER                                            │
 * ├──────────────────────────────────────────────────────────────────┤
 * │ a. Add a new "<id>": { ... } block to ANSWER_KEYS below.          │
 * │ b. Save, then Deploy ▸ Manage deployments ▸ ✏️ edit ▸             │
 * │    Version: New version ▸ Deploy. (The /exec URL stays the same.)  │
 * └──────────────────────────────────────────────────────────────────┘
 ************************************************************************/

/* ============ ANSWER KEYS (server-side only) ============
 * Shape:  ANSWER_KEYS["<test-id>"]["<question-number>"] = { correct, correctText, exp }
 * The <test-id> MUST match tests/<id>.json on the site.
 */
const ANSWER_KEYS = {

  /* ----- CDS Geography — Mock Test 1 ----- */
  "geo-01": {
    "1":  { correct: "a", correctText: "1, 2 and 3 only", exp: "The three IAU criteria are orbiting the Sun, hydrostatic equilibrium, and clearing the neighbourhood. Possession of a moon is not a criterion (e.g., Mercury and Venus have no moons but are planets). Pluto fails criterion 3 and is classed as a dwarf planet." },
    "2":  { correct: "c", correctText: "A meteorite-impact crater lake", exp: "Lonar Lake is a crater lake formed by an asteroid/meteorite impact during the Pleistocene." },
    "3":  { correct: "d", correctText: "Seismic waves", exp: "Direct sources are surface rock, mining and volcanic eruption. Seismic waves, gravity anomalies, magnetic surveys and meteorites are indirect sources." },
    "4":  { correct: "c", correctText: "Soil getting very deficient in plant nutrients", exp: "Soil impoverishment means the soil becomes poor in nutrients due to continuous farming, leaching, erosion, or lack of proper replenishment. Soil erosion = removal of topsoil; Soil deposition = accumulation of soil material; Soil enrichment = increase in nutrients; Soil impoverishment = loss of fertility and plant nutrients." },
    "5":  { correct: "b", correctText: "103°–142°", exp: "P-waves are not recorded between roughly 103° and 142° — indicating different densities, state, and composition of the core." },
    "6":  { correct: "a", correctText: "A-3, B-1, C-2, D-4", exp: "Dhauladhar — Himachal; Nag Tibba — Uttarakhand; Pir Panjal — J&K; Karakoram — Ladakh." },
    "7":  { correct: "a", correctText: "Unconsolidated sediments brought down by Himalayan rivers", exp: "Shiwaliks (900–1,100 m, 10–50 km wide) are composed of unconsolidated alluvial sediments brought down by rivers from the higher Himalayas." },
    "8":  { correct: "b", correctText: "1, 2 and 3 only", exp: "Trans-Himalayan ranges include Karakoram, Ladakh and Zaskar. Pir Panjal lies in the Lesser Himalaya." },
    "9":  { correct: "b", correctText: "Saffron and almond", exp: "Karewas are thick glacial lacustrine deposits along the lower slopes of Pir Panjal, famous for saffron, almond and walnut." },
    "10": { correct: "b", correctText: "Anaimalai Hills", exp: "Anaimudi (2,695 m) is in the Anaimalai Hills, where Western Ghats, Cardamom Hills and Palani Hills meet." },
    "11": { correct: "a", correctText: "A-2, B-1, C-3, D-4", exp: "Bhabar — gravel belt; Tarai — swampy; Bhangar — older alluvium; Khadar — newer alluvium." },
    "12": { correct: "b", correctText: "Brahmaputra", exp: "Majuli is a river island on the Brahmaputra in Assam and is commonly cited as India's largest river island." },
    "13": { correct: "b", correctText: "Beas and Sutlej (Harike barrage)", exp: "The Indira Gandhi Canal starts from the Harike barrage at the confluence of Beas and Sutlej rivers in Punjab." },
    "14": { correct: "a", correctText: "Western Ghats, Eastern Ghats, Satpura/Maikal range", exp: "Deccan Plateau is bounded by Western Ghats (west), Eastern Ghats (east), and Satpura/Maikal range/Mahadev Hills (north)." },
    "15": { correct: "a", correctText: "A-3, B-4, C-2, D-1", exp: "Pyrenees — France/Spain; Atlas — Morocco/Algeria; Appalachian — North America; Andes — South America." },
    "16": { correct: "b", correctText: "Morocco and Algeria", exp: "The Atlas range stretches across Morocco, Algeria and Tunisia in north-west Africa." },
    "17": { correct: "b", correctText: "Asia", exp: "Asia is the largest continent (~44.6 million sq km), about 30% of total land area." },
    "18": { correct: "d", correctText: "1, 2 and 3", exp: "All three statements are correct." },
    "19": { correct: "c", correctText: "Mediterranean Sea", exp: "The Nile, the world's longest river, drains into the Mediterranean Sea via its delta in Egypt." },
    "20": { correct: "b", correctText: "Equator than at the Poles", exp: "Troposphere is about 18 km thick at the equator and only about 8 km at the poles." },
    "21": { correct: "b", correctText: "Temperature increases with altitude due to ozone absorption of UV", exp: "In the stratosphere temperature increases with altitude due to absorption of UV by ozone. Most weather is in the troposphere." },
    "22": { correct: "b", correctText: "Reflects radio waves enabling long-distance communication", exp: "The ionosphere contains charged particles that reflect radio waves, enabling long-distance radio communication." },
    "23": { correct: "c", correctText: "99%", exp: "Nitrogen (~78%) and oxygen (~21%) together form ~99% of dry atmospheric gases." },
    "24": { correct: "d", correctText: "1, 2 and 3", exp: "All three statements are correct under the global heat-budget model." },
    "25": { correct: "b", correctText: "Subtropical high to equatorial low", exp: "Trade winds blow from subtropical high-pressure belts towards the equatorial low — north-easterly in NH, south-easterly in SH." },
    "26": { correct: "d", correctText: "1, 2 and 3", exp: "All three statements are correct." },
    "27": { correct: "b", correctText: "Magnetite", exp: "Magnetite — best quality, >70% iron, magnetic. Haematite — 60–70%; Limonite — 40–60%; Siderite — 20–40%." },
    "28": { correct: "d", correctText: "Kolar (Karnataka)", exp: "Kolar is a gold mining belt, not copper. Copper is from Singhbhum, Balaghat, Jhunjhunu and Alwar." },
    "29": { correct: "b", correctText: "Karnataka", exp: "Kolar and Hutti gold fields are in Karnataka. Ramgiri is in Andhra Pradesh." },
    "30": { correct: "d", correctText: "1, 2, 3 and 4", exp: "All four pairings are correct." },
    "31": { correct: "a", correctText: "Damodar Valley (Jharkhand-Bengal belt)", exp: "Major Gondwana coalfields are in the Damodar Valley — Raniganj, Jharia, Bokaro, Giridih, Karanpura." },
    "32": { correct: "a", correctText: "82°30'E passing through Mirzapur", exp: "IST is based on 82.5°E (passing through Mirzapur), giving UTC + 5:30." },
    "33": { correct: "c", correctText: "180°", exp: "The IDL roughly follows the 180° meridian with deviations to avoid land/island groups." },
    "34": { correct: "b", correctText: "Folded/tilted sedimentary rocks like the Appalachian Mountains", exp: "Trellis pattern (right-angle tributary joins) develops on folded or tilted sedimentary rock regions." },
    "35": { correct: "c", correctText: "Jawaharlal Nehru Port (JNPA)", exp: "Jawaharlal Nehru Port (JNPA) at Nhava Sheva, Maharashtra, is the leading container-handling port among India's major ports, handling around half of the container cargo across major ports. (Note: Mundra, a private port, is often cited as India's largest container port overall.)" },
    "36": { correct: "c", correctText: "Kamarajar Port (Ennore)", exp: "Kamarajar Port (Ennore) in Tamil Nadu was the first corporatized major port of India." },
    "37": { correct: "c", correctText: "Goa", exp: "Mormugao Port is the principal port of Goa." },
    "38": { correct: "a", correctText: "Prayagraj to Haldia on the Ganga", exp: "NW-1 — Ganga, Prayagraj to Haldia (1,620 km), developed with World Bank assistance." },
    "39": { correct: "c", correctText: "NH 44", exp: "NH 44 (3,745 km) — Srinagar to Kanyakumari — is India's longest national highway and the North-South Corridor." },
    "40": { correct: "a", correctText: "Delhi to Kolkata via Agra, Kanpur, Varanasi", exp: "NH 19 (Delhi-Kolkata) is part of the GT Road tradition; included in the Golden Quadrilateral." },
    "41": { correct: "c", correctText: "Teesta", exp: "Teesta is a tributary of the Brahmaputra, not the Ganga. Son, Mahananda and Sharada (Saryu/Kali) are all part of the Ganga system." },
    "42": { correct: "d", correctText: "Narmada", exp: "The Narmada is a major west-flowing river draining into the Arabian Sea. Mahanadi, Godavari and Krishna are east-flowing rivers that drain into the Bay of Bengal." },
    "43": { correct: "d", correctText: "Brahmaputra", exp: "The Brahmaputra (Tsangpo in Tibet) takes a sharp U-turn around Namcha Barwa (the 'Great Bend') before entering India in Arunachal Pradesh." },
    "44": { correct: "c", correctText: "Both 1 and 2", exp: "Under the Indus Waters Treaty (1960), the Eastern Rivers are the Sutlej, Beas and Ravi (allocated to India), and the Western Rivers are the Indus, Jhelum and Chenab (largely to Pakistan). Both statements are correct." },
    "45": { correct: "b", correctText: "1, 2 and 4", exp: "Statements 1, 2 and 4 are correct. Statement 3 is wrong: stratus, nimbostratus and stratocumulus are LOW clouds, not high clouds." },
    "46": { correct: "b", correctText: "Cumulonimbus", exp: "Cumulonimbus clouds form by convection, are the only clouds producing hail/thunder/lightning, and have the characteristic cauliflower towers with anvil tops." },
    "47": { correct: "c", correctText: "Meghalaya", exp: "Among the options, Meghalaya is the most populated as per Census 2011; Mizoram, Goa and Sikkim have smaller populations. (Goa ~1.46 million vs Sikkim ~0.6 million.)" },
    "48": { correct: "c", correctText: "Marriage", exp: "Marriage is the single biggest cause of female migration in India, accounting for the largest share of female migrants per Census data." },
    "49": { correct: "c", correctText: "It deflects the wind to the right direction in the southern hemisphere.", exp: "Statement (c) is NOT correct. In the Southern Hemisphere the Coriolis force deflects winds to the LEFT (to the right only in the Northern Hemisphere). It is maximum at the poles and zero at the Equator." },
    "50": { correct: "b", correctText: "Flow of the South-East Trade Winds towards the Indian Ocean", exp: "Flow of the South-East Trade Winds towards the Indian Ocean is NOT a result of El Niño. El Niño weakens/reverses normal Pacific circulation, disrupts equatorial circulation, alters evaporation and reduces plankton/fish off South America." },
    "51": { correct: "a", correctText: "Aw", exp: "In the Köppen system, 'Aw' denotes Tropical Savannah (tropical wet-and-dry) climate. Am = tropical monsoon, Dfc = subarctic, Cwg = humid subtropical with dry winter." },
    "52": { correct: "b", correctText: "Desert climate", exp: "In Köppen's classification, 'BW' stands for arid Desert climate (B = dry, W = wüste/desert). 'BS' denotes steppe climate." },
    "53": { correct: "b", correctText: "1, 2 and 3", exp: "Statements 1, 2 and 3 are correct. Many major earthquakes occur along convergent plate boundaries, but earthquakes also occur along transform and divergent boundaries; the point of origin is the focus/hypocentre; intensity decreases with distance from the epicentre. Statement 4 is wrong — epicentres can lie over oceans too." },
    "54": { correct: "a", correctText: "Hypocentre", exp: "The focus of an earthquake (its point of origin within the Earth) is also called the hypocentre. The epicentre is the point on the surface directly above the focus." },
    "55": { correct: "d", correctText: "Tsunami is a Latin word.", exp: "Tsunami is a Japanese word (tsu = harbour, nami = wave), not Latin. Tsunamis can generate very strong and destructive waves, and Pacific coasts are highly vulnerable because the Pacific Ocean is ringed by the seismically active 'Ring of Fire'. Tsunamis are also called seismic sea waves; the older term 'tidal wave' is inaccurate because tsunamis are not caused by tides." },
    "56": { correct: "a", correctText: "Arabian Plate", exp: "The Arabian Plate is not counted among the major (primary) tectonic plates. Antarctica and its surrounding oceanic plate form the Antarctic Plate (a major plate); the Indo-Australian Plate and the Pacific Plate (the largest) are also major plates." },
    "57": { correct: "c", correctText: "stratosphere", exp: "About 90% of atmospheric ozone is concentrated in the stratosphere, forming the ozone layer that absorbs harmful ultraviolet radiation." },
    "58": { correct: "a", correctText: "the Antarctic caused mainly by CFC gases", exp: "The ozone hole is a region of severe ozone depletion over the Antarctic, caused mainly by chlorofluorocarbons (CFCs)." },
    "59": { correct: "a", correctText: "Wind gap", exp: "Zeugen: formed by wind erosion in desert regions. Dreikanter: a three-faceted rock shaped by wind abrasion. Demoiselle: an erosion pillar, often linked with wind action in arid areas. Wind gap: a dry valley or pass formed mainly by river erosion, not wind erosion." },
    "60": { correct: "b", correctText: "Bolivia", exp: "The Tropic of Capricorn passes through Chile, Argentina, Paraguay and Brazil in South America, but not through Bolivia." }
    },

  /* ----- CDS Ancient History — Practice Test 1 ----- */
  "ancient-history-01": {
    "1": { correct: "b", correctText: "Indra", exp: "In the Rigveda, a deity\u0027s importance is judged largely by the number of hymns devoted to it, and by this measure Indra stands first. He was the war-god and weather-god of the Aryans — the leader in battle and bringer of rain who slew the demon Vritra to release the waters. His title Purandara, \"breaker of forts,\" recalls the Aryans as conquerors of fortified settlements, and around 250 hymns are addressed to him, making him the most celebrated god of the age. The others rank lower: Agni (about 200 hymns) was the fire-god who carried offerings to the gods, while Varuna, guardian of cosmic order (Rta), had only about 20 hymns. Prajapati rose to supremacy only in the Later Vedic period." },
    "2": { correct: "b", correctText: "Megasthenes", exp: "Megasthenes was sent by Seleucus Nicator as his ambassador to the court of Chandragupta Maurya at Pataliputra. His book \"Indica,\" though surviving only in fragments quoted by later writers, gives a valuable, if sometimes exaggerated, picture of Mauryan administration, society and the capital city, including its committees for managing the city and army. Deimachus was a later Greek envoy sent to Bindusara\u0027s court, Nearchus was Alexander\u0027s admiral, and Ptolemy was a Graeco-Egyptian geographer of a much later date." },
    "3": { correct: "d", correctText: "1, 2 and 3", exp: "Dholavira, in the Rann of Kutch, is unusual for its layout divided into a fortified citadel/castle, a middle town and a lower town, built largely of dressed stone. It is famous for its sophisticated water-harvesting system of giant rock-cut reservoirs that captured seasonal stream water, and for a ten-sign inscription set up like a signboard over a gateway — one of the largest pieces of Harappan writing. It was inscribed as a UNESCO World Heritage Site in 2021. All three statements are therefore correct. Each of the other options leaves out one true statement, so only option D is complete." },
    "4": { correct: "a", correctText: "Odisha", exp: "The Vikramkhol (Bikramkhol) cave lies in the Jharsuguda region of Odisha and is famous for an inscribed rock shelter whose markings are seen by some scholars as a link between prehistoric pictographs and early Brahmi-like writing. It is therefore frequently cited in discussions of the origins of script in India. Bihar, Telangana and West Bengal have their own prehistoric and early historic sites, but Vikramkhol specifically belongs to Odisha." },
    "5": { correct: "b", correctText: "Vaishali", exp: "The Vajji confederacy, with its centre at Vaishali, was a league of clans — chief among them the Lichchhavis — and is regarded as one of the earliest republican states in the world. Instead of a single hereditary king, it was governed collectively by an assembly of clan heads, making it the classic example of the gana-sangha form of polity. It was eventually annexed by the Magadhan king Ajatashatru. Rajagriha was Magadha\u0027s early capital, Mathura was the capital of Shurasena, and Taxila of Gandhara — none was the seat of the Vajjis." },
    "6": { correct: "a", correctText: "Harishena", exp: "The Allahabad Pillar Inscription, or Prayag Prashasti, was composed by Harishena, Samudragupta\u0027s court poet and high official. It details his wide-ranging campaigns across northern and southern India, earning him V. A. Smith\u0027s nickname \"Napoleon of India.\" A patron of poetry and himself a poet bearing the title Kaviraja, Samudragupta allowed defeated southern kings to rule as tributaries under the Samanta system. Banabhatta served Harsha, Ravikirti served the Chalukya Pulakeshin II, and Kalidasa is linked with Chandragupta II — none composed the Prayag Prashasti." },
    "7": { correct: "c", correctText: "Rigveda", exp: "The Rigveda, a collection of 1,028 hymns in ten Mandalas recited by the Hotri priest, is the oldest Veda and the only one belonging to the Early Vedic Period; its books 2 to 9 are the most ancient portions. It is our chief source for the life, religion and society of the early Aryans, and indeed the oldest literary work of the Indo-European world. The Samaveda (musical chants), Yajurveda (sacrificial formulas) and Atharvaveda (spells and charms) were all composed later, in the Later Vedic Period, when ritual grew far more elaborate." },
    "8": { correct: "b", correctText: "261 BCE (c. 260 BCE)", exp: "The Kalinga War was fought around 261 BCE (commonly dated c. 260 BCE), about the eighth year of Ashoka\u0027s reign. The immense bloodshed and suffering it caused filled Ashoka with remorse, leading to his embrace of Buddhism and his lifelong promotion of Dhamma — a moral code of non-violence, tolerance and welfare — recorded movingly in the Thirteenth Major Rock Edict. Around 305 BCE Chandragupta fought Seleucus; about 232 BCE marks Ashoka\u0027s death; and 185 BCE is when the Mauryan empire ended with Brihadratha\u0027s assassination." },
    "9": { correct: "b", correctText: "Humans shifted from food gathering to food production", exp: "The single most transformative change of the Neolithic was that humans stopped merely gathering food from the wild and began producing it through agriculture and the domestication of animals. This shift allowed people to settle in one place, leading to permanent villages, pottery, polished stone tools and the use of the wheel — the foundations of all later civilisation. Because it altered the whole basis of human existence, scholars describe it as a \"revolution.\" Iron smelting came only in the Later Vedic age, long afterwards; fortified cities are a feature of the later Harappan urban phase; and organised sea trade belongs to still later periods." },
    "10": { correct: "b", correctText: "Gautamiputra Satakarni", exp: "Gautamiputra Satakarni is regarded as the greatest Satavahana king. He crushed the Saka, Greek and Parthian powers — especially the Saka ruler Nahapana — and restored Satavahana fortunes. He took the title \"Ekabrahmana\" (a unique or peerless Brahmana), and his deeds are praised in the Nasik prashasti issued by his mother, Gautami Balashri. Simuka founded the dynasty, Yajna Sri Satakarni was its last strong ruler, and Vasishthiputra Pulumavi was Gautamiputra\u0027s son and successor." },
    "11": { correct: "b", correctText: "Khema", exp: "Khema was not a Jain teacher at all — she was one of the foremost female disciples (theris) of the Buddha, renowned for her wisdom in the Buddhist order. The others are all celebrated Jain Acharyas: Bhadrabahu (teacher of Chandragupta Maurya), Haribhadra, and Hemachandra (the great scholar of the Chalukya court of Gujarat). Since Bhadrabahu, Haribhadra and Hemachandra all belong to the Jain tradition, the figure who does not fit is the Buddhist nun Khema." },
    "12": { correct: "a", correctText: "Kalibangan", exp: "Kalibangan, on the dried-up Ghaggar in Rajasthan, yielded a furrowed field from the pre-Harappan level — the earliest ploughed field yet found — showing a criss-cross pattern of furrows much like the practice still used by farmers in the region. Kalibangan also produced rows of fire altars, suggesting some form of ritual sacrifice, and its name means \"city of black bangles.\" Mohenjo-daro is associated with the Great Bath and Dancing Girl, Surkotada with horse bones, and Ropar with a burial of a man alongside a dog." },
    "13": { correct: "a", correctText: "Arthashastra", exp: "The Saptanga (\"seven-limbed\") theory is set out in Kautilya\u0027s Arthashastra, the great Mauryan-era treatise on statecraft and economy. It conceives the state as an organism of seven interdependent elements — Swami (king), Amatya (ministers), Janapada (territory and people), Durga (fort), Kosha (treasury), Danda (army/force) and Mitra (allies) — all of which must be strong for the state to flourish. The Indica is Megasthenes\u0027 Greek account, the Mahavamsa is a Sri Lankan Buddhist chronicle, and the Mudrarakshasa is a later Sanskrit play — none is the source of the Saptanga theory." },
    "14": { correct: "d", correctText: "Banabhatta", exp: "Banabhatta, the gifted court poet of Harshavardhana of Kanauj (606–647 CE), composed the Harshacharita — one of the earliest historical biographies in Sanskrit — and the celebrated prose romance Kadambari. These works, together with the account of the Chinese pilgrim Hiuen Tsang, are our chief sources for Harsha\u0027s reign, during which he was checked by Pulakeshin II at the river Narmada. Hiuen Tsang was the visiting Chinese pilgrim (author of Si-yu-ki), Ravikirti served the Chalukyas, and Harishena was Samudragupta\u0027s poet — none wrote these works of Harsha." },
    "15": { correct: "d", correctText: "Mohenjo-daro", exp: "The Great Bath at Mohenjo-daro is a large rectangular tank built of finely fitted burnt bricks made watertight with gypsum mortar and a layer of bitumen. It had steps at both ends, surrounding rooms and an adjacent well to fill it. Its scale and care of construction suggest it was used for ritual bathing rather than ordinary use, pointing to the importance of ceremonial purity in Harappan life. Harappa is famed for its granaries, Lothal for its dockyard, and Banawali for a clay model of a plough — none for the Great Bath." },
    "16": { correct: "b", correctText: "Ujjaini (or Mahishmati)", exp: "Avanti, located around present-day Malwa and Madhya Pradesh, was one of the four most powerful Mahajanapadas. Its capital was at Ujjaini (Ujjain), with Mahishmati serving as a secondary or southern capital. Avanti was a strong rival of Magadha and played an important part in the early spread of Buddhism in the region. Champa was the capital of Anga, Kausambi of Vatsa, and Shravasti of Kosala — each a different Mahajanapada." },
    "17": { correct: "b", correctText: "Marriage by capture", exp: "Of the eight forms of marriage recognised in Vedic and later Dharmashastra tradition, the Rakshasa form is marriage by capture — the forcible seizure of a bride, typically after a battle. It was associated with the warrior (Kshatriya) ethos and, though disapproved of by the lawgivers, was acknowledged as a recognised category. Marriage by purchase corresponds to the Asura form, and a love match by mutual consent is the Gandharva form; dowry-giving is not the basis of the Rakshasa type." },
    "18": { correct: "a", correctText: "Pushyamitra Sunga", exp: "Pushyamitra Sunga, founder of the dynasty, performed two horse sacrifices (Asvamedha), which proclaimed his sovereignty and marked a conscious revival of Vedic-Brahmanical ritual after the Mauryan patronage of Buddhism. His reign also saw conflict with the Greek king Demetrius and with Yajnasena of Vidarbha. Agnimitra was his son and governor of Vidisha (the hero of Kalidasa\u0027s play), Devabhuti was the last Sunga king, and Vasudeva belonged to the succeeding Kanva dynasty." },
    "19": { correct: "d", correctText: "10th Mandala", exp: "The Purushasukta appears in the tenth Mandala of the Rigveda, which is one of the latest portions of the text. It describes the four Varnas as emerging from the body of the cosmic being Purusha — the Brahmana from his mouth, the Kshatriya from his arms, the Vaishya from his thighs and the Shudra from his feet. This is the earliest textual reference to the four-fold social order, and its late position reflects the gradual hardening of Varna divisions. The first Mandala is not its source, the third Mandala contains the Gayatri Mantra, and the seventh Mandala records the Battle of Ten Kings." },
    "20": { correct: "c", correctText: "Chandragupta II", exp: "Fa-Hien (Faxian) travelled in India during the reign of Chandragupta II, who took the title \"Vikramaditya.\" This ruler destroyed the Saka king Rudrasimha III, made Ujjain his second capital, and adorned his court with the famed \"Navaratnas\" (nine gems), said to include Kalidasa and Amarasimha. Fa-Hien came chiefly to collect Buddhist texts and left a useful account of the prosperity of Gupta India. Chandragupta I and Samudragupta ruled before his visit, while Kumaragupta I and the later Hiuen Tsang belong to other reigns." },
    "21": { correct: "b", correctText: "Mesolithic — Middle Stone Age", exp: "The Stone Age is classified by the type of tools humans used, and its names come from Greek roots — \"lithic\" meaning stone. The Mesolithic, from \"meso\" (middle), is correctly the Middle Stone Age. It is a transitional phase (about 10,000–7,000 BCE) lying between the Palaeolithic and the Neolithic, marked by tiny tools called microliths and the beginnings of animal domestication. The Palaeolithic (\"palaeo\", old) is the Old Stone Age, and the Neolithic (\"neo\", new) is the New Stone Age — so those pairings are reversed. The Chalcolithic is the Copper-Stone Age and is not one of the three Stone Age divisions at all." },
    "22": { correct: "d", correctText: "Kautilya (Chanakya)", exp: "Chandragupta Maurya seized the Magadhan throne from the unpopular Dhana Nanda around 321 BCE with the guidance of Kautilya, also called Chanakya or Vishnugupta, the shrewd Brahmin statesman traditionally credited with the Arthashastra. Together they built a centralised empire that soon covered almost the entire subcontinent, and Chandragupta is known to the Greeks as \"Sandrocottus.\" Megasthenes was the Greek envoy to his court, Bhadrabahu was the Jain teacher of his later life, and Seleucus Nicator was the Greek ruler he defeated — none was his mentor in founding the empire." },
    "23": { correct: "d", correctText: "Tripurantaka", exp: "The Brihadeshvara Temple, built by Rajaraja I, prominently features Shiva as Tripurantaka — the destroyer of the three demon cities (Tripura). This warrior form suited the imperial, conquering self-image of Rajaraja Chola, and it recurs across the temple\u0027s sculptural programme. The temple is a masterpiece of the Dravida style and a UNESCO World Heritage Site. Harihara (a Shiva-Vishnu composite) and Bhairava (a fierce form) are not its dominant theme, and while Chola bronzes famously include Nataraja, the prominent stone form at this temple is Tripurantaka." },
    "24": { correct: "b", correctText: "Daya Ram Sahni", exp: "Daya Ram Sahni excavated Harappa, on the river Ravi, in 1921. Because this was the first site of the civilisation to be identified, the whole culture was named the \"Harappan Civilisation\" after it, even though sites were later found spread far beyond the Indus valley. Harappa itself became known as the \"City of Granaries.\" R. D. Banerjee discovered Mohenjo-daro in 1922; S. R. Rao excavated Lothal in 1957; and John Marshall announced the civilisation\u0027s discovery to the world in 1924 but did not personally dig Harappa." },
    "25": { correct: "a", correctText: "Sravanabelagola", exp: "Jain tradition holds that Chandragupta Maurya, after building his vast empire, gave up the throne, became a Jain ascetic under the great teacher Bhadrabahu, and migrated south to Karnataka. There, at Sravanabelagola, he is said to have ended his life by Sallekhana, the Jain practice of fasting unto death. The site remains a major Jain pilgrimage centre to this day. Pataliputra was his imperial capital but not the place of his death; Sarnath is associated with the Buddha\u0027s first sermon; and Ujjain was a Mauryan provincial capital." },
    "26": { correct: "a", correctText: "Gautami Balashri", exp: "The Nasik cave inscription was set up by Gautami Balashri, the mother of Gautamiputra Satakarni, in praise of her son after his death. It lists his conquests and virtues and is a key source for Satavahana history; the king\u0027s own matronymic name (\"Gautamiputra,\" son of Gautami) itself reflects the respected position of mothers in Satavahana royal naming. Prabhavatigupta was a Gupta-Vakataka queen, Kumaradevi was the Lichchhavi wife of Chandragupta I, and Naganika was an earlier Satavahana queen — not the author of this inscription." },
    "27": { correct: "c", correctText: "Ravi", exp: "\"Sapta Sindhu,\" the land of seven rivers, was the heartland of the early Aryans, and each river had a Vedic name. Parushni is the old name of the modern Ravi. It is historically important because the famous Battle of Ten Kings was fought on its banks, where King Sudas defeated a confederacy of rival tribes. The Jhelum was called Vitasta, the Beas was Vipasha, and the Satluj was Shutudri — so none of these matches Parushni." },
    "28": { correct: "d", correctText: "Devanampiya Piyadasi", exp: "In his edicts Ashoka almost always calls himself \"Devanampiya Piyadasi\" — \"Beloved of the Gods, of gracious countenance\" — rather than by his personal name. In fact the name \"Ashoka\" appears in only a handful of inscriptions (in Karnataka and Madhya Pradesh), which is why the link between the edicts and the historical Ashoka was confirmed relatively late. Vikramaditya was a title of the Gupta kings, Ekarat was used by Mahapadma Nanda, and Dakshinapatheshwara was the title of the Chalukya king Pulakeshin II." },
    "29": { correct: "d", correctText: "Chanhudaro", exp: "Chanhudaro, in Sindh, is the only major Harappan city found without a citadel or fortifications. It was essentially an industrial town specialising in bead-making, seal-cutting and shell-working, and the presence of bead-makers\u0027 workshops there gives a vivid picture of Harappan craft production and the standardisation of their famous carnelian and steatite beads. Dholavira had an elaborate fortified, multi-part plan; Harappa had a citadel in the west; and Banawali too had a citadel, though its seals were oddly confined to the lower town." },
    "30": { correct: "c", correctText: "Chandragupta I", exp: "Chandragupta I is considered the real founder of Gupta greatness. His marriage to Kumaradevi, a princess of the powerful Lichchhavi clan, brought him prestige and military strength, helping him establish firm sovereignty over Magadha. He assumed the grand title \"Maharajadhiraja\" and issued special gold coins commemorating the alliance. Sri Gupta was the earliest known but minor ancestor of the line, Samudragupta was Chandragupta I\u0027s conquering son, and Skandagupta was a later king famed for repelling the Hunas." },
    "31": { correct: "d", correctText: "Dhamma", exp: "The Saptanga (\"seven limbs\") of the state in the Arthashastra are Swami, Amatya, Janapada, Durga, Kosha, Danda and Mitra. \"Dhamma\" is not one of them — it is the moral and ethical code propagated by Ashoka in his edicts, belonging to a quite different sphere of thought. Amatya (ministers), Janapada (territory and people) and Durga (fort) are all genuine elements of the Saptanga scheme, so the one that does not belong is Dhamma." },
    "32": { correct: "a", correctText: "Bimbisara", exp: "Bimbisara, founder of the Haryanka dynasty\u0027s greatness and a contemporary of the Buddha, was the first Magadhan king to keep a standing army and to use marriage alliances as a tool of statecraft, taking wives from Kosala, Vaishali and Madra. He also annexed Anga, securing control of trade along the Champa river, laying the foundations of Magadha\u0027s imperial rise. His son Ajatashatru expanded by war, Udayin founded Pataliputra, and Mahapadma Nanda belonged to the later, non-Kshatriya Nanda dynasty." },
    "33": { correct: "b", correctText: "Vishwamitra", exp: "The Gayatri Mantra occurs in the third Mandala of the Rigveda and is a prayer to Savitr, a form of the sun god, invoking divine light to inspire the intellect. It is traditionally ascribed to the sage Vishwamitra, the seer-author associated with that Mandala. In the Later Vedic period it became central to the Upanayana (sacred-thread) ceremony of the upper Varnas. Vasistha is linked with the seventh Mandala and the Dasarajna war, while Atri and Bharadvaja, though Rigvedic seers of other Mandalas, are not credited with the Gayatri Mantra." },
    "34": { correct: "c", correctText: "Agnimitra", exp: "Kalidasa\u0027s \"Malavikagnimitram\" tells the love story of Agnimitra, the Sunga prince and governor of Vidisha, and Malavika, a lady-in-waiting. Though a court comedy, the play is valued because it preserves the memory of the Sunga dynasty and provides a literary glimpse into its political setting, including the Vidarbha conflict. Pushyamitra was Agnimitra\u0027s father and founder of the line, Devabhuti was the last Sunga king, and Vasumitra was a Sunga prince noted in military contexts — none is the hero of this play." },
    "35": { correct: "d", correctText: "Mesolithic Age", exp: "Microliths are very small, sharp tools, usually made of flint or chert, that were often hafted onto wood or bone to make composite implements such as arrows, spears and sickles. This miniaturisation of tools is the defining technological feature of the Mesolithic Age, reflecting a lifestyle based on hunting smaller game, fishing and food-gathering as the climate warmed after the Ice Age. The Lower Palaeolithic, by contrast, used large, crude hand-axes and choppers. The Chalcolithic is defined by the combined use of copper and stone, and the Harappan period was a Bronze Age urban culture — none of these is identified by microliths." },
    "36": { correct: "c", correctText: "Samudragupta", exp: "The Prayaga Prashasti, engraved on an Ashokan pillar at Allahabad, was composed by the poet Harishena to glorify Samudragupta. It lists his conquests across northern and southern India and his political settlements with defeated kings, and is the single most important source for his reign — earning him the title \"Napoleon of India.\" Although the pillar itself originally bore Ashoka\u0027s edicts, the eulogy in question is of Samudragupta; Harsha and Bindusara are unconnected with this inscription." },
    "37": { correct: "c", correctText: "Lothal", exp: "Lothal, in Gujarat on the Bhogava river, possessed a large brick-lined basin connected to a river channel that is widely interpreted as a dockyard for berthing boats. Together with finds such as a Persian Gulf seal, an ivory scale and a terracotta model of a ship, this made Lothal a major Harappan centre of maritime trade and bead manufacture. Kalibangan is known for ploughed fields, Dholavira for its water reservoirs and signboard, and Chanhudaro as the citadel-less bead-making city — none had a dockyard." },
    "38": { correct: "c", correctText: "Kanishka", exp: "The Fourth Buddhist Council was convened by the Kushana emperor Kanishka at Kundalavana in Kashmir, presided over by Vasumitra (with Ashvaghosha assisting). It is closely associated with the formal division of Buddhism into the Hinayana and Mahayana traditions, the latter — favouring image worship and the Bodhisattva ideal — being strongly patronised by Kanishka, who did much to spread Buddhism into Central Asia. Ashoka sponsored the Third Council, Ajatashatru the First, and Harsha lived centuries later and held a great Buddhist assembly at Kanauj rather than this council." },
    "39": { correct: "a", correctText: "Kharavela", exp: "The Hathigumpha (\"elephant cave\") inscription at Udayagiri near Bhubaneswar is the principal record of Kharavela, the most powerful ruler of the Chedi (Mahameghavahana) dynasty of Kalinga. It describes his military campaigns reaching from the north-west to the deep south, his invasion of Magadha, and his patronage of Jainism, marking Kalinga\u0027s revival after the devastation of Ashoka\u0027s war. Simuka founded the Satavahanas, Rudradaman is known from the Junagarh inscription, and Gondophernes was a Parthian king — none is the subject of Hathigumpha." },
    "40": { correct: "d", correctText: "Pit dwellings", exp: "Burzahom and Gufkral, both Neolithic sites in the Kashmir valley, are famous for pit dwellings — homes dug into the ground, which would have given protection against the region\u0027s cold climate. Burzahom is also noted for evidence of domesticated dogs being buried with their masters, showing the close human–animal bond of the period. Dockyards are linked to the Harappan port of Lothal, iron furnaces postdate the Neolithic entirely, and rock-cut temples belong to the much later historical era of Buddhist and Hindu architecture." },
    "41": { correct: "a", correctText: "Sudas of the Bharata clan", exp: "The Dasarajna, recorded in the seventh Mandala of the Rigveda, was fought on the banks of the Parushni (Ravi). King Sudas of the Bharata clan, guided by the priest Vasistha, defeated a coalition of ten chiefs drawn from five Aryan and five non-Aryan tribes. The victory established Bharata supremacy, and it is from this clan that the name \"Bharata\" for India is often traced. The Purus were among the defeated confederacy, while Divodasa and Vishwamitra (who is linked with the Gayatri Mantra) are not named as the victor of this battle." },
    "42": { correct: "b", correctText: "Sattanar (Sithalai Sattanar)", exp: "The Manimekalai, one of the great twin epics of Tamil literature, was composed by the merchant-poet Sattanar (Sithalai Sattanar). A sequel to the Silappadikaram, it follows the story of Manimekalai, the daughter of Kovalan and Madhavi, and is strongly Buddhist in its outlook, expounding Buddhist doctrine and ethics. Kovalan is a character within the story, Ilango Adigal wrote the companion epic Silappadikaram, and Tirutakkatevar composed the Jain epic Jivaka Chintamani." },
    "43": { correct: "c", correctText: "Chandragupta II", exp: "The Mehrauli Iron Pillar bears a Sanskrit inscription referring to a king named \"Chandra,\" generally identified with Chandragupta II. Famous for not rusting even after some 1,600 years, it is celebrated as proof of the remarkably advanced iron metallurgy of Gupta-age India, the \"Golden Age\" of Indian science and craftsmanship. Samudragupta is linked with the Allahabad pillar, Skandagupta with the Bhitari and Junagarh inscriptions, and Kumaragupta I with the founding of Nalanda — not with the Mehrauli pillar." },
    "44": { correct: "d", correctText: "Ajatashatru", exp: "The First Buddhist Council was held at Rajagriha shortly after the Buddha\u0027s death (mahaparinirvana) under the patronage of the Magadhan king Ajatashatru. Presided over by the monk Mahakassapa, its purpose was to compile the Buddha\u0027s teachings; the Sutta and Vinaya Pitakas were settled there. Ajatashatru, son of Bimbisara, had embraced Buddhism after a turbulent reign. Bimbisara was a patron of the Buddha but had died earlier; Kalasoka sponsored the Second Council at Vaishali; and Ashoka the Third Council at Pataliputra." },
    "45": { correct: "b", correctText: "Aramaic and Greek", exp: "Ashoka\u0027s edicts were adapted to the language of each region so the message would be understood locally. Most of India used the Brahmi script in Prakrit; the north-west used the Kharoshthi script; and in Afghanistan, on the empire\u0027s frontier, inscriptions were issued in the Aramaic and Greek languages and scripts — as seen in the famous bilingual Kandahar edict. Tamil and Devanagari were not used in Ashoka\u0027s edicts, and although a Prakrit close to Pali was the language of most edicts, the specific north-western pairing is Aramaic and Greek." },
    "46": { correct: "c", correctText: "It marks the earliest known use of iron for the art of sculpting", exp: "The Harappan civilisation was a Bronze Age culture, and iron was completely unknown to it — iron came into use in India only in the Later Vedic period, long afterwards. So the claim that the Harappans used iron for sculpting is false. They did, however, give the subcontinent its first cities, its first (pictographic, right-to-left) script, and notable stone and bronze sculpture such as the Priest-King and Dancing Girl. Statements A, B and D are all accurate descriptions of Harappan achievements, which is why the incorrect statement is C." },
    "47": { correct: "d", correctText: "Ravikirti", exp: "Pulakeshin II, the greatest ruler of the Chalukyas of Badami, halted Harsha\u0027s southward advance at the Narmada around 618 CE and took the title Dakshinapatheshwara (\"Lord of the South\"). His achievements, including an embassy to the Persian (Sassanid) court, are recorded in the Aihole inscription composed by the Jain poet Ravikirti. He was eventually defeated and killed by the Pallava king Narasimhavarman I. Banabhatta and Harishena served Harsha and Samudragupta respectively, and Dandin was a later Sanskrit prose writer — none composed the Aihole inscription." },
    "48": { correct: "b", correctText: "Menander", exp: "The Milindapanho records a philosophical dialogue between the Buddhist sage Nagasena and the Indo-Greek king Menander (known in Indian sources as Milinda), who ruled from Sakala (Sialkot). According to tradition, Menander was so impressed that he converted to Buddhism. The work is valued both as Buddhist philosophy and as evidence of the deep Indo-Greek cultural contact of the period. Demetrius was the Bactrian king who first invaded India, Hermaius was the last Indo-Greek ruler, and Gondophernes was a Parthian king — none is the Milinda of this text." },
    "49": { correct: "d", correctText: "Manjushrimulakalpa", exp: "Ashvaghosha, the Buddhist scholar at Kanishka\u0027s court, wrote the Buddhacharita (a life of the Buddha), the Saundarananda (on the conversion of the Buddha\u0027s half-brother Nanda) and the drama Sariputraprakarana. The Manjushrimulakalpa, however, is a later Mahayana Buddhist text dealing with ritual and prophecy and was not authored by him. Since the first three are genuinely Ashvaghosha\u0027s compositions, the work that does not belong to him is the Manjushrimulakalpa." },
    "50": { correct: "c", correctText: "Vajji", exp: "The Vajji (Vrijji) confederacy, centred on Vaishali, was the best-known gana-sangha — a state governed not by a single hereditary king but collectively by an assembly of clan chiefs, the Lichchhavis being foremost among them. Such republics are an important feature of the political variety of the sixth century BCE. Magadha, Avanti and Kosala were all monarchies ruled by powerful kings, which is what set them apart from the republican Vajji." }
  }

  /* ----- To add another test, copy the pattern above (mind the comma between blocks). ----- */
};

/* The tab/sheet where submissions are logged. */
const SHEET_NAME = "Submissions";

/* ============================================================
 * doPost — receives { testId, name, roll, answers }, grades, logs.
 * ============================================================ */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var testId = (body.testId || "").toString().trim();
    var name = (body.name || "").toString().trim();
    var roll = (body.roll || "").toString().trim();
    var answers = body.answers || {};   // { "1": "a", "2": "c", ... }

    var key = ANSWER_KEYS[testId];
    if (!key) {
      return jsonOutput({ ok: false, error: "Unknown test id: " + testId });
    }

    var results = [];
    var total = 0;
    var max = 0;

    // Grade in numeric question order.
    var keys = Object.keys(key).sort(function (a, b) { return Number(a) - Number(b); });
    keys.forEach(function (n) {
      max++;
      var item = key[n];
      var chosen = answers[n] != null ? String(answers[n]).toLowerCase() : null;
      var isCorrect = chosen != null && chosen === item.correct;
      if (isCorrect) total++;
      results.push({
        n: Number(n),
        chosen: chosen,
        correct: item.correct,
        correctText: item.correctText,
        isCorrect: isCorrect,
        exp: item.exp
      });
    });

    // Log to the spreadsheet (timestamp, test, name, roll, score, out-of).
    logSubmission(testId, name, roll, total, max);

    return jsonOutput({
      ok: true,
      testId: testId,
      name: name,
      roll: roll,
      total: total,
      max: max,
      results: results
    });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

/* Simple GET so visiting the URL in a browser confirms it's live. */
function doGet(e) {
  return jsonOutput({
    ok: true,
    message: "VicThree grader is running. Use POST to submit.",
    tests: Object.keys(ANSWER_KEYS)
  });
}

/* ============================================================
 * Logging — appends one row per submission to a Google Sheet.
 * One sheet, with a Test column so all tests live together
 * (filter / pivot by Test to see per-test results).
 * ============================================================ */
function logSubmission(testId, name, roll, score, max) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Test", "Name", "Roll", "Score", "Out of"]);
  }
  sheet.appendRow([new Date(), testId, name, roll, score, max]);
}

/* Returns the results spreadsheet, creating one the first time and
   remembering its ID in script properties. */
function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* fall through to recreate */ }
  }
  var ss = SpreadsheetApp.create("VicThree — Mock Test Results");
  props.setProperty("SHEET_ID", ss.getId());
  return ss;
}

/* ============================================================
 * Helpers
 * ============================================================ */
function jsonOutput(obj) {
  // ContentService responses from an "Anyone" web app are readable
  // cross-origin, so the GitHub Pages site can fetch() this directly.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Optional: run once from the editor to create the spreadsheet up-front
   and trigger the authorization prompt. */
function setup() {
  var ss = getSpreadsheet();
  Logger.log("Results spreadsheet URL: " + ss.getUrl());
}
