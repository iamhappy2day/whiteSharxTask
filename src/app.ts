import express from 'express';
import mongoose from 'mongoose';
import {config} from "./config";
import {ApiRouter} from "./routes/api.router";
import {apiRoutes} from "./routes/api.routes";
const apiRouter = new ApiRouter(express.Router(), apiRoutes).getApiRouter;

const app = express();

app.use(express.json());
app.use(apiRouter);

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
