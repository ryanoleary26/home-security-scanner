import { render, screen } from '@testing-library/react';
import ErrorPage from './ErrorPage';

test('renders the error page', () => {
  render(<ErrorPage />);
  const linkElement = screen.getByText(/message goes here/i);
  expect(linkElement).toBeInTheDocument();
});
