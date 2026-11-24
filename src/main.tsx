import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Ensure these imports are present and paths are correct
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './hooks/useLanguageMultilingual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Ensure LanguageProvider is the OUTER wrapper */}
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
);
