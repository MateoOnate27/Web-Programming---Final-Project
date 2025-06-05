import { useState, useEffect } from 'react';
import api from '../services/api';

interface DetalleActividad {
  id: number;
  codigo_item: string;
  producto_esperado: string | null;
}

const CrearEvidencia = ({ onCreado }: { onCreado: () => void }) => {
  const [detalleActividadId, setDetalleActividadId] = useState<number | ''>('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [detalles, setDetalles] = useState<DetalleActividad[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    api.get('api/detalles/', {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => setDetalles(res.data))
      .catch(() => setError('No se pudieron cargar las actividades'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo || !detalleActividadId) {
      alert('Por favor, selecciona un archivo y una actividad.');
      return;
    }

    const formData = new FormData();
    formData.append('detalle_actividad', detalleActividadId.toString());
    formData.append('nombre_archivo', archivo);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    try {
      await api.post('api/evidencias/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      alert('Evidencia subida correctamente');
      setDetalleActividadId('');
      setArchivo(null);
      setError('');
      onCreado();
    } catch (e: any) {
      if (e.response) {
        setError(JSON.stringify(e.response.data));
        console.error('Error al subir la evidencia:', e.response.data);
      } else {
        setError('Error al subir la evidencia');
        console.error(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5>Subir Evidencia</h5>

      <div className="mb-3">
        <label htmlFor="detalleActividad" className="form-label">Actividad</label>
        <select
          id="detalleActividad"
          className="form-select"
          value={detalleActividadId}
          onChange={e => setDetalleActividadId(Number(e.target.value))}
          required
        >
          <option value="">Seleccione una actividad</option>
          {detalles.map(d => (
            <option key={d.id} value={d.id}>
              {d.codigo_item} - {d.producto_esperado ?? `Actividad #${d.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="archivo" className="form-label">Archivo PDF</label>
        <input
          type="file"
          id="archivo"
          className="form-control"
          onChange={e => setArchivo(e.target.files ? e.target.files[0] : null)}
          accept="application/pdf"
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">Subir</button>
    </form>
  );
};

export default CrearEvidencia;








