import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders housing calculator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/housing cost & roi calculator/i);
  expect(titleElement).toBeInTheDocument();
});
