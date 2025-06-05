import { useEffect, useState } from 'react';
import api from '../services/api';
import CrearActividad from '../components/CrearActividad';

interface Actividad {
  id: number;
  funcion_sustantiva: string;
  codigo_item: string;
  descripcion: string;
  horas_max_periodo: number | null;
  horas_max_semanal: number | null;
  evidencia_requerida: boolean;
}

export default function Actividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [error, setError] = useState('');

  const cargarActividades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('api/actividades/', {
        headers: { Authorization: `Token ${token}` },
      });
      setActividades(res.data);
      setError('');
    } catch (error) {
      setError('Error al cargar actividades');
      console.error('Error al cargar actividades:', error);
    }
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  const eliminarActividad = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta actividad?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      await api.delete(`api/actividades/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      alert('Actividad eliminada');
      cargarActividades();
    } catch (error) {
      alert('Error eliminando actividad');
      console.error('Error eliminando actividad:', error);
    }
  };

  return (
    <>
      <h3 className="text-center mb-4">📋 Actividades</h3>
      <CrearActividad onCreado={cargarActividades} />
      {error && <div className="alert alert-danger">{error}</div>}
      {actividades.length === 0 ? (
        <div className="alert alert-warning text-center">No hay actividades registradas.</div>
      ) : (
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Función</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Horas Máx. Periodo</th>
              <th>Horas Máx. Semanal</th>
              <th>Evidencia</th>
              <th>Acciones</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {actividades.map((act, index) => (
              <tr key={act.id}>
                <td>{index + 1}</td>
                <td>{act.funcion_sustantiva}</td>
                <td>{act.codigo_item}</td>
                <td>{act.descripcion || '-'}</td>
                <td>{act.horas_max_periodo ?? '-'}</td>
                <td>{act.horas_max_semanal ?? '-'}</td>
                <td>{act.evidencia_requerida ? 'Sí' : 'No'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarActividad(act.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}






