import { useEffect, useState } from 'react';
import api from '../services/api';

interface Periodo {
  id: number;
  nombre_periodo: string;
}

interface Props {
  onCreado: () => void; // Función que se llama cuando se crea una planificación
}

export default function CrearPlanificacion({ onCreado }: Props) {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [periodoId, setPeriodoId] = useState<number | ''>('');
  const [version, setVersion] = useState(1);
  const [estado, setEstado] = useState('pendiente');
  const [error, setError] = useState('');

  useEffect(() => {
    // Traemos los periodos académicos para el select
    const fetchPeriodos = async () => {
      try {
        const res = await api.get('api/periodos/');
        setPeriodos(res.data);
      } catch (e) {
        console.error('Error al cargar periodos', e);
      }
    };
    fetchPeriodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodoId) {
      setError('Debe seleccionar un periodo académico');
      return;
    }
    setError(''); // Limpiamos el error

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión.');
        return;
      }

      await api.post('api/planificaciones/', {
        periodo: periodoId,
        version,
        estado,
      }, {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      alert('Planificación creada correctamente');
      setPeriodoId('');
      setVersion(1);
      setEstado('pendiente');
      onCreado(); // Avisamos al componente padre que la planificación fue creada
    } catch (e: any) {
      if (e.response) {
        setError(JSON.stringify(e.response.data));
        console.error('Error al crear planificación:', e.response.data);
      } else {
        setError('Error al crear planificación');
        console.error(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5>Crear Nueva Planificación</h5>

      <div className="mb-3">
        <label htmlFor="periodo" className="form-label">Periodo Académico</label>
        <select
          id="periodo"
          className="form-select"
          value={periodoId}
          onChange={e => setPeriodoId(Number(e.target.value))}
          required
        >
          <option value="">Seleccione un periodo</option>
          {periodos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre_periodo}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="version" className="form-label">Versión</label>
        <input
          type="number"
          id="version"
          className="form-control"
          value={version}
          min={1}
          onChange={e => setVersion(Number(e.target.value))}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="estado" className="form-label">Estado</label>
        <select
          id="estado"
          className="form-select"
          value={estado}
          onChange={e => setEstado(e.target.value)}
          required
        >
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">Crear</button>
    </form>
  );
}


