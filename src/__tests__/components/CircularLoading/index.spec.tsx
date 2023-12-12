import { render } from '@testing-library/react';
import CircularLoading from 'src/components/CircularLoading';

describe('CircularLoading component', () => {
  it('should render without crashing', () => {
    render(<CircularLoading />);
  });
});
