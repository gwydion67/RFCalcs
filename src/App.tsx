import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from '@/pages/NotFound';
import Providers from '@/providers/Providers';
import Layout from '@/pages/Layout';
import Dashboard from '@/pages/Dashboard';
import ThemeProvider from './providers/ThemeProvider';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Providers />}>
            <Route path='/' element={<Layout />} >
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
