import sqlite3 from 'sqlite3';

// Cria ou abre o banco de dados
const db = new sqlite3.Database('./goodstudy.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Cria as tabelas
db.serialize(() => {
    // Tabela de Materiais
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            senha TEXT NOT NULL
        );
    `);

    // Tabela de Materiais
    db.run(`
        CREATE TABLE IF NOT EXISTS materiais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            disciplina TEXT NOT NULL,
            link TEXT NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Tabela de Tarefas
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            prazo TEXT NOT NULL,
            prioridade TEXT NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Tabela de Anotações
    db.run(`
        CREATE TABLE IF NOT EXISTS anotacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conteudo TEXT NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    console.log('Tabelas criadas ou verificadas com sucesso.');
});

// Fecha o banco de dados de forma segura ao encerrar o processo
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o banco de dados:', err.message);
        } else {
            console.log('Banco de dados fechado com sucesso.');
        }
        process.exit(0);
    });
});

export default db;
