import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import BlinkCard from '@/shared/ui/BlinkCard';
import { feedbacks } from '../model/feedbacks';

const Review = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;

    const cards = gsap.utils.toArray('.feedback-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    tl.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.4,
        ease: 'power2.out',
      }
    );
  }, []);
  return (
    <div ref={sectionRef} id="reviews" className="review">
      <div className="review-wrapper">
        {feedbacks.map((feedback, index) => (
          <BlinkCard
            card={{ ...feedback, review: t(`feedbacks.${feedback.index}.review`) }}
            key={index}
            icon={feedback.icon}
            index={index}
            className="feedback-card"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <img
                  src={feedback.imgPath}
                  alt={t(`feedbacks.${feedback.index}.name`)}
                  width={60}
                  height={60}
                  className="rounded-full md:w-20 w-15 aspect-square object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="font-bold">{t(`feedbacks.${feedback.index}.name`)}</p>
                <p className="text-white-50 sm:text-base text-sm">{t(`feedbacks.${feedback.index}.position`)}</p>
              </div>
            </div>
          </BlinkCard>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 bg-gradient-to-b to-black w-full h-full"></div>
    </div>
  );
};

export default Review;
