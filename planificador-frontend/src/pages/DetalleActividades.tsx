import { useEffect, useState } from 'react';
import api from '../services/api';

interface DetalleActividad {
  id: number;
  planificacion: number; // id planificacion
  actividad: number; // id actividad
  producto_esperado: string | null;
  justificacion: string | null;
  horas_asignadas: number;
}

interface Planificacion {
  id: number;
  version: number;
  periodo: { nombre_periodo: string } | string;
}

interface Actividad {
  id: number;
  codigo_item: string;
  descripcion: string | null;
}

export default function DetalleActividades() {
  const [detalles, setDetalles] = useState<DetalleActividad[]>([]);
  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const [planificacionId, setPlanificacionId] = useState<number | ''>('');
  const [actividadId, setActividadId] = useState<number | ''>('');
  const [productoEsperado, setProductoEsperado] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [horasAsignadas, setHorasAsignadas] = useState<number | ''>('');
  const [error, setError] = useState('');

  // Config con token para peticiones
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Token ${token}` } } : {};
  };

  useEffect(() => {
    const config = getConfig();
    if (!config.headers) {
      setError('No estás autenticado');
      return;
    }

    api.get('api/detalles/', config)
      .then(res => setDetalles(res.data))
      .catch(() => setError('Error al cargar detalles'));

    api.get('api/planificaciones/', config)
      .then(res => setPlanificaciones(res.data))
      .catch(() => setError('Error al cargar planificaciones'));

    api.get('api/actividades/', config)
      .then(res => setActividades(res.data))
      .catch(() => setError('Error al cargar actividades'));
  }, []);

  // Refrescar lista detalles
  const refreshDetalles = () => {
    const config = getConfig();
    if (!config.headers) return;

    api.get('api/detalles/', config)
      .then(res => setDetalles(res.data))
      .catch(() => setError('Error al cargar detalles'));
  };

  // Crear nuevo detalle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planificacionId || !actividadId || !horasAsignadas) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    setError('');
    const config = getConfig();
    if (!config.headers) {
      setError('No estás autenticado');
      return;
    }

    try {
      await api.post('api/detalles/', {
        planificacion: planificacionId,
        actividad: actividadId,
        producto_esperado: productoEsperado || null,
        justificacion: justificacion || null,
        horas_asignadas: horasAsignadas,
        horas_periodo: horasAsignadas,
      }, config);

      // Limpiar campos tras crear
      setPlanificacionId('');
      setActividadId('');
      setProductoEsperado('');
      setJustificacion('');
      setHorasAsignadas('');
      setError('');
      refreshDetalles();
    } catch (e: any) {
      if (e.response) {
        setError(JSON.stringify(e.response.data));
      } else {
        setError('Error al crear detalle de actividad');
      }
    }
  };

  // Función para eliminar detalle
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este detalle?')) return;

    const config = getConfig();
    if (!config.headers) {
      setError('No estás autenticado');
      return;
    }

    try {
      await api.delete(`api/detalles/${id}/`, config);
      refreshDetalles();
    } catch (e) {
      setError('Error al eliminar detalle');
      console.error(e);
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">📋 Detalles de Actividad</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered mb-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Código Item</th>
            <th>Producto Esperado</th>
            <th>Justificación</th>
            <th>Horas Asignadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => {
            const actividad = actividades.find(a => a.id === d.actividad);
            return (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{actividad ? actividad.codigo_item : '-'}</td>
                <td>{d.producto_esperado ?? '-'}</td>
                <td>{d.justificacion ?? '-'}</td>
                <td>{d.horas_asignadas}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
        <h5>Crear Nuevo Detalle de Actividad</h5>

        <div className="mb-3">
          <label className="form-label">Planificación</label>
          <select
            className="form-select"
            value={planificacionId}
            onChange={e => setPlanificacionId(Number(e.target.value))}
            required
          >
            <option value="">Selecciona una planificación</option>
            {planificaciones.map(p => (
              <option key={p.id} value={p.id}>
                Versión {p.version} {typeof p.periodo === 'string' ? p.periodo : p.periodo?.nombre_periodo || ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Actividad</label>
          <select
            className="form-select"
            value={actividadId}
            onChange={e => setActividadId(Number(e.target.value))}
            required
          >
            <option value="">Selecciona una actividad</option>
            {actividades.map(a => (
              <option key={a.id} value={a.id}>
                {a.codigo_item} - {a.descripcion || '-'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Producto Esperado (opcional)</label>
          <textarea
            className="form-control"
            value={productoEsperado}
            onChange={e => setProductoEsperado(e.target.value)}
            rows={2}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Justificación (opcional)</label>
          <textarea
            className="form-control"
            value={justificacion}
            onChange={e => setJustificacion(e.target.value)}
            rows={2}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Horas Asignadas</label>
          <input
            type="number"
            className="form-control"
            value={horasAsignadas}
            min={0}
            onChange={e => setHorasAsignadas(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Crear Detalle Actividad</button>
      </form>
    </div>
  );
}

