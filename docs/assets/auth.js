/* ============================================================
   VicThree Defence — Course-portal handoff (token + mock reporting)
   Mirrors the SSB integration. Anonymous practice is unaffected:
   with no token stored, nothing is ever sent to the portal.
   ------------------------------------------------------------
   1) Captures a signed login token handed off in the URL fragment
      (#vt=<token>), stores it in localStorage, and strips the hash.
   2) Exposes window.VTPortal.reportMock({...}) — a fire-and-forget
      POST of one completed mock result for the signed-in student.
   ============================================================ */
(function () {
  var PORTAL_BASE = "https://victhree-portal.anmolxsharma.workers.dev";
  var KEY = "vt_portal_token"; // shared with the SSB site so a student is recognised across both

  /* ---- 1) capture #vt=<token> handoff, then strip it from the URL ---- */
  try {
    var h = location.hash || "";
    var m = h.match(/[#&]vt=([^&]*)/);
    if (m) {
      var tok = decodeURIComponent(m[1] || "");
      if (tok) { try { localStorage.setItem(KEY, tok); } catch (e) {} }
      // rebuild the hash without the vt= parameter
      var rest = h.replace(/[#&]vt=[^&]*/, "");
      rest = rest.replace(/^#&/, "#").replace(/[#&]$/, "");
      var newHash = (rest && rest !== "#") ? rest : "";
      try {
        history.replaceState(null, "", location.pathname + location.search + newHash);
      } catch (e) {
        try { location.hash = newHash; } catch (e2) {}
      }
    }
  } catch (e) { /* never let auth setup break the page */ }

  function token() {
    try { return localStorage.getItem(KEY) || null; } catch (e) { return null; }
  }

  /* ---- 2) record one completed mock (no-op for anonymous visitors) ----
     attempt = { test_id, test_title, score, total, seconds?, percent? }
     score/total are marks; the portal computes the percentage. The student
     is taken from the token, never the body. Never throws, never blocks. */
  function reportMock(attempt) {
    var tok = token();
    if (!tok || !attempt) return;
    var body = { test_id: attempt.test_id || "", test_title: attempt.test_title || "" };
    if (attempt.score != null) body.score = attempt.score;
    if (attempt.total != null) body.total = attempt.total;
    if (attempt.seconds != null) body.seconds = attempt.seconds;
    if (attempt.percent != null) body.percent = attempt.percent;
    try {
      fetch(PORTAL_BASE + "/api/mock/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tok },
        body: JSON.stringify(body),
        keepalive: true, // survives the page being closed/navigated right after submit
      }).catch(function () {});
    } catch (e) { /* ignore — reporting must never affect the student's result */ }
  }

  window.VTPortal = {
    token: token,
    isSignedIn: function () { return !!token(); },
    reportMock: reportMock,
  };
})();
