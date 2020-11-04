import { Request, Response } from 'express';
import { KissFlowController } from '../controllers/kissflow.controller';

const router = require('express').Router();

router.post("/marriage-bureau/hook", (request: Request, response: Response) => {
    try {
        //immediately respond
        response.status(200).end()

        KissFlowController.WriteMarriageBureauWebhookToDB(request.body).then(data => {
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

router.post("/buyer-onboarding/hook", (request: Request, response: Response) => {
    try {
        //immediately respond
        response.status(200).end()

        KissFlowController.WriteBuyerOnboardingWebhookToDB(request.body).then(data => {
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

router.post("/seller-onboarding/hook", (request: Request, response: Response) => {
    try {
        //immediately respond
        response.status(200).end()

        KissFlowController.WriteSellerOnboardingWebhookToDB(request.body).then(data => {
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

export default router;