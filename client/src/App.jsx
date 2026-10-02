import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultatsPage from './pages/ResultatsPage';
import FichePage from './pages/FichePage';
import PublierPage from './pages/PublierPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/resultats" element={<ResultatsPage />} />
        <Route path="/logements/:id" element={<FichePage />} />
        <Route path="/publier" element={<PublierPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Route>
    </Routes>
  );
}

export default App