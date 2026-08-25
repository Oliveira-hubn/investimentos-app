# Investfy

## Autor
Kauê Rodrigues de Oliveira Rocha — Matrícula 22606256

## Descrição
Painel de cotações da B3 que permite consultar o preço atual, variação do dia e outros indicadores de ações negociadas na bolsa brasileira.

## API utilizada
- Brapi — https://brapi.dev
- Endpoint(s) consumido(s): `GET https://brapi.dev/api/quote/{ticker}` (dados de PETR4, VALE3, ITUB4 e MGLU3, disponíveis sem autenticação)

## Funcionalidades
- Selecionar um ativo (PETR4, VALE3, ITUB4 ou MGLU3) e consultar sua cotação atual
- Visualizar preço, variação percentual do dia, abertura, fechamento anterior, máxima, mínima e volume negociado
- Ver o horário da última atualização da consulta
- Acompanhar uma faixa de ticker rolando no topo com o preço dos 4 ativos disponíveis
- Receber mensagem amigável caso a API esteja indisponível ou o ativo não seja encontrado

## Como executar localmente
1. Clone: `git clone https://github.com/Oliveira-hubn/investimentos-app.git`
2. Abra o arquivo `index.html` no navegador

## Links
- **Aplicação no ar (GitHub Pages):** https://oliveira-hubn.github.io/investimentos-app/
- **Repositório:** https://github.com/Oliveira-hubn/investimentos-app
