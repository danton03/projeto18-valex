import cors from 'cors';
import dotenv from "dotenv";
import express, {json} from 'express';
import 'express-async-errors';
import errorHandler from './middlewares/errorHandler';
import router from './routes/routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(errorHandler);

const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));