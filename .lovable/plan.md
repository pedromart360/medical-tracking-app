# Calendário sincronizado com a linha do tempo

## O que muda

1. **Mês e ano andam juntos.** O calendário passa a controlar mês *e* ano (Janeiro 2026 … Dezembro 2023). Ao voltar de Janeiro, ele vai para Dezembro do ano anterior; ao avançar de Dezembro, vai para Janeiro do ano seguinte. Nos extremos as setas ficam desativadas, sem dar a volta.
2. **A bolinha da linha do tempo acompanha.** A linha do tempo tem 48 pontos, exatamente 12 meses × 4 anos, então cada mês exibido tem um ponto próprio. O ponto preto se move a cada troca de mês e cruza a marcação do ano quando o ano muda.
3. **Linha do tempo sempre visível.** Ela fica fixa na base do painel do calendário, em todos os meses e também na tela de detalhe do dia.
4. **Título com o ano.** O cabeçalho mostra "Janeiro" com o ano em tamanho menor ao lado, para o usuário saber onde está.
5. **Clique na linha do tempo.** Clicar em um ponto leva direto àquele mês (atalho coerente com o design).

## Como manter fiel ao design sem quebrar em telas pequenas

O desenho original é uma "folha" clara com um painel cinza no meio, setas nas laterais e a régua de anos embaixo. A forma mais segura de reproduzir isso é:

- **Proporção fixa para a grade dos dias:** 7 colunas de círculos com proporção 1:1 e espaçamentos em porcentagem — assim a grade encolhe inteira, mantendo o mesmo desenho, em vez de quebrar linhas.
- **Três faixas empilhadas** (puxador, painel dos dias, linha do tempo): o painel do meio é o único que encolhe; a linha do tempo nunca é empurrada para fora da tela.
- **Tamanhos fluidos** (mesma técnica já usada na página inicial) para texto, círculos e espaçamentos, em vez de valores fixos por breakpoint.
- **No celular:** o painel ocupa quase toda a tela, as setas passam a ficar logo abaixo do painel (em vez de nas laterais, onde não há espaço) e a régua de anos reduz a quantidade de marcas finas, mantendo os quatro rótulos de ano.
- **Meses com 28/30/31 dias** passam a usar a contagem real do calendário, em vez da aproximação atual.

## Validação

- Conferir em computador, tablet e celular: abrir o calendário, avançar e voltar meses, observar a bolinha andando e o ano mudando.
- Conferir o detalhe do dia com a linha do tempo visível.

## Detalhes técnicos

- `src/components/Calendar.tsx`: estado passa de `mesIndex` para `{ anoIndex, mesIndex }`; `activeIndex = anoIndex * 12 + mesIndex` é repassado ao `Timeline`.
- `src/components/Timeline.tsx`: aceita `onSelect?: (index: number) => void` e renderiza os 48 pontos como alvos clicáveis quando a prop existe; comportamento atual preservado na página inicial.
- Dias por mês calculados com `new Date(ano, mes + 1, 0).getDate()`.
- Marcadores continuam vindo de `marcadores` em `src/lib/data.ts`, ainda por nome do mês (dados demonstrativos, sem persistência).
