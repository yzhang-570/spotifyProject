import cors from 'cors';
import 'dotenv/config';
import express from 'express';

// TODO: remove, use express router - only for testing
import { fetchData } from './db/testDB.js'

const app = express();
const port = process.env.PORT || 5000; // default port: 5000

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.json('Welcome to root.');
})

// TODO: remove, use express router - only for testing
app.get('/test', (req, res) => {
  const getData = async () => {
    try {
      const response = await fetchData()
      res.status(200).json(response);
    }
      catch(error) {
      res.status(500).json(`Internal server error: ${error}`);
    }
  }
  getData();
})