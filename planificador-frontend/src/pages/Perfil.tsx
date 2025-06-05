import { useEffect, useState } from 'react';
import api from '../services/api';

interface PerfilUsuario {
  username: string;
  email: string;
  cedula: string;
  escuela: string;
  roles: string[];
}

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('api/protegida/');
        setPerfil(res.data);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  return (
    <>
      <h3 className="text-center mb-4">👤 Mi Perfil</h3>
      {!perfil ? (
        <p className="text-center">Cargando datos...</p>
      ) : (
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Usuario</th>
              <td>{perfil.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{perfil.email}</td>
            </tr>
            <tr>
              <th>Cédula</th>
              <td>{perfil.cedula}</td>
            </tr>
            <tr>
              <th>Escuela</th>
              <td>{perfil.escuela}</td>
            </tr>
            <tr>
              <th>Roles</th>
              <td>{perfil.roles.join(', ')}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}




