import { useRef } from 'react';

type BlinkCardProps = {
  index: number;
  children: React.ReactNode;
  className?: string;
};
const BlinkCard = ({ index, children, className = '' }: BlinkCardProps) => {
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
      {children}
    </div>
  );
};

export default BlinkCard;
