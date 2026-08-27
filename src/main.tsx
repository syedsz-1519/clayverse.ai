import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './hooks/useLanguage.tsx';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { registerServiceWorker } from './registerSW.ts';

// Register Service Worker for offline curriculum caching
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);

