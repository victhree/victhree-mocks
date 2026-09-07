/* Browse page: lists tests for one category (?cat=sectional|full|english|maths).
   The "sectional" category is organised into subject folders — with no ?sub it
   shows one folder tile per subject; with ?sub=<slug> it lists that subject's tests. */
function escapeHtml(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function qs(name){ return new URLSearchParams(location.search).get(name); }
function catParam(){ var c = qs("cat"); return (c === "full" || c === "english" || c === "maths" || c === "sectional") ? c : "sectional"; }
function catOf(id){ if (/^full-mock-\d/.test(id)) return "full"; if (/^eng-mock-\d/.test(id)) return "english"; if (/^maths-mock-\d/.test(id)) return "maths"; return "sectional"; }
function catTitle(cat){ return cat === "full" ? "Full-Length Tests" : (cat === "english" ? "English Tests" : (cat === "maths" ? "Maths Tests" : "GK Sectional Tests")); }

/* Which subject folder a sectional test belongs to (driven by its manifest subject). */
var GROUP_ORDER = ["Geography", "History", "Polity", "Economy", "Science", "Mixed Subjects"];
function sectionGroup(t){
  var s = (t.subject || "").toLowerCase();
  if (s.indexOf("geograph") >= 0) return "Geography";
  if (s.indexOf("histor") >= 0) return "History";
  if (s === "gs") return "Mixed Subjects";
  if (s.indexOf("polit") >= 0) return "Polity";
  if (s.indexOf("econom") >= 0) return "Economy";
  if (scienceDiscipline(t)) return "Science";
  return "Other";
}
function slug(g){ return g.toLowerCase().replace(/\s+/g, "-"); }

/* The Science folder is split into discipline sections (fixed order). */
var SCIENCE_DISCIPLINES = ["Physics", "Chemistry", "Biology", "Technology", "Ecology"];
function scienceDiscipline(t){
  var s = (t.subject || "").toLowerCase();
  if (s.indexOf("physic") >= 0) return "Physics";
  if (s.indexOf("chemist") >= 0) return "Chemistry";
  if (s.indexOf("biolog") >= 0) return "Biology";
  if (s.indexOf("technolog") >= 0) return "Technology";
  if (s.indexOf("ecolog") >= 0 || s.indexOf("environ") >= 0) return "Ecology";
  return "";
}

/* Within the History folder, which era-column a test belongs to.
   Ancient+Medieval and the all-era Full History sit in the (central) Medieval column. */
function historyEra(t){
  var id = t.id;
  if (/^anchist-/.test(id) || id === "ancient-history-01") return "Ancient";
  if (/^medhist-/.test(id) || id === "ancient-medieval-01" || id === "full-history-01") return "Medieval";
  return "Modern"; // modhist-*, modern-india-01 (Full Modern History), any other
}

function setBack(href, text){
  var b = document.getElementById("backLink");
  if (b) { b.href = href; b.innerHTML = text; }
}

function cardHtml(t){
  var rawTitle = t.title || t.id;
  var m = rawTitle.match(/^(.*?)[-\s]*?(Test\s*\d+)$/i);
  var line1 = m ? m[1].replace(/[-\s]+$/, "").trim() : rawTitle;
  var line2 = m ? m[2] : "";
  var topic = t.topic ? '<span class="test-card-topic">' + escapeHtml(t.topic) + '</span>' : "";
  var col1 = t.countNote ? escapeHtml(t.countNote) : (t.count != null ? t.count + " questions" : "");
  var col2 = t.durationMin != null ? t.durationMin + " min" : (t.metaNote ? escapeHtml(t.metaNote) : "");
  return '<a class="test-card" href="test.html?test=' + encodeURIComponent(t.id) + '">' +
    '<h3 class="test-card-title"><span class="tc-line1">' + escapeHtml(line1) + '</span>' +
    (line2 ? '<span class="tc-line2">' + escapeHtml(line2) + '</span>' : '') + '</h3>' +
    topic +
    '<div class="test-card-meta"><span>' + col1 + '</span><span>' + col2 + '</span></div>' +
    '<span class="test-card-cta">Start &#8250;</span></a>';
}

function folderHtml(group){
  return '<a class="choice-tile choice-tile-plain" href="browse.html?cat=sectional&sub=' + slug(group) + '">' +
    '<span class="choice-title">' + escapeHtml(group) + '</span></a>';
}

async function loadTests(){
  var cat = catParam();
  var sub = qs("sub");
  var heading = document.getElementById("browseHeading");
  var list = document.getElementById("testList");
  var msg = document.getElementById("testListMsg");
  try {
    var res = await fetch("tests.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    var tests = (data.tests || []).filter(function(t){ return t && t.id && catOf(t.id) === cat; });

    // Sectional folder index (no ?sub): show one tile per subject.
    if (cat === "sectional" && !sub) {
      heading.textContent = "GK Sectional Tests";
      document.title = "GK Sectional Tests - VicThree Defence";
      setBack("index.html", "&#8249; All categories");
      var counts = {};
      tests.forEach(function(t){ var g = sectionGroup(t); counts[g] = (counts[g] || 0) + 1; });
      var groups = GROUP_ORDER.filter(function(g){ return counts[g]; });
      Object.keys(counts).forEach(function(g){ if (GROUP_ORDER.indexOf(g) < 0) groups.push(g); });
      if (!groups.length) { msg.textContent = "No tests yet."; return; }
      list.className = "home-choices";
      list.innerHTML = groups.map(function(g){ return folderHtml(g); }).join("");
      return;
    }

    // Sectional subject view (?sub=slug): list that subject's tests.
    if (cat === "sectional" && sub) {
      tests = tests.filter(function(t){ return slug(sectionGroup(t)) === sub; });
      var gname = tests.length ? sectionGroup(tests[0]) : sub.replace(/-/g, " ");
      heading.textContent = gname + " Tests";
      document.title = gname + " Tests - VicThree Defence";
      setBack("browse.html?cat=sectional", "&#8249; GK Sectional Tests");
      if (!tests.length) { msg.textContent = "No tests in this subject yet."; return; }
      // History is grouped into labelled era sections: Ancient | Medieval | Modern.
      if (sub === "history") {
        var eras = [
          { key: "Ancient", label: "Ancient History" },
          { key: "Medieval", label: "Medieval History" },
          { key: "Modern", label: "Modern History" }
        ];
        list.className = "subject-groups";
        list.innerHTML = eras.map(function(e){
          var grp = tests.filter(function(t){ return historyEra(t) === e.key; });
          if (!grp.length) return "";
          return '<section class="subject-group">' +
            '<h2 class="subject-group-title">' + escapeHtml(e.label) + '</h2>' +
            '<div class="test-list">' + grp.map(cardHtml).join("") + '</div>' +
            '</section>';
        }).join("");
        return;
      }
      // Science is grouped into labelled discipline sections.
      if (sub === "science") {
        var order = SCIENCE_DISCIPLINES.slice();
        tests.forEach(function(t){ var d = scienceDiscipline(t); if (d && order.indexOf(d) < 0) order.push(d); });
        list.className = "subject-groups";
        list.innerHTML = order.map(function(d){
          var grp = tests.filter(function(t){ return scienceDiscipline(t) === d; })
                         .sort(function(a, b){ return (a.id || "").localeCompare(b.id || ""); });
          if (!grp.length) return "";
          return '<section class="subject-group">' +
            '<h2 class="subject-group-title">' + escapeHtml(d) + '</h2>' +
            '<div class="test-list">' + grp.map(cardHtml).join("") + '</div>' +
            '</section>';
        }).join("");
        return;
      }
      list.className = "test-list";
      list.innerHTML = tests.map(cardHtml).join("");
      return;
    }

    // Other categories: flat list of test cards.
    heading.textContent = catTitle(cat);
    document.title = catTitle(cat) + " - VicThree Defence";
    setBack("index.html", "&#8249; All categories");
    if (!tests.length) { msg.textContent = "No tests in this category yet."; return; }
    list.className = "test-list";
    list.innerHTML = tests.map(cardHtml).join("");
  } catch (err) { console.error(err); msg.textContent = "Could not load the test list. Please refresh."; }
}
window.addEventListener("DOMContentLoaded", loadTests);
