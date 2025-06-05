import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import api from '../services/api'; // Asegúrate de que api esté configurado para hacer solicitudes al backend


// Estructura de los datos del informe
interface InformeDatos {
  docente: string;
  cedula: string;
  escuela: string;
  periodo: string;
  numero_semanas: number;
  resumen_actividades: {
    docencia: number;
    investigacion: number;
    vinculacion: number;
    gestion: number;
    total: number;
  };
  observaciones: string;
}

// Componente para la vista de impresión del informe
const InformePrint = React.forwardRef<HTMLDivElement, { datos: InformeDatos | null }>(
  ({ datos }, ref) => (
    <div ref={ref} style={{ margin: '0 auto', width: '80%' }}>
      {datos ? (
        <>
          <h2 className="text-center mb-4">Informe de Ejecución del Periodo Académico</h2>

          <section>
            <h4>Datos Informativos</h4>
            <p><strong>Docente:</strong> {datos.docente}</p>
            <p><strong>Cédula:</strong> {datos.cedula}</p>
            <p><strong>Escuela:</strong> {datos.escuela}</p>
            <p><strong>Periodo:</strong> {datos.periodo}</p>
            <p><strong>Número de semanas:</strong> {datos.numero_semanas}</p>
          </section>

          <section>
            <h4>Resumen de Actividades</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Función</th>
                  <th>Horas Ejecutadas</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Docencia</td><td>{datos.resumen_actividades.docencia}</td></tr>
                <tr><td>Investigación</td><td>{datos.resumen_actividades.investigacion}</td></tr>
                <tr><td>Vinculación</td><td>{datos.resumen_actividades.vinculacion}</td></tr>
                <tr><td>Gestión</td><td>{datos.resumen_actividades.gestion}</td></tr>
                <tr><td><strong>Total</strong></td><td><strong>{datos.resumen_actividades.total}</strong></td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h4>Observaciones</h4>
            <p>{datos.observaciones || 'Ninguna'}</p>
          </section>
        </>
      ) : (
        <p>Cargando informe...</p>
      )}
    </div>
  )
);

// Componente principal para cargar y mostrar el informe
const InformeResumen = () => {
  const [datos, setDatos] = useState<InformeDatos | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('api/informe_resumen/')
      .then(res => {
        setDatos(res.data);
      })
      .catch(err => {
        console.error('Error al cargar el informe:', err);
      });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">📄 Informe de Ejecución del Periodo Académico</h3>
      <InformePrint ref={componentRef} datos={datos} />
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handlePrint}>
          Imprimir / Exportar PDF
        </button>
      </div>
    </div>
  ); ;
};

export default InformeResumen;
