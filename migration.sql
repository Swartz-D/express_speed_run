DROP TABLE IF EXISTS chores;

CREATE TABLE chores (
  id serial UNIQUE,
  task varchar(50),
  description varchar(250)
)