import { Request, Response } from 'express';
import { SettingsController } from '../controllers/settings.controller';

const router = require('express').Router();

router.get("/getSettings", (request: Request, response: Response) => {
    try {
        SettingsController.GetSettings().then(data => {
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

router.post("/", (request: Request, response: Response) => {
    console.log(JSON.stringify(request.body))
    try {
        SettingsController.UpdateSettings(request.body).then(data => {
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