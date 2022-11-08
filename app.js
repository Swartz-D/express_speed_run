const express = require('express');
const app = express();
const {Client} = require('pg');
//const { config } = require('process');
const config = require('./config.json')["dev"];
const PORT = 3050;

app.use(express.json());

const client = new Client({
  connectionString: config.connectionString,
});
client.connect();

app
  .route('/chores')
  .get((req,res)=>{
  client.query(`SELECT * FROM chores`)
  .then(result=>{
    res.status(200).set('Content-Type','application/json').send(result.rows)
  })
})

  .post((req,res)=>{
    let todo = req.body;
    let task = todo.task;
    let desc = todo.description;
    client.query(`INSERT INTO chores (task, description)
    VALUES ('${task}','${desc}') RETURNING *`)
    .then(result=>{
      res.status(200).set('Content-Type','application/json').send(result.rows)
    })
  })

app
  .route('/chores/:id')
  .get((req,res)=>{
    client.query(`SELECT * FROM chores WHERE id = ${req.params.id}`)
    .then(result =>{
      res.status(200).set('Content-Type','application/json').send(result.rows)
    })
  })

  .patch((req,res)=>{
    let todo = req.body;
    let task = todo.task;
    let desc = todo.description;
    client.query(`UPDATE chores SET task = ${task}, description = ${desc} WHERE id = ${req.params.id} RETURNING *`)
    .then(result=>{
      res.status(200).set('Content-Type','appliction/json').send(result.rows)
    })
  })

  .delete((req,res)=>{
    client.query(`DELETE FROM chores WHERE id = ${req.params.id} RETURNING *`)
    .then(result=>{
      res.status(200).set('Content-Type','application/json').send(result.rows)
    })
  })


app.listen(3050, ()=>{
  console.log(`Listening on port ${PORT}`);
})