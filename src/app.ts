import express from 'express';
import mongoose from 'mongoose';


const app = express();

app.use(express.json());

const port = 3000;

app.listen(port, () => {
   console.log('Server is running...')
});
