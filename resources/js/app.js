import React from 'react';
import { createRoot } from 'react-dom/client';
import Feedback from './components/Feedback';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <Feedback />
  </React.StrictMode>
);