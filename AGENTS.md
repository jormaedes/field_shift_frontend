<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Field Shift: frontend (Next.js)

Aplicação web em português e inglês que ajuda pequenos agricultores angolanos a comparar estratégias de rotação de culturas, com dados da NASA. Projeto do NASA Space Apps Challenge 2026 (Desafio 7, Field Shift). Hackathon de 14 a 15 de Novembro de 2026 (48 horas), por isso o objetivo é um MVP que funcione e se demonstre bem.

Este ficheiro é para agentes de IA que trabalham no **frontend**. O backend é feito por outra pessoa da equipa. A aplicação **apoia** a decisão do agricultor: não a substitui e não faz previsão do tempo.

## 1. Regras para o agente

1. Antes de escrever código Next.js, ler a documentação da versão instalada (ver o bloco do Next.js neste ficheiro). Não confiar na memória de versões antigas.
2. **Não inventar.** Endpoints, campos da API, valores agrícolas (chuva, ciclos, solos), números e fontes só podem vir deste ficheiro ou de documentação oficial. Se faltar informação, deixar `TODO(confirmar): ...` no código e perguntar ao programador.
3. **O frontend nunca chama APIs de dados** (NASA POWER, MODIS/ORNL, Open Topo Data, Open-Meteo, etc.). Só fala com o backend da equipa. As únicas chamadas externas feitas pelo browser são os tiles do mapa (secção 4).
4. **Trabalhar em passos pequenos e revisáveis.** O programador (Jormaedes Luís) está a aprender e quer perceber o que é gerado: explicar o plano em poucas linhas antes de mudanças grandes, comentar decisões não óbvias e só gerar blocos grandes de código em partes repetitivas (boilerplate). Se ele pedir apenas orientação, não escrever código.
5. Não instalar dependências novas sem perguntar. As permitidas estão na secção 2.
6. Texto da interface em **português de Portugal**. Nomes de ficheiros, componentes e variáveis em inglês. Campos da API exatamente como no contrato (secção 6).
7. Os avisos da secção 8 são obrigatórios e nunca se escondem.
8. **Mobile first.** Muitos agricultores usam o telemóvel. Linguagem simples, sem jargão por explicar (usar tooltips para termos como NDVI, erosão, rotação de culturas).
9. A localização de um agricultor é informação pessoal. Não a guardar no browser (localStorage, cookies) sem consentimento explícito.

## 2. Stack e convenções

- **Next.js** (App Router) com **TypeScript** e **Tailwind CSS**. Confirmar as versões no `package.json`.
- Server Components por defeito. `'use client'` só onde é preciso (mapa, formulários, gráficos).
- **Mapa:** `leaflet` e `react-leaflet`. Verificar a compatibilidade da versão do `react-leaflet` com a versão do React instalada.
- **Desenho do terreno:** `leaflet-draw` (como definido no documento da equipa). Se der problemas com a versão do React/Next, usar `@geoman-io/leaflet-geoman-free` e avisar o programador.
- **Cálculos geográficos:** `@turf/area`, `@turf/centroid`, `@turf/bbox`.
- **Gráficos:** uma só biblioteca (sugestão: Recharts). Verificar a compatibilidade com a versão do React.
- **Estado:** `useState`/`useReducer` e um contexto para a análise atual. Sem Redux nem Zustand.
- **Pedidos ao backend:** todos num único módulo (`src/lib/api.ts`). Nenhum componente faz `fetch` diretamente.
- **Variáveis de ambiente:** `NEXT_PUBLIC_API_URL` (endereço do backend) e `NEXT_PUBLIC_USE_MOCK=true` (usa dados de exemplo em `src/mocks/analise.v1.json`, para trabalhar antes de o backend estar pronto).
- Scripts habituais: `npm run dev`, `npm run build`, `npm run lint`. Confirmar no `package.json`.

**Armadilha das coordenadas:** o Leaflet usa `[latitude, longitude]`. GeoJSON e Turf usam `[longitude, latitude]`. Converter sempre num único sítio (`src/lib/geo.ts`) e nunca à mão nos componentes.

**Estrutura sugerida:**

```
src/
  app/
    page.tsx                  # landing
    dashboard/page.tsx        # sidebar + mapa
  components/
    map/                      # MapView, DrawControl, BasemapLayers (client)
    sidebar/                  # passos do formulário, resultados, premissas
    results/                  # StrategyCard, RainChart, SoilMoisture, avisos
    ui/                       # botões, badges, tooltips
  lib/
    api.ts                    # único ponto de contacto com o backend
    geo.ts                    # conversões de coordenadas, área, centroide
    format.ts                 # números e datas em pt-PT e en
  mocks/analise.v1.json
  types/analise.ts            # tipos do contrato (secção 6)
```

## 3. Páginas

**`/` (landing page):** hero com o problema (chuvas imprevisíveis, solos a perder qualidade) e botão «Começar análise»; «Como funciona» em 3 passos (marcar o terreno, dizer o que planta e o que quer, ver estratégias); dados da NASA usados, em linguagem simples; limitações e avisos (secção 8); rodapé com créditos e atribuições.

**`/dashboard`:** barra lateral à esquerda e mapa a ocupar o resto. Em ecrãs pequenos, o mapa fica em cima e o painel por baixo, como folha deslizante.

A barra lateral muda conforme o passo: (1) terreno, (2) situação atual, (3) objetivo e horizonte, (4) a analisar, (5) resultados, (6) validação local.

## 4. Mapa

- **Mapa base:** Sentinel-2 cloudless da EOX (imagem de cerca de 10 m, ideal para ver terrenos agrícolas). Serviço WMTS. Capacidades e nomes das camadas: `https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml`. Usar o conjunto de tiles `EPSG:3857` (GoogleMapsCompatible), zoom 0 a 14. **Não adivinhar o URL dos tiles nem o identificador da camada**: lê-los nas capacidades.
- **Atribuição obrigatória e visível no mapa**, com o ano igual ao da camada usada: «EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data ANO)», com os links. Licença CC BY-NC-SA 4.0 para os anos 2018 a 2025, só uso não comercial. Detalhes: `https://cloudless.eox.at/license-non-commercial`.
- **Camadas NASA (GIBS)** por cima, opcionais: gratuitas e sem login. Capacidades: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml`. Exemplo oficial para Leaflet em `https://github.com/nasa-gibs/web-examples`. As camadas precisam de uma data e podem não ter imagem para todas as datas. A cor verdadeira do MODIS só vai até ao zoom 9 (resolução de cerca de 250 m).
- **Não usar o EarthExplorer** (portal da USGS). Foi discutido e descartado: é um portal de pesquisa e descarga do arquivo da USGS, não um serviço de tiles para embutir na aplicação.
- **Interação:** tocar no mapa para escolher um ponto, ou desenhar o contorno do terreno. Botão «Usar a minha localização» (`navigator.geolocation`, só funciona com HTTPS e com permissão do utilizador): apenas centra o mapa, e o agricultor confirma ou desenha o terreno.
- **Cálculos no frontend:** área com `@turf/area` (metros quadrados). Hectares = m² ÷ 10 000. km² = m² ÷ 1 000 000. Centro com `@turf/centroid`. Largura e altura aproximadas da caixa com `@turf/bbox`. Mostrar sempre «≈ X ha (Y km²)».
- **Avisar** o utilizador se o terreno desenhado for muito pequeno ou muito grande. O limite exato combina-se com o backend (`TODO(confirmar)`).
- O Leaflet usa `window`, por isso o mapa tem de ser um componente cliente carregado com importação dinâmica sem SSR. Importar o CSS do Leaflet. Atenção ao ícone predefinido dos marcadores, que costuma falhar com bundlers.

## 5. Fluxo do utilizador

1. **Terreno:** marcar no mapa (ou localização atual). Mostra a área.
2. **Situação atual:** tem algo plantado? Qual cultura e há quanto tempo (ou data de plantio). Se não, o que costuma plantar (com «não sei»). Tem acesso a rega (sim ou não). Tipo de solo (escolha simples, com «não sei»).
3. **Objetivo e horizonte:** objetivo principal (melhorar a saúde do solo, gastar menos água, reduzir a erosão, aumentar o rendimento), objetivo secundário opcional, número de épocas agrícolas (1 a 3).
4. **A analisar:** ecrã de progresso com passos legíveis. Nunca um ecrã em branco.
5. **Resultados:** condições do local (gráficos), estado desta época (se há cultura plantada) e três estratégias em cartões.
6. **Validação local:** lista de premissas a validar. O utilizador edita e carrega em «Recalcular». A aplicação mostra o que mudou na ordem e na pontuação das estratégias.
7. **Partilha (P2):** resumo curto para copiar para o WhatsApp.

## 6. Contrato da API (PROPOSTA v0)

> **Atenção:** este contrato é uma proposta do lado do frontend e **ainda não está acordado com o backend**. Todo o código que depende dele fica isolado em `src/lib/api.ts` e `src/types/analise.ts`, para a mudança ser barata. Quando o contrato mudar, atualizar este ficheiro, os tipos e o mock.

**Endpoints propostos:**

- `POST /api/analises`: cria uma análise. Resposta com `id` e `estado`.
- `GET /api/analises/{id}`: devolve a análise. O `estado` pode ser `a_processar`, `concluida` ou `erro`. Enquanto estiver `a_processar`, consultar de 2 em 2 ou 3 em 3 segundos, com limite de tempo e mensagem de erro clara.
- `PATCH /api/analises/{id}/premissas`: envia as premissas corrigidas e devolve uma **nova versão** da mesma análise. Recalcular não faz novos pedidos aos serviços da NASA.

**Pedido (valores de exemplo; as opções exatas de solo e de objetivo ainda se confirmam com o backend):**

```json
{
  "latitude": -12.78,
  "longitude": 15.74,
  "poligono": { "type": "Polygon", "coordinates": [] },
  "area_ha": 2.5,
  "cultura_atual": { "nome": "milho", "data_plantio": "2026-10-20" },
  "cultura_habitual": null,
  "rega": false,
  "tipo_solo": "nao_sei",
  "objetivo_principal": "saude_solo",
  "objetivo_secundario": null,
  "num_epocas": 2
}
```

`cultura_atual` é `null` quando não há nada plantado. Nesse caso `cultura_habitual` pode ser preenchida.

**Resposta (valores de exemplo, não são dados reais):**

```json
{
  "id": "exemplo-123",
  "estado": "concluida",
  "versao_analise": 1,
  "local": { "latitude": -12.78, "longitude": 15.74, "area_ha": 2.5 },
  "condicoes": {
    "chuva_mensal": [
      { "mes": "2026-10", "historico_mm": 90, "atual_mm": 70 }
    ],
    "inicio_epoca": { "data_tipica": "2026-10-15", "por_ano": [] },
    "humidade_solo": { "valor": 0.35, "normal": 0.42, "escala": "0 a 1" },
    "campo_nu": [],
    "declive": null
  },
  "estado_epoca": null,
  "estrategias": [
    {
      "id": "A",
      "nome": "Rotação atual (referência)",
      "sequencia": [
        { "epoca": 1, "cultura": "Milho" },
        { "epoca": 2, "cultura": "Milho" }
      ],
      "pontuacao": 0.4,
      "pontuacao_por_criterio": { "agua": 0.5, "erosao": 0.3 },
      "confianca": "media",
      "porque": "...",
      "evidencia": "...",
      "beneficios": "...",
      "lacunas": "...",
      "riscos": "...",
      "fontes": []
    }
  ],
  "cuidados": null,
  "premissas": [
    {
      "id": "tipo_solo",
      "nome": "Tipo de solo",
      "valor": "nao_sei",
      "tipo": "select",
      "opcoes": ["arenoso", "franco", "argiloso", "nao_sei"],
      "origem": "agricultor",
      "estado": "por_validar",
      "editavel": true
    }
  ],
  "metadados": {
    "fontes": ["NASA POWER", "MODIS (ORNL DAAC)"],
    "resolucoes": "Chuva e humidade do solo: célula de cerca de 50 km. Vegetação: 250 m.",
    "datas_dados": "...",
    "avisos": []
  }
}
```

**Regras para o frontend:**

- O backend devolve o resultado **já calculado**. O frontend não faz contas agronómicas nem de pontuação.
- Em caso de erro, o backend devolve `{ "erro": { "codigo": "...", "mensagem": "..." } }` (proposta). Mostrar uma mensagem em português com a opção de tentar de novo.
- Dados parciais (por exemplo, um serviço da NASA falhou) vêm indicados em `metadados.avisos`. Mostrar sempre esses avisos.
- Campos opcionais podem vir a `null`. Os blocos P2 (`cuidados`, `declive`, `estado_epoca`) só aparecem quando existirem.

## 7. Como apresentar os resultados

- **Estratégia A** é sempre a rotação atual (ou a referência regional) e aparece primeiro, com esse nome. B e C são as alternativas.
- **Cada cartão de estratégia** mostra obrigatoriamente os cinco campos do desafio, com estes títulos: «Porquê», «Evidência dos dados», «Benefícios», «Lacunas de informação» e «Riscos a validar localmente». Mostra também a sequência de culturas por época, a pontuação (barra simples), a confiança (`alta`, `media`, `baixa`) e as fontes. **Nunca esconder lacunas nem riscos.**
- **Confiança baixa** tem um selo visível e uma frase a explicar que a ordem das estratégias pode mudar com pequenas alterações.
- **Gráficos:** chuva mensal (histórico contra atual, em mm, com o período de referência indicado), humidade do solo (0 a 1, contra o normal), períodos de campo nu e, em P2, declive. Cada gráfico tem unidades e uma frase a explicar como se lê.
- **Premissas:** lista com nome, valor, origem (agricultor, literatura ou NASA) e estado (por validar ou validada). Controlo de edição conforme o `tipo` (`select`, `number` ou `boolean`). O botão «Recalcular» só fica ativo quando algo mudou. Guardar a versão anterior em memória para mostrar «o que mudou».
- Formatar números e datas em português de Portugal (vírgula decimal, datas por extenso).
- Estados da interface a tratar sempre: sem dados (vazio), a carregar, erro, dados parciais, e sem ligação.

## 8. Avisos obrigatórios (texto para a interface)

- «Esta ferramenta apoia a decisão do agricultor. Não substitui o conhecimento local nem os técnicos agrícolas.»
- «Não fazemos previsão do tempo. Mostramos padrões históricos e o que já aconteceu nesta época.»
- «A chuva, a temperatura e a humidade do solo são estimativas para uma área de cerca de 50 km. A vegetação é uma média do seu terreno.»
- Junto de conteúdo agrícola (culturas, ciclos, cuidados): «Valores de fontes da FAO. Devem ser validados com um técnico local.»
- No mapa: a atribuição da EOX (secção 4).

## 9. Dados agrícolas

O catálogo de culturas (ciclos, necessidade de água, solo, fixação de azoto) é responsabilidade do backend. **O frontend não guarda nem inventa valores agrícolas.** Só mostra o que o backend envia, sempre com a fonte. Se um valor vier sem fonte, mostrar «fonte por indicar» e avisar o programador.

Fontes previstas para o catálogo: páginas FAO Crop Information, EcoCrop da FAO e a Tabela 11 do FAO-56. O FAO GAEZ **não** faz parte do MVP.

## 10. Fora de âmbito

- Chamar APIs de dados a partir do browser.
- Conjuntos de dados que só cobrem os EUA (Web Soil Survey, SSURGO, Cropland Data Layer, PRISM, NAIP, NLCD, etc.).
- EarthExplorer e FAO GAEZ no MVP.
- Previsão do tempo.
- Contas de utilizador e autenticação.
- Funcionalidades P3 sem pedido explícito.

## 11. Prioridades

- **P1:** landing; dashboard com mapa e atribuição; marcar o terreno e mostrar a área; formulário (situação atual, objetivo, horizonte); estado de análise (a carregar, erro); cartões das 3 estratégias com os 5 campos; gráfico de chuva; painel de premissas (lista); avisos obrigatórios; modo mock.
- **P2:** localização atual; estado desta época e cuidados com a cultura atual; editar premissas e recalcular com «o que mudou»; camadas GIBS; declive; resumo para WhatsApp.
- **P3:** cenários com variação de chuva ou temperatura, mais regiões e culturas, histórico por utilizador.

## 12. Antes de dar uma tarefa por concluída

- `npm run lint` e `npm run build` sem erros.
- Funciona com `NEXT_PUBLIC_USE_MOCK=true` e com o backend real.
- Testado num ecrã de telemóvel e num de computador.
- Os avisos obrigatórios e a atribuição do mapa estão visíveis.
- Nenhum valor agrícola, número ou fonte foi inventado. O que faltou está marcado com `TODO(confirmar)`.
- Se o contrato da API mudou, este ficheiro, os tipos e o mock foram atualizados.

## 13. Referências

- Documentos da equipa: «Field Shift: documento de contexto», «Field Shift: fluxo da aplicação» e «Field Shift: descrição do projeto». Pedir ao programador o acesso ou o texto.
- EOxCloudless (capacidades): `https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml`
- EOxCloudless (licença e atribuição): `https://cloudless.eox.at/license-non-commercial`
- NASA GIBS (capacidades): `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml`
- NASA GIBS (exemplos): `https://github.com/nasa-gibs/web-examples`
