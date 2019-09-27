import { Request, Response } from 'express';
import { PlayerController } from '../controllers/player.controller';

const router = require('express').Router();

router.get('/', async (request: Request, response: Response) => {
    try {
        const result = await PlayerController.GetPlayers();
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/:id', async (request: Request, response: Response) => {
    try {
        const result = await PlayerController.GetPlayerById(request.params.id);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.put('/:id', async (request: Request, response: Response) => {
    try {
        const result = await PlayerController.UpdatePlayer(request.params.id, request.body.player);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.post('/create', async (request: Request, response: Response) => {
    try {
        const result = await PlayerController.CreatePlayer(request.body.player);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

export default router;

