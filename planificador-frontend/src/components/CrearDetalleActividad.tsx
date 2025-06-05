import { useState, useEffect } from 'react';
import api from '../services/api';

interface Planificacion {
  id: number;
  periodo: string; // o el campo que quieras mostrar para identificar
}

interface Actividad {
  id: number;
  codigo_item: string;
  descripcion: string | null;
}

interface Props {
  onCreado: () => void;
}

export default function CrearDetalleActividad({ onCreado }: Props) {
  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const [planificacionId, setPlanificacionId] = useState<number | ''>('');
  const [actividadId, setActividadId] = useState<number | ''>('');
  const [productoEsperado, setProductoEsperado] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [horasAsignadas, setHorasAsignadas] = useState<number | ''>('');
  const [horasPeriodo, setHorasPeriodo] = useState<number | ''>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }
    api.get('api/planificaciones/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => setPlanificaciones(res.data))
      .catch(() => setError('Error al cargar planificaciones'));

    api.get('api/actividades/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => setActividades(res.data))
      .catch(() => setError('Error al cargar actividades'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planificacionId || !actividadId || !horasAsignadas || !horasPeriodo) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    try {
      await api.post('api/detalles/', {
        planificacion: planificacionId,
        actividad: actividadId,
        producto_esperado: productoEsperado,
        justificacion: justificacion,
        horas_asignadas: horasAsignadas,
        horas_periodo: horasPeriodo,
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setPlanificacionId('');
      setActividadId('');
      setProductoEsperado('');
      setJustificacion('');
      setHorasAsignadas('');
      setHorasPeriodo('');
      setError('');
      onCreado();
    } catch (e: any) {
      if (e.response) {
        setError(JSON.stringify(e.response.data));
      } else {
        setError('Error al crear detalle de actividad');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5>Crear Detalle de Actividad</h5>

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
              {p.periodo || `Planificación #${p.id}`}
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
              {a.codigo_item} - {a.descripcion}
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

      <div className="mb-3">
        <label className="form-label">Horas Periodo</label>
        <input
          type="number"
          className="form-control"
          value={horasPeriodo}
          min={0}
          onChange={e => setHorasPeriodo(Number(e.target.value))}
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">Crear Detalle Actividad</button>
    </form>
  );
}



