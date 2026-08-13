import type { ExperimentConfig } from './engine';

// --- Section order experiment ---

export type SectionKey = 'projects' | 'experience' | 'approach' | 'reviews' | 'skills';

const DEFAULT_ORDER: SectionKey[] = ['projects', 'experience', 'approach', 'reviews', 'skills'];

export const sectionOrderExperiment: ExperimentConfig<SectionKey[]> = {
  id: 'sectionOrder',
  enabled: false,
  variants: [
    { id: 'control', value: DEFAULT_ORDER },
    {
      id: 'experienceFirst',
      value: ['experience', 'projects', 'approach', 'reviews', 'skills'],
    },
  ],
};

// --- Review text experiment ---

interface TextOverrides {
  overrides: {
    ru: Record<string, string>;
    en: Record<string, string>;
  };
}

export const reviewTextExperiment: ExperimentConfig<TextOverrides> = {
  id: 'reviewText',
  enabled: false,
  variants: [
    {
      id: 'control',
      value: { overrides: { ru: {}, en: {} } },
    },
    {
      id: 'shortReviews',
      value: {
        overrides: {
          ru: {
            'feedbacks.0.review': 'Быстро разбирается в чужом коде и аккуратно улучшает его. Повышает уровень команды.',
            'feedbacks.1.review': 'Тестирует свой код, находит баги до релиза. Общение лёгкое и продуктивное.',
            'feedbacks.2.review': 'Берёт задачу — делает в срок, с продуманным UX и чистым кодом.',
          },
          en: {
            'feedbacks.0.review':
              'Quickly understands unfamiliar code and improves it carefully. Raises the team level.',
            'feedbacks.1.review': 'Tests his code, finds bugs before release. Easy and productive to work with.',
            'feedbacks.2.review': 'Takes a task — delivers on time, with thoughtful UX and clean code.',
          },
        },
      },
    },
  ],
};

// --- Experience card review text experiment ---

export const expReviewTextExperiment: ExperimentConfig<TextOverrides> = {
  id: 'expReviewText',
  enabled: false,
  variants: [
    {
      id: 'control',
      value: { overrides: { ru: {}, en: {} } },
    },
    {
      id: 'detailedReviews',
      value: {
        overrides: {
          ru: {
            'expCards.0.review':
              'Павел быстро адаптировался и стал ключевым участником команды. Его вклад в оптимизацию и новые фичи заметно продвинул продукт.',
            'expCards.1.review':
              'Толковый и позитивный разработчик. Быстро влился в коллектив и показал отличные результаты.',
          },
          en: {
            'expCards.0.review':
              'Pavel quickly adapted and became a key team member. His contributions to optimization and new features significantly advanced the product.',
            'expCards.1.review':
              'A competent and positive developer. Quickly integrated into the team and showed excellent results.',
          },
        },
      },
    },
  ],
};

// --- All experiments ---

export const allExperiments = [
  sectionOrderExperiment,
  reviewTextExperiment,
  expReviewTextExperiment,
];
