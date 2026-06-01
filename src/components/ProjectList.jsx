import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function ProjectList({ user, onNewProject, onOpenProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const deleteProject = async (id) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="wrap">
      <div className="head">
        <div className="head-top">
          <div>
            <div className="kicker">Ferramenta de Qualidade · 80/20</div>
            <h1>Meus Projetos</h1>
            <p className="sub">{user.email}</p>
          </div>
          <div className="head-actions">
            <button className="btn-save" onClick={onNewProject}>+ Novo projeto</button>
            <button className="btn-back" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Carregando projetos...</p>
      ) : projects.length === 0 ? (
        <div className="empty-projects">
          <p>Você ainda não tem projetos salvos.</p>
          <p>Clique em <strong>+ Novo projeto</strong> para começar.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="project-info" onClick={() => onOpenProject(p)}>
                <strong className="project-name">{p.company_name}</strong>
                <span className="project-meta">
                  {p.rows.length} {p.rows.length === 1 ? "categoria" : "categorias"} · atualizado em{" "}
                  {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <button className="del" onClick={() => deleteProject(p.id)} title="Excluir projeto">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <footer className="app-footer">por Marcel Dancini</footer>
    </div>
  );
}
