/* ============================================================
   Create Your Own Quiz — builder
   Reads pool/index.json (+ per-subject pool files) and assembles a
   custom quiz object into sessionStorage, then hands off to the engine
   at test.html?custom=1. PYQ questions carry their own answer; mock
   questions carry only a source ref (graded server-side at submit).
   ============================================================ */
const $ = (id) => document.getElementById(id);
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }

const state = {
  index: null,
  bySlug: {},            // slug -> subject meta
  poolCache: {},         // slug -> loaded questions array
  selSubjects: new Set(),
  selTopics: {},         // slug -> Set(topic names)
  source: "both",
  count: 30,
  timed: true,
};

async function init(){
  try {
    const res = await fetch("pool/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.index = await res.json();
    // Mathematics is not offered in Create Your Own Quiz.
    state.index.subjects = (state.index.subjects || []).filter((s) => s.slug !== "mathematics");
  } catch (e) {
    $("builderMsg").textContent = "Could not load the question bank. Please refresh.";
    console.error(e);
    return;
  }
  (state.index.subjects || []).forEach((s) => { state.bySlug[s.slug] = s; });
  renderSubjects();
  wire();
  $("builderMsg").hidden = true;
  $("builder").hidden = false;
  updateAvail();
}

function renderSubjects(){
  const wrap = $("subjectList");
  wrap.innerHTML = (state.index.subjects || []).map((s) =>
    '<label class="pick-item"><input type="checkbox" class="subj-cb" value="' + s.slug + '">' +
    '<span class="pick-name">' + esc(s.name) + '</span></label>'
  ).join("");
}

function renderTopicPanel(){
  const panel = $("topicPanel");
  const slugs = [...state.selSubjects];
  if (!slugs.length) { panel.innerHTML = '<p class="muted">Pick a subject above to choose its topics.</p>'; return; }
  panel.innerHTML = slugs.map((sl) => {
    const s = state.bySlug[sl];
    if (!s) return "";
    const chosen = state.selTopics[sl] || new Set();
    const topics = (s.topics || []).map((t) =>
      '<label class="topic-item"><input type="checkbox" class="topic-cb" data-subj="' + sl + '" value="' + esc(t.name) + '"' +
      (chosen.has(t.name) ? " checked" : "") + '>' +
      '<span>' + esc(t.name) + '</span></label>'
    ).join("");
    return '<div class="topic-group"><div class="topic-group-head">' + esc(s.name) + '</div>' +
      '<div class="topic-items">' + topics + '</div></div>';
  }).join("");
  panel.querySelectorAll(".topic-cb").forEach((cb) => cb.addEventListener("change", onTopicChange));
}

function onTopicChange(e){
  const sl = e.target.getAttribute("data-subj");
  if (!state.selTopics[sl]) state.selTopics[sl] = new Set();
  if (e.target.checked) state.selTopics[sl].add(e.target.value);
  else state.selTopics[sl].delete(e.target.value);
  updateAvail();
}

function segWire(id, key, cast){
  $(id).querySelectorAll(".seg-btn").forEach((b) => {
    b.addEventListener("click", () => {
      $(id).querySelectorAll(".seg-btn").forEach((x) => x.classList.toggle("active", x === b));
      state[key] = cast(b);
      if (id === "timeSeg") updateTimeHint();
      updateAvail();
    });
  });
}

function wire(){
  $("subjectList").querySelectorAll(".subj-cb").forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.checked) state.selSubjects.add(cb.value);
      else { state.selSubjects.delete(cb.value); delete state.selTopics[cb.value]; }
      renderTopicPanel();
      updateAvail();
    });
  });
  $("selAll").addEventListener("click", () => {
    $("subjectList").querySelectorAll(".subj-cb").forEach((cb) => { cb.checked = true; state.selSubjects.add(cb.value); });
    renderTopicPanel(); updateAvail();
  });
  $("selNone").addEventListener("click", () => {
    $("subjectList").querySelectorAll(".subj-cb").forEach((cb) => { cb.checked = false; });
    state.selSubjects.clear(); state.selTopics = {}; renderTopicPanel(); updateAvail();
  });
  $("advToggle").addEventListener("click", () => {
    const p = $("advPanel");
    const open = p.hasAttribute("hidden");
    if (open) { p.removeAttribute("hidden"); $("advToggle").textContent = "Advanced: choose specific topics ▴"; renderTopicPanel(); }
    else { p.setAttribute("hidden", ""); $("advToggle").textContent = "Advanced: choose specific topics ▾"; }
    $("advToggle").setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll("#advPanel .seg-toggle .seg-btn[data-src]").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#advPanel .seg-btn[data-src]").forEach((x) => x.classList.toggle("active", x === b));
      state.source = b.getAttribute("data-src");
      updateAvail();
    });
  });
  segWire("countSeg", "count", (b) => Number(b.getAttribute("data-count")));
  segWire("timeSeg", "timed", (b) => b.getAttribute("data-mode") === "timed");
  $("createBtn").addEventListener("click", createQuiz);
}

function updateTimeHint(){
  $("timeHint").textContent = state.timed
    ? "Timed: about one minute per question, auto-submits at time-up."
    : "Untimed: no countdown, submit whenever you are done.";
}

/* Estimate of how many questions match the current filters (from the index). */
function estimateAvailable(){
  let n = 0;
  state.selSubjects.forEach((sl) => {
    const s = state.bySlug[sl]; if (!s) return;
    const topics = state.selTopics[sl];
    if (topics && topics.size) {
      (s.topics || []).forEach((t) => { if (topics.has(t.name)) n += t.count; });
    } else {
      n += (state.source === "pyq") ? s.pyq : (state.source === "mock") ? s.mock : s.count;
    }
  });
  return n;
}

function updateAvail(){
  const est = estimateAvailable();
  const line = $("availLine");
  if (!state.selSubjects.size) { line.textContent = "Choose at least one subject to begin."; line.className = "avail-line warn"; }
  else if (est < state.count) { line.textContent = "About " + est + " questions match — fewer than " + state.count + ", so your quiz will use all " + est + "."; line.className = "avail-line warn"; }
  else { line.textContent = "About " + est + " questions match your selection."; line.className = "avail-line"; }
}

function shuffle(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

async function loadSubjectPool(sl){
  if (state.poolCache[sl]) return state.poolCache[sl];
  const res = await fetch("pool/" + sl + ".json", { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status + " loading " + sl);
  const arr = await res.json();
  state.poolCache[sl] = arr;
  return arr;
}

async function createQuiz(){
  const err = $("createError"); err.hidden = true;
  if (!state.selSubjects.size) { err.textContent = "Please choose at least one subject."; err.hidden = false; return; }
  $("createBtn").disabled = true; $("createBtn").textContent = "Building…";
  try {
    const slugs = [...state.selSubjects];
    const pools = await Promise.all(slugs.map(loadSubjectPool));
    let picked = [];
    slugs.forEach((sl, i) => {
      const topics = state.selTopics[sl];
      pools[i].forEach((q) => {
        if (state.source !== "both" && q.src !== state.source) return;
        if (topics && topics.size && !topics.has(q.topic)) return;
        picked.push(q);
      });
    });
    if (!picked.length) { err.textContent = "No questions match those filters. Loosen the topic or source filter."; err.hidden = false; resetBtn(); return; }
    shuffle(picked);
    const take = picked.slice(0, state.count);
    const questions = take.map((q, idx) => {
      const o = {
        n: idx + 1, stem: q.stem, options: q.options,
        subject: q.subject, topic: q.topic, src: q.src, sid: q.sid, sn: q.sn,
      };
      if (q.subs && q.subs.length) o.subs = q.subs;
      if (q.passage) o.passage = q.passage;
      if (q.direction) o.direction = q.direction;
      if (q.src === "pyq") { o.ans = q.ans; o.exp = q.exp; o.pyq = q.sid + (q.year ? "" : ""); }
      return o;
    });
    const cq = {
      title: "Custom Mock Test",
      custom: true,
      untimed: !state.timed,
      durationMin: state.timed ? take.length : 0,
      questions: questions,
    };
    try { sessionStorage.setItem("v3customquiz", JSON.stringify(cq)); }
    catch (e) { err.textContent = "Could not build the quiz (storage blocked). Try a smaller quiz or a normal browser window."; err.hidden = false; resetBtn(); return; }
    window.location.href = "test.html?custom=1";
  } catch (e) {
    console.error(e);
    err.textContent = "Something went wrong building the quiz. Please try again."; err.hidden = false; resetBtn();
  }
}
function resetBtn(){ $("createBtn").disabled = false; $("createBtn").textContent = "Create quiz ›"; }

window.addEventListener("DOMContentLoaded", init);
