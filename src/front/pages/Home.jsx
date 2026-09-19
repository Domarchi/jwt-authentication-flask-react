import { Link } from "react-router-dom";

export const Home = () => {
    const hasSession = Boolean(sessionStorage.getItem("token"));

    return (
        <main className="home-page">
            <section className="home-content">
                <p className="project-label">Proyecto de autenticación</p>
                <h1>Sistema de autenticación con JWT</h1>
                <p className="home-description">
                    Aplicación creada con React y Flask. Permite registrar usuarios,
                    iniciar sesión y acceder a una página protegida.
                </p>

                <div className="home-actions">
                    <Link className="auth-button home-primary" to={hasSession ? "/private" : "/signup"}>
                        {hasSession ? "Ver área privada" : "Crear cuenta"}
                    </Link>
                    {!hasSession && (
                        <Link className="secondary-link" to="/login">
                            Iniciar sesión
                        </Link>
                    )}
                </div>

                <div className="project-info">
                    <p><strong>Frontend:</strong> React</p>
                    <p><strong>Backend:</strong> Flask</p>
                    <p><strong>Autenticación:</strong> JWT</p>
                </div>
            </section>
        </main>
    );
};
