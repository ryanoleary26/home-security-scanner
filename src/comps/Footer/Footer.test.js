import { render, screen } from '@testing-library/react';
import Home from '../../home/Home';

test('renders the footer', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Footer/i);
  expect(linkElement).toBeInTheDocument();
});
