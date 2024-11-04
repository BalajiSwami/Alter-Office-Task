import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { dbConnection } from './src/Connection/dbConnection';
import { Router } from './src/Controller/router';


let app = express();
app.use(cors());
app.use(express.json());
dbConnection.getConnection()

app.use('/api/nodes', Router)

let PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});