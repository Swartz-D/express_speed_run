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

app.use((req, res, next)=>{
  if(req.url.split('/')[2] >= 1) next();
    res.status(500).set('Content-Type','text/plain').send('Internal Server Error')
})

app
  .route('/chores')
  .get((req,res)=>{
  client.query(`SELECT * FROM chores`)
  .then(result=>{
    res.status(200).set('Content-Type','application/json').send(result.rows)
  })
})

  .post((req,res,next)=>{
    let todo = req.body;
    let task = todo.task;
    let desc = todo.description;
    console.log(todo)
    if(typeof task != 'string' && typeof desc != 'string') next();
    client.query(`INSERT INTO chores (task, description)
    VALUES ('${task}','${desc}') RETURNING *`)
    .then(result=>{
      res.status(200).set('Content-Type','application/json').send(result.rows)
  })
  })

app
  .route('/chores/:id')
  .get((req,res,next)=>{
    client.query(`SELECT * FROM chores WHERE id = ${req.params.id}`)
    .then(result =>{
      if(result.rows.length === 0) next();
      res.status(200).set('Content-Type','application/json').send(result.rows)
    })
  })

  .patch((req,res,next)=>{
    let todo = req.body;
    let task = todo.task;
    let desc = todo.description;
    console.log(todo)
    if((task && typeof task != 'string') || (desc && typeof desc != 'string')) next();
    client.query(`UPDATE chores SET task = COALESCE(NULLIF('${task}','undefined'), task), description = COALESCE(NULLIF('${desc}','undefined'), description) WHERE id = ${req.params.id} RETURNING *`)
    .then(result=>{
      if(result.rows.length === 0) next()
      res.status(200).set('Content-Type','appliction/json').send(result.rows)
    })
  })

  .delete((req,res,next)=>{
    client.query(`DELETE FROM chores WHERE id = ${req.params.id} RETURNING *`)
    .then(result=>{
      if(result.rows.length === 0) next();
      res.status(200).set('Content-Type','application/json').send(result.rows)
    })
  })

app.use((rew,res,next)=>{
  res.status(404).set('Content-Type','application/json').send('Not Found!')
})


app.listen(3050, ()=>{
  console.log(`Listening on port ${PORT}`);
})