/* ============================================================
   VicThree Defence — Home page (test picker)
   Reads tests.json and renders a card per test. Each card links
   to test.html?test=<id>, which runs the quiz engine.
   ============================================================ */

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function loadTests() {
  const list = document.getElementById("testList");
  const msg = document.getElementById("testListMsg");
  try {
    const res = await fetch("tests.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const tests = (data.tests || []).filter((t) => t && t.id);

    if (!tests.length) {
      msg.textContent = "No tests available yet.";
      return;
    }

    list.innerHTML = "";
    tests.forEach((t) => {
      const card = document.createElement("a");
      card.className = "test-card";
      card.href = "test.html?test=" + encodeURIComponent(t.id);

      // Split a title like "Geography-Test 1" into "Geography" / "Test 1".
      const rawTitle = t.title || t.id;
      const m = rawTitle.match(/^(.*?)[-\s]*?(Test\s*\d+)$/i);
      const line1 = m ? m[1].replace(/[-\s]+$/, "").trim() : rawTitle;
      const line2 = m ? m[2] : "";

      card.innerHTML = `
        <h3 class="test-card-title">
          <span class="tc-line1">${escapeHtml(line1)}</span>
          ${line2 ? `<span class="tc-line2">${escapeHtml(line2)}</span>` : ""}
        </h3>
        <div class="test-card-meta">
          <span>${t.count != null ? t.count + " questions" : ""}</span>
          <span>${t.durationMin != null ? t.durationMin + " min" : ""}</span>
        </div>
        <span class="test-card-cta">Start ›</span>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    msg.textContent =
      "Could not load the test list. If you opened the file directly, use the live site or a local server.";
  }
}

window.addEventListener("DOMContentLoaded", loadTests);
