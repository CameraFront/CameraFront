import { Provider } from 'react-redux';
import { store } from '@/app/store';

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export default GlobalStateProvider;
