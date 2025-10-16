# Executiva Task Manager - Backend

## Descrição

Este é o backend da aplicação Executiva Task Manager, desenvolvido com NestJS. Ele gerencia a autenticação de usuários e o CRUD de tarefas através de uma API RESTful.

## Como Iniciar

1.  **A partir da raiz do projeto, navegue até a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie a aplicação em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```

A aplicação estará disponível em `http://localhost:3000`.

## Banco de Dados

-   Este projeto utiliza **SQLite** como banco de dados para simplificar a configuração.
-   O arquivo do banco de dados (`db.sqlite`) é intencionalmente ignorado pelo versionamento (`.gitignore`).
-   Ao iniciar o servidor pela primeira vez, o arquivo `db.sqlite` será **criado automaticamente** na pasta `backend/`.
