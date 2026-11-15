# 🌱 Field Shift — Frontend

Interface web interativa de apoio à decisão para pequenos agricultores, desenvolvida no âmbito do **NASA Space Apps Challenge 2026** (Desafio 7: *Field Shift*).

A aplicação ajuda agricultores e técnicos agrícolas em Angola (e no Sul Global) a comparar estratégias de rotação de culturas, cruzando o conhecimento local com dados de observação da Terra da NASA e fontes agronómicas de referência.

---

## 🔗 Integração com o Backend

O frontend funciona em estreita articulação com o serviço de backend da equipa:

* 📦 **Repositório do Backend:** [https://github.com/OAlicio/Nasa_Space](https://github.com/OAlicio/Nasa_Space)
* 📡 **Arquitetura desacoplada:** O frontend **nunca** comunica diretamente com APIs externas de satélite ou meteorologia (NASA POWER, MODIS, etc.). Todas as integrações de dados e modelos de pontuação agronómica são processadas pelo backend através da rota `/api/analises`.
* 🧪 **Desenvolvimento autónomo:** O frontend inclui suporte a modo de simulação (*mock*), permitindo testar e demonstrar todas as funcionalidades mesmo sem o backend em execução.

---

## 🎯 Funcionalidades Principais

1. **Mapeamento Geoespacial e Marcação de Terrenos:**
   * Delimitação manual de parcelas com ferramentas de polígono (`leaflet-draw`).
   * Cálculo imediato e preciso de área em hectares e km² através do `@turf/area`.
   * Centramento por geolocalização (`navigator.geolocation`).
   * Camada base de alta resolução **Sentinel-2 Cloudless (EOX)** com atribuição integrada.
   * Camadas NASA GIBS (*Global Imagery Browse Services*).

2. **Formulário Agroclimático Acessível (Mobile-First):**
   * Registo da situação atual (cultura presente, histórico habitual, rega e solo).
   * Definição de prioridades (saúde do solo, conservação de água, redução de erosão, aumento de produtividade).
   * Horizonte temporal parametrizável (1 a 3 épocas agrícolas).

3. **Diagnóstico e Recomendação de Estratégias:**
   * **Estratégia A (Referência):** A rotação atual ou habitual da parcela.
   * **Estratégias B e C (Alternativas):** Propostas otimizadas para os objetivos do agricultor.
   * Cada estratégia detalha:
     * **Porquê** da recomendação;
     * **Evidência** dos dados de satélite;
     * **Benefícios** esperados;
     * **Lacunas de informação**;
     * **Riscos a validar localmente**.

4. **Visualização de Condições do Solo e Chuva:**
   * Gráficos comparativos de precipitação mensal histórica vs. época atual (Recharts).
   * Níveis de humidade do solo e estimativas de declive / campo nu.

5. **Validação Local de Premissas:**
   * Painel interativo para ajustar premissas (tipo de solo, rega, datas) com recálculo das estratégias sem novos pedidos aos serviços da NASA.

6. **Internacionalização e Acessibilidade:**
   * Suporte bilingue: **Português de Portugal** (`pt-PT`) e **Inglês** (`en`).
   * Design responsivo concebido para ecrãs móveis e conexões com largura de banda limitada.

---

## 🛠️ Stack Tecnológica

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Mapeamento & SIG:** [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/), [Leaflet-Draw](https://github.com/Leaflet/Leaflet.draw)
* **Cálculos Geoespaciais:** [Turf.js](https://turfjs.org/) (`@turf/area`, `@turf/centroid`, `@turf/bbox`)
* **Gráficos:** [Recharts](https://recharts.org/)
* **Ícones:** [Lucide React](https://lucide.dev/)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js:** Versão 20.x ou superior recomendada.
* **npm** (ou gerenciador equivalente).

### 1. Clonar o repositório
```bash
git clone https://github.com/jluis/field_shift_frontend.git
cd field_shift_frontend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um ficheiro `.env.local` na raiz do projeto a partir do modelo existente:

```bash
cp .env.example .env.local
```

Configurações disponíveis:
```env
# Endereço da API do backend (https://github.com/OAlicio/Nasa_Space)
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Alternar entre dados simulados (mock) e backend real:
# true  -> Utiliza dados de exemplo em src/mocks/analise.v1.json (ideal para testes locais sem backend)
# false -> Faz chamadas reais à API em NEXT_PUBLIC_API_URL
NEXT_PUBLIC_USE_MOCK=true
```

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para aceder à aplicação.

### 5. Outros scripts disponíveis
* `npm run build`: Compila a aplicação para produção.
* `npm run start`: Inicia o servidor em modo de produção.
* `npm run lint`: Executa a verificação estática de código com ESLint.

---

## 📁 Estrutura de Diretórios

```text
src/
├── app/                      # Rotas e páginas (Next.js App Router)
│   ├── dashboard/            # Página do painel com mapa e assistente de análise
│   ├── layout.tsx            # Layout global e provedores de contexto
│   └── page.tsx              # Página inicial (Landing page do projeto)
├── components/
│   ├── dashboard/            # Painéis, etapas do formulário e cartões de estratégia
│   ├── landing/              # Secções explicativas da landing page
│   ├── map/                  # Componente do mapa interativo (Leaflet)
│   └── ui/                   # Componentes de interface partilhados
├── lib/
│   ├── api.ts                # Cliente API único para contacto com o backend
│   ├── geo.ts                # Utilitários de conversão e cálculo geográfico
│   └── i18n.ts               # Dicionários e lógica de internacionalização (PT / EN)
├── mocks/
│   └── analise.v1.json       # Dados de teste para demonstração offline
└── types/
    └── analysis.ts           # Definições de tipos do contrato da API
```

---

## 🛰️ Fontes de Dados e Atribuições

* **NASA GIBS** (*Global Imagery Browse Services*): Fornece visualizações e mosaicos de satélite da Terra.
* **NASA POWER**: Fornece séries temporais de radiação solar, precipitação e temperatura.
* **MODIS / ORNL DAAC**: Índices de vegetação e estado de cobertura do solo.
* **EOxCloudless**: Imagens Sentinel-2 cloudless por EOX IT Services GmbH (dados Copernicus Sentinel modificados, licença CC BY-NC-SA 4.0).
* **FAO**: Catálogo de culturas, coeficientes hídricos e ciclos de rotação baseados no FAO Crop Information e FAO-56.

---

## ⚠️ Avisos e Princípios Éticos

* **Apoio à decisão:** Esta ferramenta destina-se a apoiar o processo de planeamento do agricultor e **não substitui** o conhecimento prático tradicional nem o aconselhamento de técnicos agrícolas locais.
* **Não é previsão meteorológica:** O sistema analisa tendências históricas e medições observadas na época presente; não emite boletins meteorológicos futuros.
* **Resolução espacial:** Os dados meteorológicos (chuva, humidade e temperatura) são estimativas agregadas em quadrículas de cerca de 50 km, enquanto os dados de vegetação refletem a média da parcela delimitada.
* **Privacidade do agricultor:** Os limites geográficos do terreno e os dados da parcela não são partilhados publicamente nem guardados de forma persistente sem o consentimento do utilizador.

---

## 👥 NASA Space Apps Challenge 2026

* **Desafio:** Challenge 7 — *Field Shift*
* **Frontend:** Desenvolvido por Jormaedes Luís ([field_shift_frontend](https://github.com/jluis/field_shift_frontend))
* **Backend & Modelação de Dados:** [OAlicio/Nasa_Space](https://github.com/OAlicio/Nasa_Space)
