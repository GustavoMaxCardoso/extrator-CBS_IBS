/* ── Utilitários ──────────────────────────────────────────── */

let dadosItens = [];
let nomeArquivo = 'extrato_nfe';

function fmt(val) {
  return parseFloat(val).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function fmtR(val) {
  return 'R$ ' + fmt(val);
}

/* ── Tema Claro / Escuro ──────────────────────────────────── */
(function() {
  const saved = localStorage.getItem('nfe-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html  = document.documentElement;
  const atual = html.getAttribute('data-theme');
  const novo  = atual === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', novo);
  localStorage.setItem('nfe-theme', novo);
}

/* ── Carregar arquivo XML ─────────────────────────────────── */
function carregarArquivo(event) {
  const file = event.target.files[0];
  if (!file) return;
  lerArquivo(file);
}

function lerArquivo(file) {
  if (!file.name.toLowerCase().endsWith('.xml') && file.type !== 'text/xml' && file.type !== 'application/xml') {
    mostrarErro('Por favor, selecione um arquivo com extensão .xml');
    return;
  }

  nomeArquivo = file.name.replace(/\.xml$/i, '');

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('xmlInput').value = e.target.result;
    const dropText = document.getElementById('fileDropText');
    const dropArea = document.getElementById('fileDropArea');
    dropText.textContent = '✓ ' + file.name;
    dropArea.classList.add('file-loaded');
  };
  reader.onerror = function() {
    mostrarErro('Erro ao ler o arquivo. Tente novamente.');
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── Drag and Drop ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  const dropArea = document.getElementById('fileDropArea');

  dropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', function() {
    dropArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) lerArquivo(file);
  });
});

/* ── Limpar ───────────────────────────────────────────────── */
function limpar() {
  document.getElementById('xmlInput').value = '';
  document.getElementById('erro').style.display     = 'none';
  document.getElementById('resultado').style.display = 'none';

  const fileInput = document.getElementById('fileInput');
  if (fileInput) fileInput.value = '';
  const dropText = document.getElementById('fileDropText');
  if (dropText) dropText.textContent = 'Clique para selecionar o arquivo XML da NF-e';
  const dropArea = document.getElementById('fileDropArea');
  if (dropArea) dropArea.classList.remove('file-loaded');

  nomeArquivo = 'extrato_nfe';
  dadosItens  = [];
}

/* ── Extração principal ───────────────────────────────────── */
function extrair() {
  const xml      = document.getElementById('xmlInput').value.trim();
  const erroEl   = document.getElementById('erro');
  const resultEl = document.getElementById('resultado');

  erroEl.style.display   = 'none';
  resultEl.style.display = 'none';
  dadosItens = [];

  if (!xml) {
    mostrarErro('Cole o XML da NF-e ou selecione um arquivo antes de extrair.');
    return;
  }

  let doc;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('inválido');
  } catch (e) {
    mostrarErro('Erro ao processar o XML. Verifique se o conteúdo está correto e completo.');
    return;
  }

  const dets = [];
  doc.querySelectorAll('*').forEach(n => {
    if (n.localName === 'det') dets.push(n);
  });

  if (dets.length === 0) {
    mostrarErro('Nenhum item (<det>) encontrado no XML. Verifique o formato da NF-e.');
    return;
  }

  let totalIBS = 0, totalCBS = 0, totalBC = 0;
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  dets.forEach((det, idx) => {
    const nItem = det.getAttribute('nItem') || String(idx + 1);

    let vBC = null, vIBSUF = null, vCBS = null, xProd = null;

    det.querySelectorAll('*').forEach(n => {
      if (n.localName === 'vBC'     && vBC    === null) vBC    = n.textContent.trim();
      if (n.localName === 'vIBSUF'  && vIBSUF === null) vIBSUF = n.textContent.trim();
      if (n.localName === 'vCBS'    && vCBS   === null) vCBS   = n.textContent.trim();
      if (n.localName === 'xProd'   && xProd  === null) xProd  = n.textContent.trim();
    });

    const bcNum  = vBC     ? parseFloat(vBC)    : null;
    const ibsNum = vIBSUF  ? parseFloat(vIBSUF) : 0;
    const cbsNum = vCBS    ? parseFloat(vCBS)    : 0;
    const nome   = xProd   || '—';

    totalIBS += ibsNum;
    totalCBS += cbsNum;
    if (bcNum !== null) totalBC += bcNum;

    dadosItens.push({ nItem, nome, vBC: bcNum, vIBSUF: ibsNum, vCBS: cbsNum });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="pill-item">${nItem}</span></td>
      <td class="col-nome">${nome}</td>
      <td class="col-num">${bcNum !== null ? fmtR(bcNum) : '<span style="color:var(--text-3)">—</span>'}</td>
      <td class="col-num col-ibs">${vIBSUF ? fmtR(ibsNum) : '<span style="color:var(--text-3)">—</span>'}</td>
      <td class="col-num col-cbs">${vCBS   ? fmtR(cbsNum) : '<span style="color:var(--text-3)">—</span>'}</td>
      <td class="col-num">${fmtR(ibsNum + cbsNum)}</td>
    `;
    tbody.appendChild(tr);
  });

  const tfoot = document.getElementById('tfoot');
  tfoot.innerHTML = `
    <tr>
      <td class="foot-label">TOTAL</td>
      <td></td>
      <td class="col-num">${totalBC > 0 ? fmtR(totalBC) : '—'}</td>
      <td class="col-num col-ibs">${fmtR(totalIBS)}</td>
      <td class="col-num col-cbs">${fmtR(totalCBS)}</td>
      <td class="col-num">${fmtR(totalIBS + totalCBS)}</td>
    </tr>
  `;

  document.getElementById('totalItens').textContent = dets.length;
  document.getElementById('totalIBS').textContent   = fmtR(totalIBS);
  document.getElementById('totalCBS').textContent   = fmtR(totalCBS);
  document.getElementById('totalGeral').textContent = fmtR(totalIBS + totalCBS);

  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Exportar XLSX ────────────────────────────────────────── */
function exportarXLSX() {
  if (!dadosItens.length) return;

  /* Monta os dados */
  const cabecalho = ['Item', 'Produto', 'Base de Cálculo (vBC)', 'vIBSUF', 'vCBS', 'Total Item'];
  const linhas = dadosItens.map(d => [
    d.nItem,
    d.nome,
    d.vBC    !== null ? d.vBC  : '',
    d.vIBSUF,
    d.vCBS,
    d.vIBSUF + d.vCBS
  ]);

  /* Linha de totais */
  const totalBC  = dadosItens.reduce((s, d) => s + (d.vBC || 0), 0);
  const totalIBS = dadosItens.reduce((s, d) => s + d.vIBSUF, 0);
  const totalCBS = dadosItens.reduce((s, d) => s + d.vCBS,   0);
  linhas.push(['TOTAL', '', totalBC || '', totalIBS, totalCBS, totalIBS + totalCBS]);

  const wsData = [cabecalho, ...linhas];
  const ws     = XLSX.utils.aoa_to_sheet(wsData);

  /* Larguras das colunas */
  ws['!cols'] = [
    { wch: 8  },  // Item
    { wch: 40 },  // Produto
    { wch: 24 },  // vBC
    { wch: 18 },  // vIBSUF
    { wch: 18 },  // vCBS
    { wch: 18 },  // Total
  ];

  /* Formata células numéricas como moeda BRL (colunas C, D, E, F) */
  const fmtBRL = '"R$"#,##0.00';
  const totalLinhas = wsData.length;
  for (let r = 1; r < totalLinhas; r++) {
    ['C', 'D', 'E', 'F'].forEach(col => {
      const cell = ws[col + (r + 1)];
      if (cell && typeof cell.v === 'number') {
        cell.t = 'n';
        cell.z = fmtBRL;
      }
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'IBS e CBS');

  XLSX.writeFile(wb, nomeArquivo + '_IBS_CBS.xlsx');
}

/* ── Copiar CSV ───────────────────────────────────────────── */
function copiarCSV() {
  if (!dadosItens.length) return;

  const sep = ';';
  let csv = ['Item', 'Produto', 'vBC', 'vIBSUF', 'vCBS', 'Total'].join(sep) + '\n';

  dadosItens.forEach(d => {
    const bc    = d.vBC    !== null ? d.vBC.toFixed(2).replace('.', ',')    : '';
    const ibs   = d.vIBSUF.toFixed(2).replace('.', ',');
    const cbs   = d.vCBS.toFixed(2).replace('.', ',');
    const total = (d.vIBSUF + d.vCBS).toFixed(2).replace('.', ',');
    csv += [d.nItem, d.nome, bc, ibs, cbs, total].join(sep) + '\n';
  });

  navigator.clipboard.writeText(csv).then(mostrarCopiado).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = csv;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    mostrarCopiado();
  });
}

function mostrarCopiado() {
  const msg = document.getElementById('copiadoMsg');
  msg.style.display = 'inline';
  setTimeout(() => { msg.style.display = 'none'; }, 2500);
}

/* ── Helpers ─────────────────────────────────────────────── */
function mostrarErro(msg) {
  const el = document.getElementById('erro');
  el.textContent = msg;
  el.style.display = 'block';
}
