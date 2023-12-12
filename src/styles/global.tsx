import { GlobalStyles, useTheme } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateGlobalStyle() {
  const theme = useTheme();
  return (
    <GlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          outline: 0,
          boxSizing: 'border-box',
        },
        [theme.breakpoints.down(1080)]: {
          html: {
            fontSize: '93.75%',
          },
        },
        [theme.breakpoints.down(720)]: {
          html: {
            fontSize: '87.5%',
          },
        },
        'body, input, button, select, textarea': {
          font: '400 1rem roboto, sans-serif',
        },
        button: {
          cursor: 'pointer',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      }}
    />
  );
}
