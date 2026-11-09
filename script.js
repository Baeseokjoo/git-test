const progressBar = document.getElementById("progressBar");
const heroBg = document.getElementById("heroBg");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== [효과 1] 아래에서 위로 페이드 인 =====
   IntersectionObserver로 요소가 화면에 15% 이상 보이면 is-visible 클래스 추가 */
const fadeObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // 한 번 나타나면 감시 종료
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".fade-up").forEach((el) => fadeObserver.observe(el));

/* ===== 스크롤 시 실행되는 효과들 ===== */
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;

  /* [효과 3] 스크롤 진행률 계산 (0 ~ 1) → 프로그래스 바 가로 길이에 반영 */
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  /* [효과 2] 히어로 패럴랙스 : 스크롤 양의 30%만큼만 배경을 아래로 이동
     → 콘텐츠보다 느리게 움직이는 것처럼 보임 (히어로가 보일 때만 계산) */
  if (!reduceMotion && scrollY < window.innerHeight) {
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
  }

  ticking = false;
}

/* requestAnimationFrame으로 프레임당 한 번만 계산 → 부드럽고 성능 부담 적음 */
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", onScroll);
onScroll(); // 첫 로드 시 초기값 적용
