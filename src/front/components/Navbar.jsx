import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const hasSession = Boolean(sessionStorage.getItem("token"));

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<nav className="site-nav" aria-label="Navegación principal">
			<div className="nav-inner">
				<Link className="brand" to="/">JWT Auth</Link>
				<div className="nav-links">
					{hasSession ? (
						<>
							<Link
								className={location.pathname === "/private" ? "active" : ""}
								to="/private"
							>
								Área privada
							</Link>
							<button type="button" className="logout-button" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<>
							<Link
								className={location.pathname === "/login" ? "active" : ""}
								to="/login"
							>
								Ingresar
							</Link>
							<Link className="nav-cta" to="/signup">Registrarme</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
