import { render, screen } from '@testing-library/react';
import Results from './Results';

test('renders results page', () => {
  render(<Results />);
  const linkElement = screen.getByText(/Scan Results/i);
  expect(linkElement).toBeInTheDocument();
});
