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
 * 5. Clique em "Implantar" → "Nova implantação"
 *    - Tipo: "Aplicativo da Web"
 *    - Executar como: "Eu (seu e-mail)"
 *    - Quem tem acesso: "Qualquer pessoa"
 *    - Clique em "Implantar"
 *
 * 6. Copie a URL gerada (começa com https://script.google.com/macros/s/...)
 *
 * 7. Abra o arquivo index.html do projeto e localize a linha:
 *       const SHEETS_URL = 'COLE_AQUI_A_URL_DO_SEU_GOOGLE_APPS_SCRIPT';
 *    Substitua pelo URL copiado no passo 6.
 *
 * 8. Salve o index.html e rode novamente o git push.
 *
 * Pronto! Cada novo lead aparecerá automaticamente na planilha.
 * ─────────────────────────────────────────────────────────────
 */

const SPREADSHEET_ID = ''; // deixe vazio — o script usa a planilha ativa

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalho na primeira execução
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'WhatsApp', 'Objetivo', 'Prazo', 'Origem', 'Status']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0A1628').setFontColor('#D4AF37');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.data     || new Date().toLocaleString('pt-BR'),
      data.nome     || '',
      data.whatsapp || '',
      data.objetivo || '',
      data.prazo    || '',
      data.origem   || '',
      'Novo'
    ]);

    // Formata a última linha inserida
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 7).setBackground('#e6f4ea').setFontColor('#1a7a3a');

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste — execute manualmente para verificar se está funcionando
function testar() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        data: new Date().toLocaleString('pt-BR'),
        nome: 'Teste Lead',
        whatsapp: '(34) 99999-9999',
        objetivo: 'Imóvel',
        prazo: '1-3',
        origem: 'https://ramoscapital.com.br'
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
