// script.js
// Consome a API pública da Brapi (https://brapi.dev) para exibir cotações da B3.
// Os 4 tickers abaixo funcionam sem token de autenticação.

const ATIVOS_DISPONIVEIS = ["PETR4", "VALE3", "ITUB4", "MGLU3"];

const selectAtivo = document.getElementById("ticker-select");
const btnConsultar = document.getElementById("btn-consultar");
const areaResultado = document.getElementById("resultado");
const tickerTrack = document.getElementById("ticker-track");

const formatBRL = (valor) =>
  typeof valor === "number"
    ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

const formatPercent = (valor) =>
  typeof valor === "number" ? `${valor > 0 ? "+" : ""}${valor.toFixed(2)}%` : "—";

const formatVolume = (valor) =>
  typeof valor === "number" ? valor.toLocaleString("pt-BR") : "—";

// -------- Consulta principal --------
async function buscarCotacao(ticker) {
  areaResultado.innerHTML = `<div class="placeholder"><span class="placeholder-glyph">···</span><p>Consultando ${ticker}...</p></div>`;
  btnConsultar.disabled = true;
  btnConsultar.textContent = "Consultando...";

  try {
    const resposta = await fetch(`https://brapi.dev/api/quote/${ticker}`);

    if (!resposta.ok) {
      throw new Error(`API respondeu com status ${resposta.status}`);
    }

    const dados = await resposta.json();
    const ativo = dados?.results?.[0];

    if (!ativo || typeof ativo.regularMarketPrice !== "number") {
      throw new Error("Ativo não encontrado na resposta.");
    }

    renderizarCotacao(ativo);
  } catch (erro) {
    console.error("Erro ao buscar cotação:", erro);
    renderizarErro();
   } finally {
    btnConsultar.disabled = false;
    btnConsultar.textContent = "Consultar";
  }
}

function renderizarCotacao(ativo) {
  document.title = `${ativo.symbol} — Investfy`;
  const horaAtualizacao = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const variacao = ativo.regularMarketChangePercent;
  const emAlta = typeof variacao === "number" && variacao >= 0;

  areaResultado.innerHTML = `
    <div class="quote-card">
      <div class="quote-head">
        <span class="quote-symbol">${ativo.symbol ?? "—"}</span>
      </div>
      <p class="quote-name">${ativo.longName ?? ativo.shortName ?? "Nome não disponível"}</p>
      <p class="quote-updated">Atualizado às ${horaAtualizacao}</p>

      <div class="quote-price">${formatBRL(ativo.regularMarketPrice)}</div>
      <span class="quote-change ${emAlta ? "up" : "down"}">
        ${emAlta ? "▲" : "▼"} ${formatPercent(variacao)}
      </span>

      <div class="quote-grid">
        <div>
          <span class="label">Abertura</span>
          <span class="value">${formatBRL(ativo.regularMarketOpen)}</span>
        </div>
        <div>
          <span class="label">Fech. anterior</span>
          <span class="value">${formatBRL(ativo.regularMarketPreviousClose)}</span>
        </div>
        <div>
          <span class="label">Máxima do dia</span>
          <span class="value">${formatBRL(ativo.regularMarketDayHigh)}</span>
        </div>
        <div>
          <span class="label">Mínima do dia</span>
          <span class="value">${formatBRL(ativo.regularMarketDayLow)}</span>
        </div>
        <div>
          <span class="label">Volume</span>
          <span class="value">${formatVolume(ativo.regularMarketVolume)}</span>
        </div>
        <div>
          <span class="label">Moeda</span>
          <span class="value">${ativo.currency ?? "BRL"}</span>
        </div>
      </div>
    </div>
  `;
}

function renderizarErro() {
  areaResultado.innerHTML = `
    <div class="erro-card">
      <strong>Não foi possível obter a cotação</strong>
      <p>O ativo pode estar indisponível no momento ou a API está fora do ar. Tente novamente em instantes.</p>
    </div>
  `;
}

// -------- Faixa de ticker no topo --------
async function iniciarTickerTape() {
  const linhas = [];

  for (const ticker of ATIVOS_DISPONIVEIS) {
    try {
      const resposta = await fetch(`https://brapi.dev/api/quote/${ticker}`);
      if (!resposta.ok) continue;
      const dados = await resposta.json();
      const ativo = dados?.results?.[0];
      if (!ativo) continue;

      const variacao = ativo.regularMarketChangePercent;
      const emAlta = typeof variacao === "number" && variacao >= 0;

      linhas.push(`
        <span>
          <span class="tk-symbol">${ativo.symbol}</span>
          ${formatBRL(ativo.regularMarketPrice)}
          <span class="${emAlta ? "tk-up" : "tk-down"}">${emAlta ? "▲" : "▼"} ${formatPercent(variacao)}</span>
        </span>
      `);
    } catch {
      // Se um ativo falhar, apenas pula — a faixa não é crítica pra funcionalidade principal.
      continue;
    }
  }

  if (linhas.length === 0) {
    tickerTrack.innerHTML = `<span>Cotações indisponíveis no momento.</span>`;
    return;
  }

  // Duplica o conteúdo para o loop de rolagem ficar contínuo (ver @keyframes no CSS).
  tickerTrack.innerHTML = linhas.join("") + linhas.join("");
}

// -------- Eventos --------
btnConsultar.addEventListener("click", () => {
  buscarCotacao(selectAtivo.value);
});

iniciarTickerTape();
