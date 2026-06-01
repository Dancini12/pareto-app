import { useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = (nextTab) => {
    setTab(nextTab);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(traduzirErro(error.message));
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("As senhas não coincidem.");
    if (password.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(traduzirErro(error.message));
    } else {
      setSuccess(
        `Cadastro realizado! Enviamos um link de confirmação para ${email}. Verifique sua caixa de entrada (e o spam) e clique no link para ativar seu acesso.`
      );
    }
    setLoading(false);
  };

  return (
    <div className="welcome">
      <div className="welcome-card">
        <span className="kicker">Ferramenta de Qualidade · 80/20</span>
        <h1>Diagrama de Pareto</h1>
        <p className="welcome-sub">
          Crie sua conta para salvar e acessar seus projetos de análise.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => reset("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => reset("register")}
          >
            Criar conta
          </button>
        </div>

        {success ? (
          <div className="auth-success">
            <strong>E-mail enviado!</strong>
            <p>{success}</p>
            <button
              type="button"
              className="btn-back-link"
              style={{ marginTop: 12 }}
              onClick={() => reset("login")}
            >
              Voltar para o login
            </button>
          </div>
        ) : (
          <form
            onSubmit={tab === "login" ? handleLogin : handleRegister}
            className="welcome-form"
          >
            <label className="field-label" htmlFor="auth-email">E-mail</label>
            <input
              id="auth-email"
              type="email"
              className="welcome-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />

            <label className="field-label" htmlFor="auth-password">Senha</label>
            <input
              id="auth-password"
              type="password"
              className="welcome-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />

            {tab === "register" && (
              <>
                <label className="field-label" htmlFor="auth-confirm">Confirmar senha</label>
                <input
                  id="auth-confirm"
                  type="password"
                  className="welcome-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                />
              </>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-gerar" disabled={loading}>
              {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        )}

        <p className="author">por Marcel Dancini</p>
      </div>
    </div>
  );
}

function traduzirErro(msg) {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("User already registered")) return "Este e-mail já está cadastrado.";
  if (msg.includes("Password should be")) return "A senha deve ter ao menos 6 caracteres.";
  return msg;
}
