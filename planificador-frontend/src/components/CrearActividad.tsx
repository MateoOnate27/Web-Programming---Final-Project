import { useState } from 'react';
import api from '../services/api';

interface Props {
  onCreado: () => void;
}

export default function CrearActividad({ onCreado }: Props) {
  const [funcionSustantiva, setFuncionSustantiva] = useState('docencia');
  const [codigoItem, setCodigoItem] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horasMaxPeriodo, setHorasMaxPeriodo] = useState<number | ''>('');
  const [horasMaxSemanal, setHorasMaxSemanal] = useState<number | ''>('');
  const [evidenciaRequerida, setEvidenciaRequerida] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigoItem) {
      setError('El código del ítem es obligatorio');
      return;
    }

    try {
      await api.post('api/actividades/', {
        funcion_sustantiva: funcionSustantiva,
        codigo_item: codigoItem,
        descripcion,
        horas_max_periodo: horasMaxPeriodo || null,
        horas_max_semanal: horasMaxSemanal || null,
        evidencia_requerida: evidenciaRequerida,
      });
      setFuncionSustantiva('docencia');
      setCodigoItem('');
      setDescripcion('');
      setHorasMaxPeriodo('');
      setHorasMaxSemanal('');
      setEvidenciaRequerida(false);
      setError('');
      onCreado();
    } catch (error) {
      setError('Error al crear la actividad');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5>Crear Nueva Actividad</h5>

      <div className="mb-3">
        <label className="form-label">Función Sustantiva</label>
        <select
          className="form-select"
          value={funcionSustantiva}
          onChange={e => setFuncionSustantiva(e.target.value)}
        >
          <option value="docencia">Docencia</option>
          <option value="investigacion">Investigación</option>
          <option value="vinculacion">Vinculación</option>
          <option value="gestion">Gestión</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Código Item</label>
        <input
          type="text"
          className="form-control"
          value={codigoItem}
          onChange={e => setCodigoItem(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          rows={3}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Horas Máx. Periodo</label>
        <input
          type="number"
          className="form-control"
          value={horasMaxPeriodo}
          onChange={e => setHorasMaxPeriodo(Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Horas Máx. Semanal</label>
        <input
          type="number"
          className="form-control"
          value={horasMaxSemanal}
          onChange={e => setHorasMaxSemanal(Number(e.target.value))}
        />
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={evidenciaRequerida}
          onChange={e => setEvidenciaRequerida(e.target.checked)}
          id="evidenciaCheck"
        />
        <label className="form-check-label" htmlFor="evidenciaCheck">
          Evidencia requerida
        </label>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">Crear Actividad</button>
    </form>
  );
}
