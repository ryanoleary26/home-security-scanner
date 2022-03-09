import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './NavBar';

test('renders the navbar', () => {
  const container = render(<NavBar />);
  expect(container.firstChild).toHaveClass('navbar');
});
