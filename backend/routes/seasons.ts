import { Request, Response } from 'express';
import { SeasonController } from '../controllers/season.controller';

const router = require('express').Router();


router.get('/', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetSeasons();
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/allPlayersCareerStats', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetAllPlayerCareerStats();
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/getCurrentSeason', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetCurrentSeason();
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
        const result = await SeasonController.GetSeasonById(request.params.id);
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
        const result = await SeasonController.UpdateSeason(request.params.id, request.body);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.post('/', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.CreateSeason(request.body);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/:id/playerSeasonStats', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetPlayerSeasonStats(request.params.id);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/:id/playerCareerStats', async (request: Request, response: Response) => {
    console.log("im here")
    try {
        const result = await SeasonController.GetPlayerCareerStats(request.params.id);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});



export default router;

