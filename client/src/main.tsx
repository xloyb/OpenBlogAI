import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './output.css'
//import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './ui/components/404.tsx'
import Layout from './ui/components/Layout.tsx'
import Dashboard from './ui/dashboard/dashboard.tsx'
//import SidebarLayout from './ui/SideBarLayout.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
</StrictMode>,
)
