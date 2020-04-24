// import { Request, Response } from 'express';
// import { CloudinaryController } from '../controllers/cloudinary.controller';

// const router = require('express').Router();

// router.get('/', async (request: Request, response: Response) => {
//     try {
//         const result = await CloudinaryController.GetFolders();
//         response.json(result);
//         response.end();
//     } catch (err) {
//         response.status(500);
//         response.end;
//         console.error("Error: ", err)
//     }
// });

// router.get('/root-folders', async (request: Request, response: Response) => {
//     try {
//         const result = await CloudinaryController.GetFolders();
//         console.log(`result2: ${JSON.stringify(result)}`)
//         response.json(result);
//         response.end();
//     } catch (err) {
//         response.status(500);
//         response.end;
//         console.error("Error: ", err)
//     }
// });

// router.get('/sub-folders/:rootFolder', async (request: Request, response: Response) => {
//     try {
//         const result = await CloudinaryController.GetSubFolders(request.params.rootFolder);
//         response.json(result);
//         response.end();
//     } catch (err) {
//         response.status(500);
//         response.end;
//         console.error("Error: ", err)
//     }
// });

// router.get('/resources/:prefix', async (request: Request, response: Response) => {
//     try {
//         const result = await CloudinaryController.GetResourcesInFolder(request.params.prefix);
//         response.json(result);
//         response.end();
//     } catch (err) {
//         response.status(500);
//         response.end;
//         console.error("Error: ", err)
//     }
// });

// router.get('/resource/:public_id', async (request: Request, response: Response) => {
//     try {
//         const result = await CloudinaryController.GetResourceByPublicId(request.params.public_id);
//         response.json(result);
//         response.end();
//     } catch (err) {
//         response.status(500);
//         response.end;
//         console.error("Error: ", err)
//     }
// });

// export default router;

