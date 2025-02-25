import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import App from './App.tsx'
import Error from './Error.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:room_id" element={<App />} />
        <Route path="/" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
