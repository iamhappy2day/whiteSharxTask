import express from 'express';
import { ApiRouter } from './routes/api.router';
import { apiRoutes } from './routes/api.routes';
import multer from 'multer';
import {checkIfRouteExists} from "./middlewares/handlingNotExistingRoutes";
const apiRouter = new ApiRouter(express.Router(), apiRoutes)
  .getApiRouter;
const upload = multer({ dest: 'csv/' });

export const app = express();

app.use(express.json());
app.use(apiRouter);
app.all('*', checkIfRouteExists);
