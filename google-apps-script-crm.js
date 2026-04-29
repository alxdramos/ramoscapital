/**
 * RAMOS CAPITAL — CRM via Google Sheets
 * ─────────────────────────────────────────────────────────────
 * INSTRUÇÕES DE CONFIGURAÇÃO (faça isso uma única vez):
 *
 * 1. Acesse: https://sheets.google.com e crie uma nova planilha
 *    Nomeie como "Ramos Capital — Leads"
 *
 * 2. No menu superior, clique em "Extensões" → "Apps Script"
 *
 * 3. Apague todo o código que aparecer e cole ESTE arquivo inteiro
 *
 * 4. Clique em "Salvar" (ícone de disquete ou Ctrl+S)
 *
 * 5. ⚠️  REDEPLOY OBRIGATÓRIO após qualquer alteração no código:
 *    Clique em "Implantar" → "Gerenciar implantações" → ✏️ Editar
 *    → Versão: "Nova versão" → "Implantar"
 *    (NÃO crie uma nova implantação — edite a existente para manter a mesma URL)
 *
 * Pronto! O CRM sincroniza automaticamente ao abrir a página /crm
 * ─────────────────────────────────────────────────────────────
 *
 * ENDPOINTS:
 *   POST  → salva novo lead (vem do formulário do site)
 *   GET   ?action=getLeads → retorna todos os leads para o CRM
 * ─────────────────────────────────────────────────────────────
 */

// ── GET: CRM lê os leads da planilha ──────────────────────────────────────────
function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || '';

    if (action === 'getLeads') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data  = sheet.getDataRange().getValues();

      // Nenhum dado ainda (somente cabeçalho ou vazio)
      if (data.length <= 1) {
        return jsonOut({ status: 'ok', leads: [] });
      }

      // Linha 0 = cabeçalho: [Data/Hora, Nome, WhatsApp, Objetivo, Prazo, Origem, Status]
      const leads = data.slice(1)
        .filter(row => row[1] || row[2])   // ignora linhas sem nome e sem WhatsApp
        .map(row => ({
          data:      row[0] ? String(row[0]) : '',
          nome:      row[1] ? String(row[1]).trim() : '',
          whatsapp:  row[2] ? String(row[2]).trim() : '',
          email:     row[3] ? String(row[3]).trim() : '',
          objetivo:  row[4] ? String(row[4]).trim() : '',
          prazo:     row[5] ? String(row[5]).trim() : '',
          origem:    row[6] ? String(row[6]).trim() : 'site',
          statusPlanilha: row[7] ? String(row[7]).trim() : 'Novo'
        }));

      return jsonOut({ status: 'ok', leads: leads });
    }

    // Ping de verificação
    return jsonOut({ status: 'ok', message: 'Ramos Capital CRM API — use ?action=getLeads' });

  } catch (err) {
    return jsonOut({ status: 'error', error: err.message });
  }
}

// ── POST: formulário do site grava na planilha ────────────────────────────────
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalho na primeira execução
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'WhatsApp', 'E-mail', 'Objetivo', 'Prazo', 'Origem', 'Status']);
      sheet.getRange(1, 1, 1, 8)
        .setFontWeight('bold')
        .setBackground('#0A1628')
        .setFontColor('#D4AF37');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.data     || new Date().toLocaleString('pt-BR'),
      data.nome     || '',
      data.whatsapp || '',
      data.email    || '',
      data.objetivo || '',
      data.prazo    || '',
      data.origem   || 'site',
      'Novo'
    ]);

    // Formata a última linha
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 8)
      .setBackground('#e6f4ea')
      .setFontColor('#1a7a3a');

    return jsonOut({ status: 'ok', row: lastRow });

  } catch (err) {
    return jsonOut({ status: 'error', message: err.message });
  }
}

// ── HELPER ────────────────────────────────────────────────────────────────────
function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── TESTE MANUAL (execute no editor do Apps Script para verificar) ─────────────
function testarGet() {
  const mockGet = { parameter: { action: 'getLeads' } };
  const result = doGet(mockGet);
  Logger.log(result.getContent());
}

function testarPost() {
  const mockPost = {
    postData: {
      contents: JSON.stringify({
        data: new Date().toLocaleString('pt-BR'),
        nome: 'Lead de Teste',
        whatsapp: '(34) 99999-8888',
        objetivo: 'Imóvel',
        prazo: '1-3',
        origem: 'https://ramoscapital.com.br'
      })
    }
  };
  const result = doPost(mockPost);
  Logger.log(result.getContent());
}
