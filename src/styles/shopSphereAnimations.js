shopSphereAnimationCSS = `
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  a, button, article, img { transition: color .25s ease, background-color .25s ease, border-color .25s ease, box-shadow .3s ease, transform .3s ease; }
  button:active, a:active { transform: scale(.98); }
  .ss-scroll-reveal {
    opacity: 0; transform: translate3d(0, 26px, 0);
    transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1);
    transition-delay: var(--ss-delay, 0ms);
  }
  .ss-scroll-reveal.ss-visible { opacity: 1; transform: translate3d(0,0,0); }
  .lux-hero { isolation: isolate; }
  .lux-hero-glow {
    position: absolute; width: 26rem; height: 26rem; border-radius: 50%;
    filter: blur(75px); opacity: .45; pointer-events: none;
    animation: ss-glow-drift 12s ease-in-out infinite alternate;
  }
  .lux-glow-one { top: -9rem; left: -8rem; background: rgba(251,146,60,.28); }
  .lux-glow-two { right: -8rem; bottom: -10rem; background: rgba(234,88,12,.18); animation-delay: -5s; }
  .lux-hero-badge {
    display: inline-flex; align-items: center; border: 1px solid rgba(234,88,12,.2);
    border-radius: 999px; padding: .65rem 1rem; color: #9a3412; background: rgba(255,255,255,.75);
    font-size: .78rem; font-weight: 700; box-shadow: 0 8px 30px rgba(124,45,18,.06);
    backdrop-filter: blur(12px); animation: ss-rise .8s both;
  }
  .lux-gradient-text {
    color: transparent; background: linear-gradient(105deg,#c2410c,#f97316 52%,#a16207);
    -webkit-background-clip: text; background-clip: text;
  }
  .lux-primary-btn, .lux-secondary-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .7rem;
    border-radius: 1rem; padding: .95rem 1.4rem; font-weight: 700;
  }
  .lux-primary-btn { color: white; background: linear-gradient(110deg,#ea580c,#c2410c); box-shadow: 0 14px 30px rgba(194,65,12,.22); }
  .lux-primary-btn:hover { color: white; transform: translateY(-3px); box-shadow: 0 18px 38px rgba(194,65,12,.3); }
  .lux-secondary-btn { color: #7c2d12; border: 1px solid rgba(154,52,18,.2); background: rgba(255,255,255,.75); }
  .lux-secondary-btn:hover { background: white; transform: translateY(-3px); }
  .lux-benefit {
    display: flex; align-items: center; gap: .8rem; padding: 1rem; text-align: left;
    border: 1px solid rgba(120,53,15,.1); border-radius: 1rem; background: rgba(255,255,255,.75);
    box-shadow: 0 8px 24px rgba(120,53,15,.04); backdrop-filter: blur(10px);
  }
  .lux-benefit h4 { color: #292524; font-size: .9rem; font-weight: 800; }
  .lux-benefit p { margin-top: .2rem; color: #78716c; font-size: .75rem; }
  .lux-benefit-icon { display: grid; width: 2.6rem; height: 2.6rem; flex: none; place-items: center; border-radius: .85rem; color: #c2410c; background: #ffedd5; font-size: 1.2rem; }
  .lux-gallery-wrapper { position: relative; max-width: 35rem; margin-inline: auto; }
  .lux-gallery-label { display: flex; align-items: center; justify-content: center; gap: .55rem; margin-bottom: 1rem; color: #78716c; font-size: .78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .lux-live-dot { width: .5rem; height: .5rem; border-radius: 50%; background: #16a34a; box-shadow: 0 0 0 5px rgba(22,163,74,.12); animation: ss-pulse 1.8s infinite; }
  .lux-gallery-grid { display: grid; height: 34rem; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 1rem; overflow: hidden; mask-image: linear-gradient(to bottom,transparent,black 8%,black 92%,transparent); }
  .lux-image-column { display: flex; flex-direction: column; gap: 1rem; }
  .lux-scroll-up { animation: ss-up 28s linear infinite; }
  .lux-scroll-down { animation: ss-down 32s linear infinite; }
  .lux-gallery-grid:hover .lux-image-column { animation-play-state: paused; }
  .lux-image-card { position: relative; flex: none; overflow: hidden; border: 4px solid rgba(255,255,255,.85); border-radius: 1.35rem; background: #f5f5f4; box-shadow: 0 14px 35px rgba(41,37,36,.1); }
  .lux-image-card img { width: 100%; height: 100%; object-fit: cover; }
  .lux-image-card:hover img, article:hover img { transform: scale(1.055); }
  .lux-image-tall { height: 17rem; } .lux-image-small { height: 11rem; } .lux-image-medium { height: 14rem; }
  .lux-image-caption { position: absolute; right: .65rem; bottom: .65rem; left: .65rem; padding: .65rem .8rem; border-radius: .8rem; color: white; background: rgba(28,25,23,.5); font-size: .75rem; font-weight: 700; backdrop-filter: blur(12px); }
  .lux-floating-card { position: absolute; right: -1rem; bottom: 2rem; display: flex; align-items: center; gap: .8rem; padding: 1rem 1.2rem; border: 1px solid rgba(255,255,255,.8); border-radius: 1.1rem; background: rgba(255,255,255,.88); box-shadow: 0 18px 45px rgba(41,37,36,.14); backdrop-filter: blur(16px); animation: ss-float 4s ease-in-out infinite; }
  .lux-floating-icon { display: grid; width: 2.7rem; height: 2.7rem; place-items: center; border-radius: .9rem; color: white; background: linear-gradient(135deg,#f97316,#c2410c); font-size: 1.3rem; }
  .lux-floating-card p { color: #c2410c; font-size: .62rem; font-weight: 800; letter-spacing: .1em; }
  .lux-floating-card h4 { margin-top: .2rem; color: #292524; font-size: .85rem; font-weight: 800; }
  @keyframes ss-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ss-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes ss-pulse { 0%,100% { box-shadow: 0 0 0 5px rgba(22,163,74,.12); } 50% { box-shadow: 0 0 0 9px rgba(22,163,74,.04); } }
  @keyframes ss-glow-drift { to { transform: translate3d(28px,20px,0) scale(1.12); } }
  @keyframes ss-up { to { transform: translateY(-50%); } }
  @keyframes ss-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
  @media (max-width: 640px) {
    .lux-gallery-grid { height: 27rem; gap: .7rem; }
    .lux-image-column { gap: .7rem; }
    .lux-image-tall { height: 14rem; } .lux-image-small { height: 9rem; } .lux-image-medium { height: 11rem; }
    .lux-floating-card { right: -.25rem; bottom: 1rem; padding: .75rem; }
    .lux-floating-card h4 { font-size: .75rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    *,*::before,*::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    .ss-scroll-reveal { opacity: 1; transform: none; }
  }
`;

export default shopSphereAnimationCSS;
