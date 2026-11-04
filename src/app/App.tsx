import { useEffect } from 'react';
import i18n, { preferredLanguage } from '@/shared/i18n';
import { useRefreshOnResize } from '@/shared/lib/useRefreshOnResize';
import { ABProvider } from '@/features/ab-testing';
import HomePage from '@/pages/home/ui/HomePage';

const App = () => {
  useRefreshOnResize();

  // Hydration happens in Russian (the prerendered language); switch only afterwards.
  useEffect(() => {
    if (i18n.language !== preferredLanguage) void i18n.changeLanguage(preferredLanguage);
  }, []);

  return (
    <ABProvider>
      <HomePage />
    </ABProvider>
  );
};

export default App;
