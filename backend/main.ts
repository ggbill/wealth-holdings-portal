import app from './app';
import * as http from 'http';
import * as mongoose from 'mongoose';


const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT);

server.on('error', (err) => {
    console.error(err);
});

server.on('listening', async () => {
    console.info(`Listening on a port ${PORT}`);
    mongoose.connect(process.env.MONGODB_URI || "mongodb://dbadmin:W3althH0ld1ng5!@ds253309-a0.mlab.com:53309/heroku_gl9n4dmp", {
        useNewUrlParser: true,
        useFindAndModify: false
    });
    mongoose.connection.once('open', () => {
        console.info('Connected to Mongo via Mongoose');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to Mongo via Mongoose', err);
    });
});