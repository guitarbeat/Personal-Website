import React from 'react';
import { AuthProvider } from './components/effects/Matrix/AuthContext.js';
import { NotionProvider } from './contexts/NotionContext.tsx';
import { render } from '@testing-library/react';

const AllProviders = ({ children }) => {
  return (
    <AuthProvider>
      <NotionProvider>
        {children}
      </NotionProvider>
    </AuthProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
