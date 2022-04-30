import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportTemplate from './ReportTemplate';

test('renders results page', () => {
  render(<ReportTemplate />);
  const linkElement = screen.getByText(/Scan Results/i);
  expect(linkElement).toBeInTheDocument();
});
