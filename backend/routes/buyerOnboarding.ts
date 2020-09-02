import { Request, Response } from 'express';
import { BuyerOnboardingController } from '../controllers/buyerOnboarding.controller';

const router = require('express').Router();

router.get("/getLatestDataForActiveCases", (request: Request, response: Response) => {
    try {
        BuyerOnboardingController.GetLatestDataForActiveCases().then(data => {
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
        BuyerOnboardingController.GetClosedCases().then(data => {
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
        BuyerOnboardingController.GetInstanceDetails(request.params.id).then(data => {
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
        BuyerOnboardingController.GetActions().then(data => {
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