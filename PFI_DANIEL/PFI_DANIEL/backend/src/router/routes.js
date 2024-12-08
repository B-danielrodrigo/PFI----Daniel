import db from '../db/sqlite3.js';
import express from 'express';

const app = express();

// ** Rotas para Usuários **

app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;

    db.run(query, [nome, email, senha], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, nome, email });
        }
    });
});

// Rota para editar o nome e senha de um usuário
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, senha } = req.body;
    const query = `UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?`;

    db.run(query, [nome, senha, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        } else {
            res.json({ message: 'Usuário atualizado com sucesso.' });
        }
    });
});

// Rota para excluir um usuário
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM usuarios WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        } else {
            res.json({ message: 'Usuário excluído com sucesso.' });
        }
    });
});

// Rota de login
app.post('/usuarios/login', (req, res) => {
    const { email, senha } = req.body;
    const query = `SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?`;

    db.get(query, [email, senha], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(401).json({ message: 'Credenciais inválidas.' });
        } else {
            res.json({ message: 'Login realizado com sucesso.', usuario: row });
        }
    });
});




// ** Rotas para Materiais **

// Rota para adicionar um material
app.post('/materiais', (req, res) => {
    const { titulo, disciplina, link, id_usuario } = req.body;
    const query = `
        INSERT INTO materiais (titulo, disciplina, link, id_usuario) 
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [titulo, disciplina, link, id_usuario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, titulo, disciplina, link, id_usuario });
        }
    });
});

// Rota para editar um material
app.put('/materiais/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, disciplina, link } = req.body;
    const query = `
        UPDATE materiais 
        SET titulo = ?, disciplina = ?, link = ? 
        WHERE id = ?
    `;

    db.run(query, [titulo, disciplina, link, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Material não encontrado.' });
        } else {
            res.json({ message: 'Material atualizado com sucesso.' });
        }
    });
});

// Rota para excluir um material
app.delete('/materiais/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        DELETE FROM materiais 
        WHERE id = ?
    `;

    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Material não encontrado.' });
        } else {
            res.json({ message: 'Material excluído com sucesso.' });
        }
    });
});

// Rota para listar materiais por usuário
app.get('/materiais/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const query = `
        SELECT * FROM materiais 
        WHERE id_usuario = ?
    `;

    db.all(query, [id_usuario], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});



// ** Rotas para Tarefas **

// Rota para adicionar uma tarefa
app.post('/tarefas', (req, res) => {
    const { titulo, descricao, prazo, prioridade, id_usuario } = req.body;
    const query = `
        INSERT INTO tarefas (titulo, descricao, prazo, prioridade, id_usuario) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [titulo, descricao, prazo, prioridade, id_usuario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, titulo, descricao, prazo, prioridade, id_usuario });
        }
    });
});

// Rota para editar uma tarefa
app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prazo, prioridade } = req.body;
    const query = `
        UPDATE tarefas 
        SET titulo = ?, descricao = ?, prazo = ?, prioridade = ? 
        WHERE id = ?
    `;

    db.run(query, [titulo, descricao, prazo, prioridade, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Tarefa não encontrada.' });
        } else {
            res.json({ message: 'Tarefa atualizada com sucesso.' });
        }
    });
});

// Rota para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        DELETE FROM tarefas 
        WHERE id = ?
    `;

    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Tarefa não encontrada.' });
        } else {
            res.json({ message: 'Tarefa excluída com sucesso.' });
        }
    });
});

// Rota para listar tarefas por usuário
app.get('/tarefas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    console.log(id_usuario)
    const query = `
        SELECT * FROM tarefas 
        WHERE id_usuario = ?
    `;

    db.all(query, [id_usuario], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});



// ** Rotas para Anotações **

// Rota para adicionar uma anotação
app.post('/anotacoes', (req, res) => {
    const { conteudo, id_usuario } = req.body;
    const query = `
        INSERT INTO anotacoes (conteudo, id_usuario) 
        VALUES (?, ?)
    `;

    db.run(query, [conteudo, id_usuario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, conteudo, id_usuario });
        }
    });
});

// Rota para editar uma anotação
app.put('/anotacoes/:id', (req, res) => {
    const { id } = req.params;
    const { conteudo } = req.body;
    const query = `
        UPDATE anotacoes 
        SET conteudo = ? 
        WHERE id = ?
    `;

    db.run(query, [conteudo, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Anotação não encontrada.' });
        } else {
            res.json({ message: 'Anotação atualizada com sucesso.' });
        }
    });
});

// Rota para excluir uma anotação
app.delete('/anotacoes/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        DELETE FROM anotacoes 
        WHERE id = ?
    `;

    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Anotação não encontrada.' });
        } else {
            res.json({ message: 'Anotação excluída com sucesso.' });
        }
    });
});

// Rota para listar anotações por usuário
app.get('/anotacoes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const query = `
        SELECT * FROM anotacoes 
        WHERE id_usuario = ?
    `;

    db.all(query, [id_usuario], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

export default app;