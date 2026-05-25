import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000; // default port: 5000

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});