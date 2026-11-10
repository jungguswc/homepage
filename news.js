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
const NOTICE_HEADS = ["공지", "공고", "모집", "교육", "회의"];

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
