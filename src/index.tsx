import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
window.addEventListener('DOMContentLoaded', () => {
    const root = createRoot(document.getElementById('root')!);
    root.render(<App />);
});
