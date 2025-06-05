import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Planificaciones from './pages/Planificaciones';
import Actividades from './pages/Actividades';
import Evidencias from './pages/Evidencias';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InformeResumen from './pages/InformeResumen';
import DetalleActividades from './pages/DetalleActividades';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/planificaciones"
          element={
            <ProtectedRoute>
              <Layout>
                <Planificaciones />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades"
          element={
            <ProtectedRoute>
              <Layout>
                <Actividades />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/evidencias"
          element={
            <ProtectedRoute>
              <Layout>
                <Evidencias />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Layout>
                <Perfil />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/informe"
          element={
            <ProtectedRoute>
              <Layout>
                <InformeResumen />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/detalle-actividades"
          element={
            <ProtectedRoute>
              <Layout>
                <DetalleActividades />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




