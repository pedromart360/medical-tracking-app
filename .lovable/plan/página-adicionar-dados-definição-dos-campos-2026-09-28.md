# Página "Adicionar dados" — definição dos campos

## Formato
- Página dedicada (`/adicionar`) com a mesma moldura de pasta dos demais módulos.
- Entrada por seletor de tipo: Exame, Médico, Tratamento ou Doença.
- Cada tipo abre seu próprio formulário; ao salvar, o dado entra na base local e passa a aparecer nas listas, no calendário e na linha do tempo.

## Campos por tipo

### Exame
- **Obrigatórios:** nome do exame; categoria (Laboratoriais, De Imagem, Nucleares, Cardiológicos, Genéticos); tipo (sublista da categoria); data de realização.
- **Opcionais:** área médica; médico solicitante; médico/laboratório realizador; local; upload de imagem ou PDF do resultado; upload do laudo; observações.

### Médico
- **Obrigatórios:** nome; especialidade.
- **Opcionais:** CRM; foto; breve biografia/apresentação.

### Tratamento
- **Obrigatórios:** nome; categoria (Domiciliar, Hospitalar, Medicamentoso); data de início.
- **Opcionais:** data de fim (se vazio, conta como dia único); médico que pediu; realizado por; local; resumo/anotações.

### Doença
- **Obrigatórios:** nome da doença; data da descoberta.
- **Opcionais:** médico que percebeu (vincula à ficha dele); tratamento vinculado; upload de laudo/documento; observações.

## Regras de validação
- Nome e datas sempre obrigatórios; datas no formato DD/MM/AAAA com seleção por calendário.
- Uploads aceitam PDF e imagens (JPG/PNG), com limite de tamanho.
- Campos de texto com limite de caracteres e limpeza de entrada.
- Botão "Salvar" só ativa quando os obrigatórios estão preenchidos; confirmação visual após salvar com opção de adicionar outro.

## Validação
- Conferir cada formulário em tela ampla e em celular.
- Salvar um dado de cada tipo e confirmar que ele aparece no módulo correspondente.

## Detalhes técnicos
- Dados continuam locais/demonstrativos nesta etapa (sem persistência em servidor); novos registros ficam em memória/localStorage, como já ocorre com resumos e observações.
- Perfil do usuário, tela de cadastro inicial e o botão "resumo geral" em PDF ficam para a etapa seguinte, fora deste plano.
