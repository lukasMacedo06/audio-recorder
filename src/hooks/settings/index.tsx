import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Zendesk } from 'src/services/Zendesk';
import { SettingsProps } from 'src/interfaces/settings';

interface SettingsProviderProps {
  children: ReactNode;
}

interface ContextProps {
  settings: SettingsProps;
  loading: boolean;
}

const SettingsContext = createContext<ContextProps>({} as ContextProps);

const zend = new Zendesk();

function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState({} as SettingsProps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    zend.getSettings().then((settingsAux: SettingsProps) => {
      setSettings(settingsAux);
      setLoading(false);
      i18n.changeLanguage(settingsAux.language);
    });
  }, [i18n]);

  const contextValues = useMemo(() => {
    return { settings, loading };
  }, [settings, loading]);

  return (
    <SettingsContext.Provider value={contextValues}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings(): ContextProps {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within an SettingProvider');
  }

  return context;
}

export { SettingsProvider, useSettings };
