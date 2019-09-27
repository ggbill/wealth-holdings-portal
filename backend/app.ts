import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import requestLoggerMiddleware from './request.logger.middleware';

const path = require('path');


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

if (process.env.NODE_ENV === 'production'){
    app.use(express.static( '../frontend/build '));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'server.js'));
    })
}

export default app; 