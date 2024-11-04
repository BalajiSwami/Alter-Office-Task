import express from 'express';
import { Controller } from './controller';

let app = express.Router();

app.post('/', (req, res) => {
    Controller.createModel(req, res);
});

app.get('/', (req, res) => {
    Controller.getModel(req, res)
});

app.patch('/:id', (req, res) => {
    Controller.updateModel(req, res)
});

app.delete('/:id', (req, res) => {
    Controller.deleteModel(req, res)
});
export const Router = app;