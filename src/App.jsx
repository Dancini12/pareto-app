import { useState, useEffect, useMemo } from "react";
import { supabase } from "./lib/supabase";
import { AuthScreen } from "./components/AuthScreen";
import { ProjectList } from "./components/ProjectList";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Glossary } from "./components/Glossary";
import { DataTable } from "./components/DataTable";
import { ParetoChart } from "./components/ParetoChart";
import "./styles/App.css";

const EMPTY_ROWS = [
  { categoria: "", valor: "" },
  { categoria: "", valor: "" },
  { categoria: "", valor: "" },
];

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [view, setView] = useState("projects"); // "projects" | "new" | "tool"
  const [currentProject, setCurrentProject] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [rows, setRows] = useState(EMPTY_ROWS);
  const [threshold, setThreshold] = useState(80);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { chartData, vitalCount, vitalShare } = useMemo(() => {
    const limpos = rows
      .filter((r) => r.categoria.trim() !== "" && Number(r.valor) > 0)
      .map((r) => ({ categoria: r.categoria, valor: Number(r.valor) }))
      .sort((a, b) => b.valor - a.valor);

    const total = limpos.reduce((s, r) => s + r.valor, 0) || 1;

    let acumulado = 0;
    let vitalCount = 0;
    let atingiu = false;
    const chartData = limpos.map((r) => {
      acumulado += r.valor;
      const acumuladoPct = (acumulado / total) * 100;
      const vital = !atingiu;
      if (!atingiu) {
        vitalCount += 1;
        if (acumuladoPct >= threshold) atingiu = true;
      }
      return {
        categoria: r.categoria,
        valor: r.valor,
        acumuladoPct: Number(acumuladoPct.toFixed(1)),
        vital,
      };
    });

    const somaVital = chartData
      .slice(0, vitalCount)
      .reduce((s, r) => s + r.valor, 0);
    const vitalShare = (somaVital / total) * 100;

    return { chartData, vitalCount, vitalShare };
  }, [rows, threshold]);

  const canSubmit =
    rows.filter((r) => r.categoria.trim() !== "" && Number(r.valor) > 0).length >= 2;

  const handleStart = (name) => {
    setCompanyName(name);
    setRows(EMPTY_ROWS);
    setThreshold(80);
    setSubmitted(false);
    setCurrentProject(null);
    setView("tool");
  };

  const handleOpenProject = (project) => {
    setCompanyName(project.company_name);
    setRows(project.rows);
    setThreshold(project.threshold);
    setSubmitted(false);
    setCurrentProject(project);
    setView("tool");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    const payload = {
      user_id: session.user.id,
      company_name: companyName,
      rows,
      threshold,
    };
    if (currentProject) {
      await supabase.from("projects").update(payload).eq("id", currentProject.id);
    } else {
      const { data } = await supabase.from("projects").insert(payload).select().single();
      setCurrentProject(data);
    }
    setSaving(false);
    setSaveMsg("Salvo!");
    setTimeout(() => setSaveMsg(""), 2500);
  };

  if (loadingAuth) return null;
  if (!session) return <AuthScreen />;

  if (view === "projects") {
    return (
      <ProjectList
        user={session.user}
        onNewProject={() => setView("new")}
        onOpenProject={handleOpenProject}
      />
    );
  }

  if (view === "new") {
    return <WelcomeScreen onStart={handleStart} onBack={() => setView("projects")} />;
  }

  return (
    <div className="wrap">
      <div className="app-byline">Criado por Marcel Dancini</div>

      <div className="head">
        <div className="head-top">
          <div>
            <div className="kicker">Ferramenta de Qualidade · 80/20</div>
            <h1>Diagrama de Pareto</h1>
          </div>
          <div className="head-actions no-print">
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={saving || !companyName}
            >
              {saveMsg || (saving ? "Salvando..." : "Salvar projeto")}
            </button>
            <button className="btn-back" onClick={() => setView("projects")}>
              Meus projetos
            </button>
          </div>
        </div>
        <p className="sub">
          Identifique as <b>poucas causas</b> responsáveis pela maior parte de
          um problema — e concentre esforços onde realmente importa.
        </p>
      </div>

      <Glossary />

      <div className="grid">
        <DataTable
          rows={rows}
          setRows={setRows}
          threshold={threshold}
          setThreshold={setThreshold}
          canSubmit={canSubmit}
          onSubmit={() => setSubmitted(true)}
          onReset={() => setSubmitted(false)}
        />
        <ParetoChart
          chartData={chartData}
          threshold={threshold}
          vitalCount={vitalCount}
          vitalShare={vitalShare}
          companyName={companyName}
          submitted={submitted}
        />
      </div>
      <footer className="app-footer">por Marcel Dancini</footer>
    </div>
  );
}
