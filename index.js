// index.js
const express = require("express");
const pool = require("./db"); // nossa conexão com o PostgreSQL

const app = express();

// Permite receber JSON no corpo das requisições
app.use(express.json());

// Rota de saúde
app.get("/", (req, res) => {
  res.send("API Task Manager + PostgreSQL 🚀");
});

// LISTAR tarefas
app.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
});

// CRIAR tarefa
app.post("/tasks", async (req, res) => {
  const { title, done } = req.body;

  if (!title) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório" });
  }

  try {
    // COALESCE($2,false) => se 'done' não vier, usa false
    const { rows } = await pool.query(
      "INSERT INTO tasks (title, done) VALUES ($1, COALESCE($2, false)) RETURNING *",
      [title, done]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
});

// ATUALIZAR tarefa (parcial: title e/ou done)
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  try {
    // COALESCE mantém o valor atual se não enviar o campo
    const { rows } = await pool.query(
      "UPDATE tasks SET title = COALESCE($1, title), done = COALESCE($2, done) WHERE id = $3 RETURNING *",
      [title, done, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

// DELETAR tarefa
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    // retorno a tarefa removida só pra confirmação
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
});

// Sobe o servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
