import { useViewportHeight } from '@/shared/lib/useViewportHeight';
import HomePage from '@/pages/home/ui/HomePage';

const App = () => {
  useViewportHeight();

  return <HomePage />;
};

export default App;
