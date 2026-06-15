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
      card.innerHTML = `
        ${t.subject ? `<span class="test-tag">${escapeHtml(t.subject)}</span>` : ""}
        <h3 class="test-card-title">${escapeHtml(t.title || t.id)}</h3>
        ${t.description ? `<p class="test-card-desc">${escapeHtml(t.description)}</p>` : ""}
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
