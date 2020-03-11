import express from 'express';
import { ApiRouter } from './routes/api.router';
import { apiRoutes } from './routes/api.routes';
import multer from 'multer';
const apiRouter = new ApiRouter(express.Router(), apiRoutes)
  .getApiRouter;
const upload = multer({ dest: 'csv/' });

export const app = express();

app.use(express.json());
app.use(apiRouter);
