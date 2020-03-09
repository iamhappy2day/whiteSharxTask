import express from 'express';
import { ApiRouter } from './routes/api.router';
import { apiRoutes } from './routes/api.routes';
const apiRouter = new ApiRouter(express.Router(), apiRoutes).getApiRouter;

export const app = express();
app.use(express.json());
app.use(apiRouter);


