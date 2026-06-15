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
  }

  /* ----- To add another test, copy the pattern:
  ,
  "polity-01": {
    "1": { correct: "b", correctText: "...", exp: "..." },
    "2": { correct: "d", correctText: "...", exp: "..." }
    // ...
  }
  ----- */
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
