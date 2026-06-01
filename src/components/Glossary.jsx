export function Glossary() {
  return (
    <details className="glossary" open>
      <summary className="glossary-summary">
        <span className="glossary-title">O que é o Diagrama de Pareto?</span>
        <span className="glossary-toggle-hint">clique para expandir / recolher</span>
      </summary>

      <div className="glossary-body">
        <p className="glossary-intro">
          O Diagrama de Pareto é uma ferramenta de qualidade baseada no{" "}
          <strong>princípio 80/20</strong>, formulado pelo economista Vilfredo Pareto
          (1848–1923). A ideia central é que, na maioria das situações,{" "}
          <strong>uma minoria de causas explica a maioria dos problemas</strong>.
          Identificar e agir sobre essas causas é muito mais eficiente do que
          tentar resolver tudo ao mesmo tempo.
        </p>

        <div className="glossary-terms">
          <div className="term">
            <dt>Frequência</dt>
            <dd>
              Quantidade de ocorrências de cada categoria — pode ser número de
              defeitos, reclamações, custo em reais ou qualquer métrica relevante.
            </dd>
          </div>
          <div className="term">
            <dt>% acumulada</dt>
            <dd>
              Soma percentual das categorias ordenadas da maior para a menor.
              Mostra quanto do total já está "explicado" ao incluir cada causa
              progressivamente.
            </dd>
          </div>
          <div className="term">
            <dt>Poucas vitais</dt>
            <dd>
              As categorias destacadas em laranja: poucas causas que concentram
              a maior parte do problema. São elas que merecem atenção e recursos
              prioritários.
            </dd>
          </div>
          <div className="term">
            <dt>Muitas triviais</dt>
            <dd>
              As demais categorias, em bege: individualmente têm pouco impacto.
              Resolvê-las só faz sentido após eliminar as poucas vitais.
            </dd>
          </div>
          <div className="term">
            <dt>Linha de corte</dt>
            <dd>
              O percentual acumulado (padrão 80%) que define a fronteira entre
              poucas vitais e muitas triviais. Pode ser ajustado conforme o
              contexto da análise.
            </dd>
          </div>
        </div>

        <ol className="glossary-steps">
          <li>Informe o nome da empresa</li>
          <li>Liste as categorias e suas frequências (ou carregue um exemplo)</li>
          <li>Ajuste a linha de corte se necessário</li>
          <li>Clique em <strong>Gerar Diagrama</strong> para visualizar os resultados</li>
          <li>Identifique as <strong>poucas vitais</strong> e concentre esforços nelas</li>
        </ol>
      </div>
    </details>
  );
}
