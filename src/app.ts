import express from 'express';
import mongoose from 'mongoose';
import {config} from "./config";


const app = express();

app.use(express.json());

mongoose.connect(config.DB_CONNECT, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
    .then(() => console.log("We successfully connected to DB"))
    .catch((error: Error) => {
       console.log(error.message)
    });

app.listen(config.PORT, () => {
   console.log('Server is running...')
});
