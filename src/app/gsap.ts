import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

console.log('%cЗдравствуй, дорогой друг!', 'color: #2cc800; font-weight: bold; font-size: 20px;');
