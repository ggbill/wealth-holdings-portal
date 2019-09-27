import { Request, Response } from 'express';
import { TeamController } from '../controllers/team.controller';

const router = require('express').Router();

router.get('/', async (request: Request, response: Response) => {
    try {
        const result = await TeamController.GetTeams();
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
        console.log(request.params.id)
        const result = await TeamController.GetTeamById(request.params.id);
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
        const result = await TeamController.UpdateTeam(request.params.id, request.body.team);
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
        const result = await TeamController.CreateTeam(request.body.team);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

export default router;

