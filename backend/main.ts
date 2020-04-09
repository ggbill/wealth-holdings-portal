import app from './app';
import * as http from 'http';


const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT);

server.on('error', (err) => {
    console.error(err);
});

server.on('listening', async () => {
    console.info(`Listening on a port ${PORT}`);
    // mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lightning", {
    // // mongoose.connect(process.env.MONGODB_URI || "mongodb://dbadmin:aN0icePwd!@ds141198.mlab.com:41198/heroku_6fgvb2sk", {
    //     useNewUrlParser: true,
    //     useFindAndModify: false
    // });
    // mongoose.connection.once('open', () => {
    //     console.info('Connected to Mongo via Mongoose');
    // });
    // mongoose.connection.on('error', (err) => {
    //     console.error('Unable to connect to Mongo via Mongoose', err);
    // });
});