import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "";

const AuthCard = ({ title, subtitle, children, footer }) => (
    <main className="auth-page">
        <section className="auth-card" aria-labelledby="auth-title">
            <div className="auth-mark" aria-hidden="true">JWT</div>
            <h1 id="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
            {children}
            <p className="auth-footer">{footer}</p>
        </section>
    </main>
);

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "No pudimos crear la cuenta.");
                return;
            }

            navigate("/login", {
                state: { notice: "Cuenta creada. Ya puedes iniciar sesión." },
            });
        } catch {
            setError("No fue posible conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Crear cuenta"
            subtitle="Regístrate para acceder al área privada."
            footer={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="signup-email">Correo electrónico</label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                    required
                />

                <label htmlFor="signup-password">Contraseña</label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                    autoComplete="new-password"
                    required
                />

                {error && <div className="auth-alert error" role="alert">{error}</div>}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Registrarme"}
                </button>
            </form>
        </AuthCard>
    );
};

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "No pudimos iniciar la sesión.");
                return;
            }

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            navigate("/private");
        } catch {
            setError("No fue posible conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Iniciar sesión"
            subtitle="Usa tus credenciales para continuar."
            footer={<>¿No tienes cuenta? <Link to="/signup">Regístrate</Link></>}
        >
            {location.state?.notice && (
                <div className="auth-alert success" role="status">{location.state.notice}</div>
            )}
            <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                    required
                />

                <label htmlFor="login-password">Contraseña</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    required
                />

                {error && <div className="auth-alert error" role="alert">{error}</div>}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </AuthCard>
    );
};

export const Private = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const loadPrivateArea = async () => {
            try {
                const response = await fetch(`${API_URL}/api/private`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (!response.ok) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    navigate("/login", {
                        replace: true,
                        state: { notice: "Tu sesión expiró. Inicia sesión nuevamente." },
                    });
                    return;
                }

                setUser(data.user);
            } catch {
                setError("No fue posible cargar el área privada.");
            }
        };

        loadPrivateArea();
    }, [navigate]);

    return (
        <main className="private-page">
            <section className="private-card">
                <span className="private-badge">Acceso protegido</span>
                <h1>Área privada</h1>
                {error && <div className="auth-alert error" role="alert">{error}</div>}
                {!error && !user && <p>Validando tu sesión...</p>}
                {user && (
                    <>
                        <p>Tu token JWT es válido y el servidor autorizó esta página.</p>
                        <dl className="user-details">
                            <div><dt>Usuario</dt><dd>{user.email}</dd></div>
                            <div><dt>Estado</dt><dd>Activo</dd></div>
                        </dl>
                    </>
                )}
            </section>
        </main>
    );
};
