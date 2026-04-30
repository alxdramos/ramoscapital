# Ramos Capital — Documentação do Projeto

**Consultoria patrimonial — Uberlândia, MG**
Site: [ramoscapital.com.br](https://ramoscapital.com.br) · Deploy: Vercel (auto via GitHub push)

---

## Visão Geral

Projeto estático (HTML/CSS/JS puro, sem framework, sem build step) hospedado no Vercel.
Composto por 4 páginas independentes + 1 script de backend no Google Apps Script.

---

## Arquivos do Projeto

| Arquivo | URL | Descrição |
|---|---|---|
| `index.html` | `/` | Landing page principal |
| `crm.html` | `/crm` | CRM interno do escritório |
| `simulador-consorcio.html` | `/simulador-consorcio` | Simulador completo de consórcio |
| `Ramos Capital - Landing Page.html` | (dev reference) | Versão de referência da landing page |
| `Ramos Capital - Brand System.html` | (dev reference) | Guia de identidade visual |
| `brand-system.html` | `/brand-system` | Brand system online |
| `google-apps-script-crm.js` | Google Apps Script | Backend da integração CRM → Google Sheets |
| `vercel.json` | — | Configuração de deploy (cleanUrls, headers de segurança) |

---

## 1. Landing Page (`index.html`)

### Seções
| ID | Seção |
|---|---|
| `#hero` | Headline principal + CTA WhatsApp |
| `#sobre` | Sobre a Ramos Capital |
| `#simulador` | Simulador rápido (slider de crédito/prazo) |
| `#como` | Como funciona (3 passos) |
| `#depoimentos` | Depoimentos de clientes |
| `#contato` | Formulário de captura de leads |

### Formulários de captação de leads
Dois pontos de captura, ambos enviam para o Google Apps Script:

1. **Formulário principal** (`#leadForm`) — seção `#contato`
   - Campos: nome, telefone/WhatsApp, email, interesse
   - Botão redireciona para WhatsApp após envio

2. **Pop-up do simulador** — aparece após o usuário usar o simulador rápido
   - Campos: crédito simulado, parcela estimada, telefone, email
   - Aparece após interação com os sliders

### Integrações
- **Google Apps Script (CRM):** `https://script.google.com/macros/s/AKfycbwNm_aeof_EPpY7FDaLlTWnkqBzV9XmEu6_7NmEiLVNVYaBVh2fOn8pB9LJL2GVk0NKbw/exec`
- **WhatsApp CTA:** número configurado na variável `WHATS` no início do script
- **Administradoras exibidas na landing:** HS, Banco do Brasil, Santander, Porto Seguro

### Tipografia e cores (brand system)
```css
--navy: #0A1628   /* fundo escuro */
--gold: #D4AF37   /* dourado principal */
--bone: #F5F3EE   /* texto claro */
--moss: #40916C   /* verde positivo */
```
Fontes: Cormorant Garamond (display) · Plus Jakarta Sans (body) · JetBrains Mono (código/labels)

---

## 2. CRM (`crm.html`)

CRM interno para gerenciar leads capturados pelo site. Roda 100% no browser, sem servidor.

### Funcionalidades
- **Dashboard** — visão geral de leads, funil de conversão, métricas
- **Pipeline Kanban** — arrastar leads entre etapas do funil
- **Tabela de leads** — listagem completa com filtros e busca
- **Detalhes do lead** — histórico de interações, notas, status
- **Notificações** — alertas de novos leads

### Dados
- Leads são buscados via `fetch` ao Google Apps Script (mesma URL acima)
- Persistência local via `localStorage` para estado do pipeline
- Sincronização manual (botão "Atualizar")

### Acesso
URL interna — não vinculada ao menu do site público.
Acessar diretamente: `ramoscapital.com.br/crm`

---

## 3. Simulador de Consórcio (`simulador-consorcio.html`)

Ferramenta para apresentar simulações detalhadas para clientes em reuniões.

### Fluxo de 3 telas

**Tela 1 — Seleção de Administradora**
- 4 cards: HS, Itaú, Banco do Brasil, Santander
- Exibe taxa e prazo típicos de cada uma (dados pesquisados abr/2026)
- Ao selecionar, pré-preenche o formulário com os valores reais

**Tela 2 — Formulário**

| Campo | Tipo | Observação |
|---|---|---|
| Nome do Cliente | texto | Identificação no relatório |
| Crédito Contratado | número | Valor da carta em R$ |
| INCC/IPCA Anual | % | Taxa de correção anual (pré-preenchida por admin) |
| Prazo | meses | Pré-preenchido por admin |
| Taxa Total | % | Taxa administrativa total do plano |
| Parcela Flex | slider 10–100% | Redução da parcela mensal |
| Seguro Mensal | R$ | Opcional |
| Lance Embutido | % | Opcional — deduzido do crédito |
| Lance Recursos Próprios | % | Opcional |
| % de Compra da Carta | % | Estratégia investidor — quanto o investidor paga |
| Aluguel Mensal | % a.m. | Renda passiva do imóvel |
| Rentabilidade Anual | % a.a. | Valorização esperada do imóvel |

**Preview ao vivo:** assim que crédito + prazo + taxa estão preenchidos, aparece um card verde mostrando a parcela cheia, a parcela com flex e a economia mensal — em tempo real, antes de clicar em "Simular".

**Tela 3 — Resultados**

4 KPI cards:
- Parcela Inicial (mês 1, com flex)
- Total Pago (soma de todas as parcelas corrigidas)
- Crédito no Final (após correção pelo índice)
- Ganho c/ Correção (crescimento do crédito)

Faixa de benefícios: por que vender a carta pode valer a pena.

Gráfico canvas: Crédito Atualizado vs Total Pago ao longo do tempo.

**Aba "Fluxo Mensal"**

| Coluna | O que mostra |
|---|---|
| Mês | Número do mês (1 a N) |
| Parcela | Valor da parcela com flex naquele mês |
| Total Pago Acum. | Soma de todas as parcelas até aquele mês |
| Crédito Atualizado | Valor da carta corrigida pelo INCC/IPCA |
| Correção Acum. | Quanto o crédito cresceu desde o início |

**Aba "Estratégia para Investidor"**

| Coluna | O que mostra |
|---|---|
| Mês | Número do mês |
| Parcela | Parcela com flex |
| Total Pago Acum. | Total investido pelo consorciado |
| Crédito Atualizado | Valor da carta naquele mês |
| Cliente Recebe | `crédito × % de compra` — o que o cliente embolsa ao vender |
| Ganho do Investidor | `crédito − valor pago pela carta` — lucro instantâneo do comprador |
| Para Renda Passiva | `crédito × aluguel% a.m.` — renda mensal se usar o crédito para alugar imóvel |

### Fórmulas de cálculo

```
rMes = (1 + incc_anual / 100)^(1/12) - 1

creditoAtualizado[m] = credito × (1 + rMes)^m

parcelaNormal[m] = creditoAtualizado[m] × (1/prazo + taxa%/prazo) + seguro

parcelaFlex[m] = parcelaNormal[m] × flex%

totalPagoAcum[m] = Σ parcelaFlex[1..m]

clienteRecebe = creditoAtualizado × vendaPct%

ganhoInvestidor = creditoAtualizado − clienteRecebe

rendaMensal = creditoAtualizado × aluguelMensal%
```

### Taxas pré-carregadas por administradora (fonte: pesquisa iDinheiro abr/2026)

| Admin | Taxa | Prazo | INCC | Flex padrão |
|---|---|---|---|---|
| HS Consórcio | ~20% | 200m | 6,28% a.a. | 50% (Meia Parcela) |
| Itaú | ~18% | 240m | 6,28% a.a. | 70% |
| Banco do Brasil | ~19% | 200m | 6,28% a.a. | 70% |
| Santander | ~22% | 180m | 6,28% a.a. | 70% |

> BB inclui ~2% de fundo de reserva; Santander inclui ~3%. Taxas aproximadas — confirmar no contrato.

### Filtros de exibição da tabela
- **Todos os meses** — linha por linha
- **Por ano** — apenas meses múltiplos de 12 + primeiro + último
- **Por trimestre** — apenas meses múltiplos de 3 + primeiro + último

---

## 4. Backend — Google Apps Script (`google-apps-script-crm.js`)

Script publicado como Web App no Google Apps Script.
Recebe `POST` com dados do lead e grava na planilha Google Sheets.

### Endpoints
- `GET /exec` — retorna leads existentes (para o CRM)
- `POST /exec` — recebe novo lead e grava na planilha

### Campos gravados
`timestamp`, `nome`, `telefone`, `whatsapp`, `email`, `interesse`, `credito`, `parcela`, `origem`

### URL do script
```
https://script.google.com/macros/s/AKfycbwNm_aeof_EPpY7FDaLlTWnkqBzV9XmEu6_7NmEiLVNVYaBVh2fOn8pB9LJL2GVk0NKbw/exec
```

> Para atualizar o script: abrir Google Apps Script → editar → publicar nova versão → copiar nova URL → atualizar `SHEETS_URL` em `index.html` (2 ocorrências).

---

## Deploy e infraestrutura

### Vercel
- Projeto: `ramoscapital` (alexandrergo-6460s-projects)
- Domínio: `ramoscapital.com.br`
- Deploy automático: qualquer `git push origin main` aciona novo deploy
- Configuração: `vercel.json` (cleanUrls, headers de segurança)

### Git
```bash
# Deploy em produção
git add <arquivos>
git commit -m "feat: descrição"
git push origin main   # deploy automático no Vercel
```

### Pré-visualizar antes de subir
Abrir o arquivo HTML diretamente no navegador — funciona sem servidor.

---

## Tipografia — Simulador

O simulador usa **Inter** com `font-variant-numeric: tabular-nums` para todos os valores monetários (garante alinhamento de colunas em tabelas). JetBrains Mono é mantido apenas para labels, eyebrows e cabeçalhos de tabela.

---

## Estrutura de pastas relevante

```
Ramos Capital/
├── index.html                        # Landing page principal
├── crm.html                          # CRM interno
├── simulador-consorcio.html          # Simulador completo
├── brand-system.html                 # Brand system
├── google-apps-script-crm.js         # Backend (deploy no Google Apps Script)
├── vercel.json                       # Config Vercel
├── Ramos Capital - Brand System.html # Referência de design
├── Ramos Capital - Landing Page.html # Referência landing page
└── Imagens para exemplo/             # Screenshots do ConsorX (referência do simulador)
```

---

## Histórico de versões relevante

| Commit | Descrição |
|---|---|
| `166f712` | fix: lógica correta de % de compra da carta (investidor) |
| `37d2a2c` | style: fontes Inter + tabular-nums nos números |
| `1e8fba5` | feat: preview ao vivo da parcela + taxas reais por admin |
| `90ed2bf` | refactor: redesign tema claro (white/light) |
| `0d3f535` | feat: simulador de consórcio completo |
| `37e34d1` | feat: campo e-mail na captura de leads |
| `145c726` | feat: pop-up de captura + fix CRM |
| `6d8b500` | feat: integração landing page → CRM em tempo real |
| `8024942` | fix: CRM responsivo mobile |
| `abf7885` | feat: CRM completo |
