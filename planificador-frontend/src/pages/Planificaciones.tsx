import { useEffect, useState } from 'react';
import api from '../services/api';
import CrearPlanificacion from '../components/CrearPlanificacion';

interface Planificacion {
  id: number;
  periodo: string;
  version: number;
  estado: string;
}

export default function Planificaciones() {
  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
  const [error, setError] = useState('');

  const cargarPlanificaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('api/planificaciones/', {
        headers: { Authorization: `Token ${token}` },
      });
      setPlanificaciones(res.data);
      setError('');
    } catch (error) {
      setError('Error al obtener planificaciones');
      console.error('Error al obtener planificaciones:', error);
    }
  };

  useEffect(() => {
    cargarPlanificaciones();
  }, []);

  const eliminarPlanificacion = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta planificación?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      await api.delete(`api/planificaciones/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      alert('Planificación eliminada');
      cargarPlanificaciones();
    } catch (error) {
      alert('Error eliminando planificación');
      console.error('Error eliminando planificación:', error);
    }
  };

  return (
    <>
      <h3 className="text-center mb-4">📚 Mis Planificaciones</h3>
      <CrearPlanificacion onCreado={cargarPlanificaciones} />
      {error && <div className="alert alert-danger">{error}</div>}
      {planificaciones.length === 0 ? (
        <div className="alert alert-warning text-center">No tienes planificaciones registradas.</div>
      ) : (
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Periodo</th>
              <th>Versión</th>
              <th>Estado</th>
              <th>Acciones</th> {/* Nueva columna para botones */}
            </tr>
          </thead>
          <tbody>
            {planificaciones.map((plan, index) => (
              <tr key={plan.id}>
                <td>{index + 1}</td>
                <td>{plan.periodo}</td>
                <td>{plan.version}</td>
                <td>
                  <span className={`badge bg-${plan.estado === 'aprobado' ? 'success' : 'secondary'}`}>
                    {plan.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarPlanificacion(plan.id)}
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


