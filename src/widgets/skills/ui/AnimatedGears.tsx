import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const GEAR_PATH =
  'M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.35997276079435 21.46047782418268 L31.35997276079435 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20';

const GEARS = [
  { size: 300, left: 10, top: 68, rotation: 220 },
  { size: 240, left: 180, top: 312, rotation: -220 },
  { size: 180, left: 378, top: 234, rotation: 220 },
];

const AnimatedGears = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panel = rootRef.current?.closest('section');
      const pinned = rootRef.current?.closest('main');
      if (!panel || !pinned) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: () => `+=${window.innerHeight + (pinned.scrollWidth - document.documentElement.clientWidth) * 0.75}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<SVGSVGElement>('.gear').forEach((gear, i) => {
        tl.to(gear, { rotation: GEARS[i].rotation, ease: 'none' }, 0);
      });
    },
    { scope: rootRef }
  );

  return (
    <div className="gears" ref={rootRef} aria-hidden="true">
      {GEARS.map(({ size, left, top }) => (
        <svg
          key={size}
          className="gear"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-50 -50 100 100"
          width={size}
          height={size}
          style={{ left, top }}
        >
          <path fill="#fff" d={GEAR_PATH} />
        </svg>
      ))}
    </div>
  );
};

export default AnimatedGears;
