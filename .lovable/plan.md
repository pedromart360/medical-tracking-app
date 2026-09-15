# Atualização da interface e taxonomia

## O que será ajustado
- Trocar os quatro cartões da página inicial pelo formato original de `pasta.svg`, preservando as imagens e os acessos atuais.
- Aplicar as medidas, espaçamentos e tipografia Helvetica Neue documentados nos blueprints.
- Completar Exames e Médicos com todas as categorias, subcategorias e especialidades presentes em `taxonomia.json`.
- Manter os ícones visuais provisórios atuais até o envio do conjunto definitivo.
- Alinhar os fluxos de Exames, Médicos, Tratamentos e Doenças aos PDFs, incluindo estados selecionados e telas de detalhe.

## Validação
- Conferir a página inicial e os principais caminhos em tela ampla e em celular.
- Testar cliques entre categorias, listas e detalhes, além do calendário e da linha do tempo.

## Detalhes técnicos
- O `pasta.svg` será incorporado como forma dos cartões, sem alterar a navegação existente.
- As cores e estilos de texto do JSON serão convertidos em estilos globais reutilizáveis.
- Os dados continuam demonstrativos e locais nesta etapa; não será adicionada persistência.
