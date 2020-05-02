import { Request, Response } from 'express';
import { KissFlowController } from '../controllers/kissflow.controller';

const router = require('express').Router();

router.post("/hook", (request: Request, response: Response) => {
    try {
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
            // console.log(JSON.stringify(data))
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