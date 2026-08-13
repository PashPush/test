const expCards = [
  {
    index: 0,
    imgPath: '/images/exp1.svg',
    url: 'https://powerthesaurus.org/_about',
    logoPath: '/images/logo1.webp',
    logoAlt: 'Power Thesaurus',
  },
  {
    index: 1,
    imgPath: '/images/exp2.webp',
    url: 'https://index63.ru/moskva/',
    logoPath: '/images/logo2.webp',
    logoAlt: 'Index Marketing',
  },
  {
    index: 2,
    imgPath: '/images/exp3.svg',
    url: 'https://gazon63.ru/',
    logoPath: '/images/logo3.webp',
    logoAlt: 'Sagama',
  },
  {
    index: 3,
    imgPath: '/images/exp4.webp',
    url: 'https://www.tltsu.ru/about_the_university/mission',
    logoPath: '/images/logo4.webp',
    logoAlt: 'TGU',
  },
];

const feedbacks = [
  { index: 0, imgPath: '/images/alex.webp', icon: '💪' },
  { index: 1, imgPath: '/images/andrey.webp', icon: '🔥' },
  { index: 2, imgPath: '/images/sergey.webp', icon: '🚀' },
];

const stickers = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }];

const projectsData = [
  {
    id: 'pt',
    name: 'Power Thesaurus',
    screenshots: ['/images/project-screenshots-1-1.webp', '/images/project-screenshots-1-2.webp'],
    color: 'linear-gradient(126.6deg, rgba(22, 139, 232, 1) 30.4% 3.4%, rgba(148, 208, 255, 1) 127.9%)',
    mainImage: '/images/project-pt1.webp',
  },
  {
    id: 'index',
    name: 'Index Marketing',
    screenshots: [
      '/images/project-screenshots-2-1.webp',
      '/images/project-screenshots-2-2.webp',
      '/images/project-screenshots-2-3.webp',
    ],
    color: 'linear-gradient(126.6deg, rgba(44, 115, 210, 1) 3.4%, rgba(251, 234, 255, 1) 127.9%)',
    mainImage: '/images/project-index1.webp',
  },
  {
    id: 'sagama',
    name: 'Sagama',
    screenshots: [
      '/images/project-screenshots-3-1.webp',
      '/images/project-screenshots-3-2.webp',
      '/images/project-screenshots-3-3.webp',
    ],
    color: 'linear-gradient(109.6deg, rgba(163, 213, 255, 1) 11.3%, rgba(4, 137, 137, 1) 86.7%)',
    mainImage: '/images/project-sagama1.webp',
  },
];

export { expCards, feedbacks, stickers, projectsData };
