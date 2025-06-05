import { useEffect, useState } from 'react';
import api from '../services/api';
import CrearEvidencia from '../components/CrearEvidencia';

interface Evidencia {
  id: number;
  nombre_archivo: string;
  url_archivo: string | null;
  fecha_subida: string;
}

export default function Evidencias() {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [error, setError] = useState('');

  const cargarEvidencias = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('api/evidencias/', {
        headers: { Authorization: `Token ${token}` },
      });
      setEvidencias(res.data);
      setError('');
    } catch (error) {
      setError('Error al cargar evidencias');
      console.error('Error al cargar evidencias:', error);
    }
  };

  useEffect(() => {
    cargarEvidencias();
  }, []);

  const eliminarEvidencia = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta evidencia?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      await api.delete(`api/evidencias/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      alert('Evidencia eliminada');
      cargarEvidencias();
    } catch (error) {
      alert('Error eliminando evidencia');
      console.error('Error eliminando evidencia:', error);
    }
  };

  return (
    <div className="container">
      <h3 className="text-center mb-4">📎 Evidencias</h3>

      <CrearEvidencia onCreado={cargarEvidencias} />

      {error && <div className="alert alert-danger">{error}</div>}

      {evidencias.length === 0 ? (
        <div className="alert alert-warning text-center">No hay evidencias registradas.</div>
      ) : (
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Archivo</th>
              <th>Fecha Subida</th>
              <th>Acciones</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {evidencias.map((ev, index) => (
              <tr key={ev.id}>
                <td>{index + 1}</td>
                <td>
                  {ev.url_archivo ? (
                    <a href={ev.url_archivo} target="_blank" rel="noreferrer">{ev.nombre_archivo}</a>
                  ) : (
                    ev.nombre_archivo
                  )}
                </td>
                <td>{new Date(ev.fecha_subida).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarEvidencia(ev.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}







