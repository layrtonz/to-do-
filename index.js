const express = require("express");

const app = express();

app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("API Funcionando!!!")
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/")
})

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório"});
  }

  const task = {
      id: nextId++,
      title,
      done: false

  };

    tasks.push(task);
    res.status(201).json(task)

})

app.get("/tasks", (req, res) => {
  res.json(tasks);
})

app.put("/tasks/:id", (req, res) => {
  const {id} = req.params
  const {title, done} = req.body;
  
  const task = tasks.find(t => t.id === parseInt(id));

  if(!task) {
    return res.status(400).json({error: "Tarefa não encontrada"});
  }

  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = Boolean(done);

  res.json(task)
})

app.delete("/tasks/:id", (req, res) => {
  const {id} = req.params;

  const index = tasks.findIndex(t => t.id === parseInt(id))

  if ( index === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada"});
  }

  const deleteTask = tasks.splice(index, 1);

  res.json(deleteTask[0])
})