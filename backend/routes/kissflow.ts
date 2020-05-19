import { Request, Response } from 'express';
import { KissFlowController } from '../controllers/kissflow.controller';

const router = require('express').Router();

router.post("/hook", (request: Request, response: Response) => {
    try {
        //immediately respond
        response.status(200).end()

        KissFlowController.WriteWebhookToDB(request.body).then(data => {
            response.status(200).end()
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

router.get("/getLatestDataForActiveCases", (request: Request, response: Response) => {
    try {
        KissFlowController.GetLatestDataForActiveCases().then(data => {
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
        KissFlowController.GetInstanceDetails(request.params.id).then(data => {
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