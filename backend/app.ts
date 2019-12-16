import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import requestLoggerMiddleware from './request.logger.middleware';


const path = require('path');
const compression = require("compression");
var expressStaticGzip = require("express-static-gzip");


// const seasonsRouter = require('./routes/seasons');
// const fixturesRouter = require('./routes/fixtures');
// const playersRouter = require('./routes/players');
// const teamsRouter = require('./routes/teams');

import seasonsRouter from './routes/seasons';
import fixturesRouter from './routes/fixtures';
import playersRouter from './routes/players';
import teamsRouter from './routes/teams';

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware);

app.use('/seasons', seasonsRouter);
app.use('/fixtures', fixturesRouter);
app.use('/players', playersRouter);
app.use('/teams', teamsRouter);

function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }

if (process.env.NODE_ENV === 'production') {

    // Declare the path to frontend's static assets
    app.use(express.static(path.resolve("..", "frontend", "build")), expressStaticGzip(path.resolve("..", "frontend", "build"), {
        enableBrotli: true,
        orderPreference: ['br', 'gz'],
        setHeaders: function (res, path) {
           res.setHeader("Cache-Control", "public, max-age=31536000");
        }
     }));

    app.use(compression({
        level: 6,               // set compression level from 1 to 9 (6 by default)
        filter: shouldCompress, // set predicate to determine whether to compress
      }));

    // Intercept requests to return the frontend's static entry point
    app.get("*", (_, response) => {
        response.sendFile(path.resolve("..", "frontend", "build", "index.html"));
    });

}

export default app; 