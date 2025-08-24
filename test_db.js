const pool = require("./db");

async function testConection(){
  try {
    const res = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    console.log("Tarefas", res.rows)
  } catch (error) {
    console.log("Erro ao conectar no banco", error)
  }
}

testConection();