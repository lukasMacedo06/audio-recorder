import { CircularProgress } from '@mui/material';
import { Container } from './style';

interface CircularLoadingProsp {
  alignOn?: string;
  size?: number;
}

function CircularLoading({
  alignOn = 'center',
  size = 40,
}: CircularLoadingProsp): JSX.Element {
  return (
    <Container alignOn={alignOn}>
      <CircularProgress size={size} />
    </Container>
  );
}

export default CircularLoading;
