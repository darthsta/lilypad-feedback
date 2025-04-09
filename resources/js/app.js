import React from 'react';
import { createRoot } from 'react-dom/client';
import Feedback from './components/Feedback';

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <Feedback />
  </React.StrictMode>
);