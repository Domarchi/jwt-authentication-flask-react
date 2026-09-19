import { Link } from "react-router-dom";

export const Home = () => {
	const hasSession = Boolean(sessionStorage.getItem("token"));

	return (
		<main className="home-page">
			<section className="hero-card">
				<span className="eyebrow">Autenticación segura</span>
				<h1>Flask + React con JWT</h1>
				<p>
					Un flujo simple de registro, inicio de sesión y acceso a una
					página protegida mediante JSON Web Tokens.
				</p>
				<div className="hero-actions">
					<Link className="auth-button primary-link" to={hasSession ? "/private" : "/signup"}>
						{hasSession ? "Ir al área privada" : "Crear una cuenta"}
					</Link>
					{!hasSession && (
						<Link className="secondary-link" to="/login">Iniciar sesión</Link>
					)}
				</div>
				<div className="feature-grid" aria-label="Características del proyecto">
					<article>
						<strong>Contraseñas</strong>
						<span>Guardadas de forma cifrada.</span>
					</article>
					<article>
						<strong>Sesión</strong>
						<span>Token conservado en sessionStorage.</span>
					</article>
					<article>
						<strong>Protección</strong>
						<span>Acceso privado validado por el backend.</span>
					</article>
				</div>
			</section>
		</main>
	);
};
