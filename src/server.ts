import cors from 'cors';
import express, {json} from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));