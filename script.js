/* =========================================================
   CWG Innovation — Interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav__links");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  /* ---------- Nav dropdown menus ---------- */
  const dropdowns = document.querySelectorAll(".nav__item--has-menu");
  const closeDropdowns = (except) => {
    dropdowns.forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-open");
      const t = item.querySelector(".nav__trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  };
  dropdowns.forEach((item) => {
    const trigger = item.querySelector(".nav__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      closeDropdowns(item);
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__item--has-menu")) closeDropdowns(null);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdowns(null);
  });

  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      closeDropdowns(null);
    }
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // stagger siblings slightly for a polished cascade
            entry.target.style.transitionDelay = `${Math.min(i * 60, 180)}ms`;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters ---------- */
  const stats = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !prefersReduced) {
    const sio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach((s) => sio.observe(s));
  } else {
    stats.forEach((s) => (s.textContent = s.dataset.count + (s.dataset.suffix || "")));
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById("leadForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const name = form.name.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !valid) {
        note.style.color = "var(--red)";
        note.textContent = "Please add your name and a valid work email so we can reply.";
        return;
      }
      note.style.color = "var(--ember)";
      note.textContent = "Thanks, " + name.split(" ")[0] + ". We'll be in touch within one working day.";
      form.reset();
    });
  }

  /* ---------- Year ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Ambient ember particle system ---------- */
  const canvas = document.getElementById("ember-canvas");
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, embers, raf;

  const COLORS = ["#ff2d55", "#ff6b35", "#a855f7", "#d946ef"];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.round((innerWidth * innerHeight) / 38000);
    embers = Array.from({ length: Math.max(24, Math.min(count, 80)) }, makeEmber);
  };

  function makeEmber(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + Math.random() * 60 * dpr,
      r: (Math.random() * 1.8 + 0.6) * dpr,
      vy: (Math.random() * 0.5 + 0.25) * dpr,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      life: Math.random(),
      flick: Math.random() * 0.04 + 0.01,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const e of embers) {
      e.y -= e.vy;
      e.x += e.vx + Math.sin(e.y * 0.01) * 0.2 * dpr;
      e.life += e.flick;
      const alpha = (0.35 + Math.sin(e.life) * 0.3) * 0.55;
      ctx.beginPath();
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
      g.addColorStop(0, e.color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
      ctx.fill();
      if (e.y < -20 * dpr) Object.assign(e, makeEmber(false));
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(resize, 200);
  });
  // pause when tab hidden to save resources
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
})();
