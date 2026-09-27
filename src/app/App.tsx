import { useRefreshOnResize } from '@/shared/lib/useRefreshOnResize';
import HomePage from '@/pages/home/ui/HomePage';

const App = () => {
  useRefreshOnResize();

  return <HomePage />;
};

export default App;
