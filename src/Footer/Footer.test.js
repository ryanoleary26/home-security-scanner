import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the footer', () => {
  render(<App />);
  const linkElement = screen.getByText(/Footer/i);
  expect(linkElement).toBeInTheDocument();
});
