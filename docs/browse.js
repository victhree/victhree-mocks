/* Browse page: lists the tests for one category (?cat=sectional|full). */
function escapeHtml(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function catParam(){ var c = new URLSearchParams(location.search).get("cat"); return c === "full" ? "full" : "sectional"; }
async function loadTests(){
  var cat = catParam();
  var title = cat === "full" ? "Full-Length Tests" : "Sectional Tests";
  document.getElementById("browseHeading").textContent = title;
  document.title = title + " - VicThree Defence";
  var list = document.getElementById("testList");
  var msg = document.getElementById("testListMsg");
  try {
    var res = await fetch("tests.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    var tests = (data.tests || []).filter(function(t){ return t && t.id; });
    tests = tests.filter(function(t){ return (/^full-mock-\d/.test(t.id) ? "full" : "sectional") === cat; });
    if (!tests.length) { msg.textContent = "No tests in this category yet."; return; }
    list.innerHTML = "";
    tests.forEach(function(t){
      var card = document.createElement("a");
      card.className = "test-card";
      card.href = "test.html?test=" + encodeURIComponent(t.id);
      var rawTitle = t.title || t.id;
      var m = rawTitle.match(/^(.*?)[-\s]*?(Test\s*\d+)$/i);
      var line1 = m ? m[1].replace(/[-\s]+$/, "").trim() : rawTitle;
      var line2 = m ? m[2] : "";
      var col1 = t.countNote ? escapeHtml(t.countNote) : (t.count != null ? t.count + " questions" : "");
      var col2 = t.durationMin != null ? t.durationMin + " min" : (t.metaNote ? escapeHtml(t.metaNote) : "");
      card.innerHTML =
        '<h3 class="test-card-title"><span class="tc-line1">' + escapeHtml(line1) + '</span>' +
        (line2 ? '<span class="tc-line2">' + escapeHtml(line2) + '</span>' : '') + '</h3>' +
        '<div class="test-card-meta"><span>' + col1 + '</span><span>' + col2 + '</span></div>' +
        '<span class="test-card-cta">Start &#8250;</span>';
      list.appendChild(card);
    });
  } catch (err) { console.error(err); msg.textContent = "Could not load the test list. Please refresh."; }
}
window.addEventListener("DOMContentLoaded", loadTests);
