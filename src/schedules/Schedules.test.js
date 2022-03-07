import { render, screen } from '@testing-library/react';
import Schedules from './Schedules';

test('renders schedules page', () => {
  render(<Schedules />);
  const linkElement = screen.getByText(/schedules/i);
  expect(linkElement).toBeInTheDocument();
});
