import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">Inicio</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/planificaciones">Planificaciones</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/actividades">Actividades</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/detalle-actividades">Detalles Actividades</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/evidencias">Evidencias</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/informe">Informe</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/perfil">Perfil</Link></li>
        </ul>
        <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}




