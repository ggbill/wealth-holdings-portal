import { Request, Response } from 'express';
import { FixtureController } from '../controllers/fixture.controller';

const router = require('express').Router();
module.exports = router;

router.get('/', async (request: Request, response: Response) => {
    try {
        const result = await FixtureController.GetFixtures();
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
        const result = await FixtureController.GetFixtureById(request.params.id);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.put('/:id', async (request: Request, response: Response) => {
    console.log("id: " + request.params.id);
    console.log("body: " + JSON.stringify(request.body))
    try {
        const result = await FixtureController.UpdateFixture(request.params.id, request.body.fixture);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.post('/create', async (request: Request, response: Response) => {
    console.log("body: " + JSON.stringify(request.body))
    try {
        const result = await FixtureController.CreateFixture(request.body.fixture);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

