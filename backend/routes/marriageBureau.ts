import { Request, Response } from 'express';
import { MarriageBureauController } from '../controllers/marriageBureau.controller';

const router = require('express').Router();

router.get("/getLatestDataForActiveCases", (request: Request, response: Response) => {
    try {
        MarriageBureauController.GetLatestDataForActiveCases().then(data => {
            response.json(data)
        }).catch(err => {
            response.status(500);
            response.end;
            console.error("Error: ", err)
        })
    } catch (err) {
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
})

router.get("/getClosedCases", (request: Request, response: Response) => {
    try {
        MarriageBureauController.GetClosedCases().then(data => {
            response.json(data)
        }).catch(err => {
            response.status(500);
            response.end;
            console.error("Error: ", err)
        })
    } catch (err) {
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
})

router.get("/getInstanceDetails/:id", (request: Request, response: Response) => {
    try {
        MarriageBureauController.GetInstanceDetails(request.params.id).then(data => {
            response.json(data)
        }).catch(err => {
            response.status(500);
            response.end;
            console.error("Error: ", err)
        })
    } catch (err) {
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
})

router.get("/getActions", (request: Request, response: Response) => {
    try {
        MarriageBureauController.GetActions().then(data => {
            response.json(data)
        }).catch(err => {
            response.status(500);
            response.end;
            console.error("Error: ", err)
        })
    } catch (err) {
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
})

export default router;