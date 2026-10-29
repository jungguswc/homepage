/* 중구지역사회보장협의체 활동소식 공통 스크립트
 * API_URL: Apps Script 웹 앱 주소 (배포 후 붙여넣기). 비어 있으면 아래 SEED 소식만 보입니다.
 */
const NEWS_API_URL = "";

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

function newsPhotoUrl(p, size) {
  if (!p) return "";
  if (/^(news\/|https?:)/.test(p)) return p;
  return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(p) + "&sz=w" + (size || 1200);
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
