import React from 'react';
import { render, screen } from '@testing-library/react';
import NewScan from './NewScan';

test('renders learn react link', () => {
  render(<NewScan />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
