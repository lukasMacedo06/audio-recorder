import { ThemeProvider, CssBaseline } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import ThemeMaterialUI from './styles/materialUI';
import Page from './pages';
import BaseErrorHandler from './pages/Errors/BaseErrorHandler';
import AppProvider from './hooks';
import GlobalStyles from './styles/global';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <ErrorBoundary FallbackComponent={BaseErrorHandler}>
        <AppProvider>
          <Page />
        </AppProvider>
        <CssBaseline />
        <GlobalStyles />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
