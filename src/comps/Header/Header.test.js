import { render, screen } from '@testing-library/react';
import Home from '../../home/Home';

test('renders the header', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Home Security Scanner/i);
  expect(linkElement).toBeInTheDocument();
});
