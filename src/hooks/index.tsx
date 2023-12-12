import { ReactNode } from 'react';
import { SettingsProvider } from './settings';

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps): JSX.Element {
  return <SettingsProvider>{children}</SettingsProvider>;
}

export default AppProvider;
