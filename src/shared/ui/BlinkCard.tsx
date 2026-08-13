import { useRef } from 'react';

type BlinkCardData = {
  review: string;
  info?: string;
  imgPath?: string;
  url?: string;
  logoPath?: string;
  logoAlt?: string;
  title?: string;
  date?: string;
  responsibilities?: string[];
  name?: string;
  position?: string;
  icon?: string;
  index?: number;
};

type BlinkCardProps = {
  card: BlinkCardData;
  index: number;
  icon?: string;
  children: React.ReactNode;
  className?: string;
};
const BlinkCard = ({ card, index, icon = 'stars', children, className = '' }: BlinkCardProps) => {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRefs.current[index] as HTMLElement;
    if (!card) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const mouseX = clientX - rect.left - rect.width / 2;
      const mouseY = clientY - rect.top - rect.height / 2;

      let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
      angle = (angle + 360) % 360;

      card.style.setProperty('--start', `${angle + 60}`);
      rafRef.current = null;
    });
  };

  return (
    <div
      ref={el => {
        cardRefs.current[index] = el;
      }}
      onMouseMove={handleMouseMove(index)}
      className={`card card-border rounded-xl sm:p-10 p-8 mb-5 break-inside-avoid-column ${className}`}
    >
      <div className="glow"></div>
      <div className="flex items-center gap-1">
        {icon === 'stars' ? (
          Array.from({ length: 5 }, (_, i) => <img key={i} src="/images/star.png" alt="star" className="size-5 mb-5" />)
        ) : (
          <span className="icon">{icon}</span>
        )}
      </div>
      <div className="mb-3">
        <p className="text-white-50 sm:text-lg text-base">{card.review}</p>
        {card.info && <p className="text-[#899aae] text-base mt-3">{card.info}</p>}
      </div>
      {children}
    </div>
  );
};

export default BlinkCard;
