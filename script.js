const bagCount = document.querySelector(".bag-count");
const toast = document.querySelector(".toast");
let itemCount = 0;
let toastTimer;

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    itemCount += 1;
    bagCount.textContent = itemCount;
    toast.textContent = `${button.dataset.product} ditambahkan ke tas`;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
  });
});

// ponytail: Web Audio hiss; swap to <audio src> if need real sample
let _actx;
const heroBottle = document.querySelector(".hero-bottle");
const sprayBox = document.querySelector(".spray-container");
let sprayTimer;
if (heroBottle && sprayBox) {
  const doSpray = () => {
    heroBottle.classList.remove("is-spraying");
    void heroBottle.offsetWidth;
    sprayBox.innerHTML = '<i class="spray-puff p1"></i><i class="spray-puff p2"></i>';
    heroBottle.classList.add("is-spraying");
    // synth spray hiss — triggered on user gesture so no autoplay block
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        _actx = _actx || new AC();
        if (_actx.state === "suspended") _actx.resume();
        const play = (delay, vol, dur) => {
          const t = _actx.currentTime + delay;
          const len = (_actx.sampleRate * dur) | 0;
          const buf = _actx.createBuffer(1, len, _actx.sampleRate);
          const ch = buf.getChannelData(0);
          for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4);
          const src = _actx.createBufferSource();
          src.buffer = buf;
          const bp = _actx.createBiquadFilter();
          bp.type = "bandpass"; bp.frequency.value = 5200; bp.Q.value = 0.8;
          const hp = _actx.createBiquadFilter();
          hp.type = "highpass"; hp.frequency.value = 3000;
          const g = _actx.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(vol, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(bp).connect(hp).connect(g).connect(_actx.destination);
          src.start(t); src.stop(t + dur);
        };
        play(0, 0.45, 0.2);
        play(0.34, 0.28, 0.16);
      }
    } catch {}
    clearTimeout(sprayTimer);
    sprayTimer = setTimeout(() => {
      heroBottle.classList.remove("is-spraying");
      sprayBox.innerHTML = "";
    }, 820);
  };
  heroBottle.addEventListener("click", doSpray);
  heroBottle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doSpray(); }
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector(".form-message");
  message.textContent = "Terima kasih! Kamu akan menerima kabar terbaru dari Sillage.";
  message.classList.add("success");
  event.currentTarget.reset();
});
