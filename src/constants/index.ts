const navLinks = [
  { key: 'intro', link: '#hero' },
  { key: 'projects', link: '#projects' },
  { key: 'experience', link: '#experience' },
  { key: 'approach', link: '#approach' },
  { key: 'reviews', link: '#reviews' },
  { key: 'skills', link: '#skills' },
  { key: 'contact', link: '#contact' },
];

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
    stack: 'React, TypeScript, GraphQL, Node.js',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    role: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Responsible for frontend architecture and performance optimization.',
    screenshots: [
      '/images/project-pt.webp',
      '/images/project-pt.webp',
      '/images/project-pt.webp',
    ],
    color: '#168be8',
    mainImage: '/images/project-pt.webp',
  },
  {
    id: 'index',
    name: 'Index Marketing',
    stack: 'React, Next.js, Tailwind CSS',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    role: 'Lorem ipsum dolor sit amet. Led the frontend development team.',
    screenshots: [
      '/images/project-index.webp',
      '/images/project-index.webp',
    ],
    color: 'linear-gradient(126.6deg, rgba(44, 115, 210, 1) 3.4%, rgba(251, 234, 255, 1) 127.9%)',
    mainImage: '/images/project-index.webp',
  },
  {
    id: 'sagama',
    name: 'Sagama',
    stack: 'Vue.js, Nuxt, SCSS',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    role: 'Lorem ipsum dolor sit amet. Full-stack development and deployment.',
    screenshots: [
      '/images/project-sagama.webp',
      '/images/project-sagama.webp',
    ],
    color: 'linear-gradient(109.6deg, rgba(163, 213, 255, 1) 11.3%, rgba(4, 137, 137, 1) 86.7%)',
    mainImage: '/images/project-sagama.webp',
  },
];

export { navLinks, expCards, feedbacks, stickers, projectsData };
