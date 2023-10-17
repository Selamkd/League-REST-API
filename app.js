//Import express, nodemon, fs and UUID
import express from 'express';
import nodemon from 'nodemon';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { config as configDotenv } from 'dotenv';
import cors from 'cors';
configDotenv();
//deploying to heruku

//set port number
const PORT = process.env.PORT || 4000;
const app = express();

// bring in CRUD functions from crudchamps.js
import {
  getChampions,
  getChampionByID,
  getChampionByName,
  addChampion,
  // editChampionData,
  deleteChampion,
} from './crudchamps.js';

//Set up modules for use
app.use(express.json());
app.use(morgan('dev'));
//app.use(cors('dev')) *add back in if we add frontend*
app.use(
  cors({
    origin: `http://127.0.0.1:5500`,
  })
);
//add port listening
app.listen(PORT, function () {
  console.log(`Sever is now listening on http://localhost:${PORT}`);
});

//add welcome message to test
app.get('/', function (req, res) {
  res.send("Welcome to Team 31's League of Legends API!");
});

// get all champions
app.get('/champions', async function (req, res) {
  const champions = await getChampions();
  const response = {
    status: 'success',
    data: champions,
  };
  return res.status(200).json(champions);
});

// get a specific champion by it's id
app.get('/champions/id/:id', async function (req, res) {
  const id = req.params.id;

  const champion = await getChampionByID(id);

  if (!champion) {
    return res.status(404).json({ error: 'Champion could not be found' });
  }

  const response = {
    status: 'success',
    data: champion,
  };

  return res.status(200).json(response);
});
// get a specific champion by it's name
app.get('/champions/name/:championName', async function (req, res) {
  const name = req.params.championName;

  const champion = await getChampionByName(name);
  console.log(champion);
  const response = {
    status: 'success',
    data: champion,
  };

  return res.status(200).json(response);
});

// add new champion object to the data
app.post('/champions', async function (req, res) {
  // get user data from req.body;
  const newChampion = req.body;
  // call the createUser() function to a new user variable
  let createdChampion = await addChampion(newChampion);

  // return with a created user data and a 201 created status

  const response = {
    status: 'success',
    data: createdChampion,
  };
  return res.status(201).json(response);
});

// delete a champion's object by it's id
app.delete('/champions/:id', async function (req, res) {
  const id = req.params.id;
  const deletedChampion = await getChampionByID(id);
  if (!deletedChampion) {
    return res.status(404).json({ error: 'Champion not found' });
  } else {
    await deleteChampion(id);
    res.status(200).json({
      message: 'Champion deleted successfully',
      champion: deletedChampion,
    });
  }
});
