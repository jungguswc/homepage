/* 중구지역사회보장협의체 활동소식 공통 스크립트
 * API_URL: Apps Script 웹 앱 주소 (배포 후 붙여넣기). 비어 있으면 아래 SEED 소식만 보입니다.
 */
const NEWS_API_URL = "https://script.google.com/macros/s/AKfycbwDEkYdenXrITHRitRYvwAN4d10JdaClrRhzUZrZ_2aQcCLAZ2uw4j_yQy4vOzRL4TCrw/exec";

/* 홈페이지에 고정으로 넣어 둔 소식 (사진은 news 폴더) */
const NEWS_SEED = [
  {
    id: "seed-2026-life",
    category: "구 협의체",
    dong: "",
    date: "2026-10-26",
    title: "2026 지역리더 생명지킴이 교육(심화) 이수",
    body: "중구지역사회보장협의체 위원들이 10월 26일부터 27일까지 부산 한화리조트 해운대에서 열린 「2026 지역리더 생명지킴이 교육」 3단계 리더과정(심화)을 이수했습니다. 보건복지부와 한국생명존중희망재단이 함께한 이번 교육에서 위원들은 생애주기별 위기 신호를 살피는 방법을 배우고, 이웃의 생명을 지키는 지역 안전망의 역할을 다졌습니다.",
    photos: ["news/2026-life-1.jpg", "news/2026-life-2.jpg", "news/2026-life-3.jpg"]
  }
];

const NEWS_DONGS = ["동인동","삼덕동","성내1동","성내2동","성내3동","대신동","남산1동","남산2동","남산3동","남산4동","대봉1동","대봉2동"];

/* 사진 주소: 구글 사진 서버(lh3)를 먼저, 안 되면 드라이브 썸네일로 */
function newsPhotoUrl(p, size) {
  if (!p) return "";
  if (/^(news\/|https?:)/.test(p)) return p;
  return "https://lh3.googleusercontent.com/d/" + encodeURIComponent(p) + "=w" + (size || 1200);
}
function newsPhotoAlt(p, size) {
  if (!p || /^(news\/|https?:)/.test(p)) return "";
  return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(p) + "&sz=w" + (size || 1200);
}
/* 배경용: 두 주소를 겹쳐 두면 앞의 것이 안 열려도 뒤의 것이 보임 */
function newsPhotoBg(p, size) {
  const a = newsPhotoUrl(p, size), b = newsPhotoAlt(p, size);
  return "url('" + newsEsc(a) + "')" + (b ? ", url('" + newsEsc(b) + "')" : "");
}
/* 사진 태그: 첫 주소가 안 열리면 드라이브 썸네일로 바꿈 */
function newsImg(p, size, alt) {
  const b = newsPhotoAlt(p, size);
  return `<img src="${newsEsc(newsPhotoUrl(p, size))}"${b ? ` data-alt="${newsEsc(b)}" onerror="if(this.dataset.alt){this.src=this.dataset.alt;this.removeAttribute('data-alt')}"` : ""} alt="${newsEsc(alt)}" loading="lazy">`;
}

function newsEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function newsDate(d) { return String(d || "").replace(/-/g, "."); }

/* 소식 불러오기: 고정 소식 + 시트 소식, 최신순 */
async function loadNews(opts) {
  opts = opts || {};
  let items = NEWS_SEED.slice();
  if (NEWS_API_URL) {
    try {
      const q = new URLSearchParams({ action: "news" });
      if (opts.dong) q.set("dong", opts.dong);
      const res = await fetch(NEWS_API_URL + "?" + q.toString());
      const j = await res.json();
      if (j.status === "ok" && Array.isArray(j.items)) items = items.concat(j.items);
    } catch (e) { /* 연결이 안 되면 고정 소식만 보여줌 */ }
  }
  if (opts.dong) items = items.filter(n => n.dong === opts.dong);
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return opts.limit ? items.slice(0, opts.limit) : items;
}

function newsTag(n) {
  return n.category === "동 협의체" ? (n.dong || "동 협의체") : "구 협의체";
}

/* ───────────── 공지사항 ───────────── */
const NOTICE_HEADS = ["공지", "공고", "모집", "교육", "회의", "캠페인"];

/* 홈페이지에 고정으로 넣어 둔 공지 (첨부파일은 notice 폴더) */
const NOTICE_SEED = [
  {
    id: "seed-2027-plan",
    head: "공고",
    date: "2026-10-30",
    title: "2027년 지역사회보장 연차별 시행계획(안) 공고",
    body: "대구광역시 중구의 「2027년 지역사회보장 연차별 시행계획(안)」을 공고합니다.\n2027년은 제6기 지역사회보장계획(2027~2030)이 시작되는 첫해로, 이번 시행계획(안)에는 한 해 동안 추진할 세부사업이 담겨 있습니다.\n\n· 공고 기간: 2026년 10월 30일(금) ~ 11월 20일(금)\n· 공고문 보기: 대구광역시 중구청 홈페이지 › 고시·공고 (아래 바로가기 버튼)\n\n계획(안)에 대한 주민 여러분의 많은 관심과 의견 부탁드립니다.\n· 문의: 대구중구지역사회보장협의체 사무국 053-661-2288",
    pin: true,
    photos: [],
    files: [],
    link: "https://www.jung.daegu.kr/new/pages/administration/page.html?mc=0159"
  },
  {
    id: "seed-open",
    head: "공지",
    date: "2026-10-29",
    title: "대구중구지역사회보장협의체 홈페이지를 열었습니다",
    body: "대구중구지역사회보장협의체 홈페이지를 열었습니다.\n협의체 소개, 실무분과와 12개 동 협의체 활동, 중구 복지자원, 지역사회보장계획 자료를 한곳에서 보실 수 있습니다.\n앞으로 회의·교육·모집 안내와 활동 소식을 이곳에서 꾸준히 전하겠습니다.",
    pin: false,
    photos: [],
    files: [],
    link: ""
  }
];

/* 첨부파일 주소: notice/ 폴더 파일은 그대로, 나머지는 구글 드라이브 보기 */
function noticeFileUrl(f) {
  if (!f || !f.id) return "";
  if (/^(notice\/|https?:)/.test(f.id)) return f.id;
  return "https://drive.google.com/file/d/" + encodeURIComponent(f.id) + "/view";
}

/* 공지 불러오기: 고정 공지 + 시트 공지, 상단 고정 먼저 → 최신순 */
async function loadNotices(opts) {
  opts = opts || {};
  let items = NOTICE_SEED.slice();
  if (NEWS_API_URL) {
    try {
      const res = await fetch(NEWS_API_URL + "?action=notice");
      const j = await res.json();
      if (j.status === "ok" && Array.isArray(j.items)) items = items.concat(j.items);
    } catch (e) { /* 연결이 안 되면 고정 공지만 보여줌 */ }
  }
  items.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return opts.limit ? items.slice(0, opts.limit) : items;
}

/* 최근 14일 안의 글이면 NEW */
function noticeIsNew(n) {
  const d = new Date(String(n.date) + "T00:00:00+09:00");
  return !isNaN(d) && (Date.now() - d.getTime()) < 14 * 864e5;
}

/* ───────────── 메인 화면 공지 팝업 ─────────────
 * 공지에 팝업 시작일·종료일(popupFrom, popupTo)이 있으면 그 기간 동안 첫 화면에 띄움.
 * '오늘 하루 보지 않기'는 이 브라우저에만 기억됨.
 */
function noticeToday() {
  try { return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }); }
  catch (e) { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
}

async function noticePopupInit() {
  const today = noticeToday();
  const items = await loadNotices();
  const live = items.filter(n => n.popupFrom && n.popupTo && n.popupFrom <= today && today <= n.popupTo);
  if (!live.length) return;
  live.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const n = live[0];
  const key = "notice-popup-hide-" + n.id;
  try { if (localStorage.getItem(key) === today) return; } catch (e) {}

  if (!document.getElementById("np-style")) {
    const st = document.createElement("style");
    st.id = "np-style";
    st.textContent = `
.np-back{position:fixed;inset:0;background:rgba(20,24,45,.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}
.np{outline:none;background:#fff;border-radius:18px;width:100%;max-width:440px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 50px rgba(20,24,45,.35)}
.np-top{background:var(--main,#3346A8);color:#fff;padding:14px 20px;font-size:13px;font-weight:700;letter-spacing:.02em}
.np-in{padding:18px 20px 6px;overflow:auto}
.np-in h2{font-size:19px;line-height:1.45;color:var(--main-d,#22307A);margin:0 0 10px}
.np-in .np-meta{font-size:12.5px;color:#6B7186;margin-bottom:8px}
.np-in img{width:100%;max-height:62vh;object-fit:contain;border-radius:10px;display:block;margin-bottom:12px}
.np-in p{font-size:15px;line-height:1.7;white-space:pre-line;margin:0;display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}
.np-act{display:flex;flex-direction:column;gap:8px;padding:14px 20px 4px}
.np-act a{display:block;text-align:center;border-radius:10px;padding:11px;font-weight:700;font-size:15px;text-decoration:none}
.np-act .go{background:var(--accent,#F2A33A);color:#3a2500}
.np-act .lk{border:1px solid var(--line,#E3E6EF);color:var(--main-d,#22307A)}
.np-foot{display:flex;border-top:1px solid #E3E6EF;margin-top:12px}
.np-foot button{flex:1;border:0;background:#F7F8FC;padding:13px;font:inherit;font-size:14px;color:#454B60;cursor:pointer}
.np-foot button+button{border-left:1px solid #E3E6EF}
.np-foot button:hover{background:#EEF0F8}`;
    document.head.appendChild(st);
  }

  const wrap = document.createElement("div");
  wrap.className = "np-back";
  wrap.innerHTML = `
    <div class="np" role="dialog" aria-modal="true" aria-labelledby="np-title" tabindex="-1">
      <div class="np-top">📢 ${newsEsc(n.head || "공지")}</div>
      <div class="np-in">
        <div class="np-meta">${newsDate(n.date)}</div>
        <h2 id="np-title">${newsEsc(n.title)}</h2>
        ${(n.photos || []).length ? newsImg(n.photos[0], 900, n.title) : ""}
        ${(n.photos || []).length ? "" : `<p>${newsEsc(n.body)}</p>`}
      </div>
      <div class="np-act">
        <a class="go" href="notice.html#${encodeURIComponent(n.id)}">자세히 보기 →</a>
        ${n.link ? `<a class="lk" href="${newsEsc(n.link)}" target="_blank" rel="noopener">관련 페이지 바로가기</a>` : ""}
      </div>
      <div class="np-foot">
        <button type="button" data-a="today">오늘 하루 보지 않기</button>
        <button type="button" data-a="close">닫기</button>
      </div>
    </div>`;
  const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  wrap.addEventListener("click", e => {
    if (e.target === wrap) return close();
    const b = e.target.closest("button[data-a]");
    if (!b) return;
    if (b.dataset.a === "today") { try { localStorage.setItem(key, today); } catch (err) {} }
    close();
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(wrap);
  wrap.querySelector(".np").focus();
}
