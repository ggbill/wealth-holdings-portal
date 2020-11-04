import { Request, Response } from 'express';
import { SellerOnboardingController } from '../controllers/sellerOnboarding.controller';

const router = require('express').Router();

router.get("/getLatestDataForActiveCases", (request: Request, response: Response) => {
    try {
        SellerOnboardingController.GetLatestDataForActiveCases().then(data => {
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
        SellerOnboardingController.GetClosedCases().then(data => {
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
        SellerOnboardingController.GetInstanceDetails(request.params.id).then(data => {
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
        SellerOnboardingController.GetActions().then(data => {
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