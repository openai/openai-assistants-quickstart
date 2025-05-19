import React from 'react';
import { render } from '@testing-library/react';
import Chat from './chat';

test('renders Chat component without crashing', () => {
  render(<Chat />);
});
