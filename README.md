# Recado importante ao rodrigo e equipe
Subi o .env com minha chave API do GOOGLE de propósito, para fascilitar rodar a aplicação ai na hora, é apenas uma chave teste e sem custos, depois de avaliada, eu derrubo! 

<img width="705" alt="Captura de Tela 2025-03-20 às 18 06 49" src="https://github.com/user-attachments/assets/70055dae-abc0-4513-97f3-61d397232fa1" />

# CEP Service

Este projeto é um serviço de API REST para buscar endereços a partir de um CEP (Código de Endereçamento Postal) utilizando o framework NestJS, e a partir dele, retornar o bar mais próximo!

## Estrutura do Projeto

O projeto segue os princípios SOLID para organização.

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/GabrielBorgess/cep-service-nestjs
    cd cep-service-nestjs
    ```

2. Instale as dependências:
    ```sh
    pnpm install
    ```

## Executando a Aplicação

Para iniciar a aplicação, execute o seguinte comando:
```sh
pnpm start
```

Para iniciar os testes da aplicação, execute o seguinte comando:
```sh
pnpm test
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Endpoints

### Buscar Endereço por CEP

```sh
URL: /cep/:cep
```

#### Exemplo de Requisição

```http
GET http://localhost:3000/cep/01001000
```

#### Exemplo de Resposta

```json
{
  "mensagem": "Seu CEP indica que você mora na cidade de São Paulo, que fica no estado de SP. Esta mensagem foi personalizada pela API."
}
```

Sim, nossa API não apenas retorna informações úteis, mas também faz você sorrir com mensagens personalizadas. Afinal, quem não gosta de um pouco de diversão enquanto trabalha?

---

Se precisar de mais ajustes ou quiser adicionar algo, é só avisar! 😄
