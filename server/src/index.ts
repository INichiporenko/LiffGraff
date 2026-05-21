import express, {Application} from 'express';
import 'dotenv/config';
import connectToDb from "./db";
import cors from "cors";
import http from 'http';
import {mainRouter} from "./routes/mainRouter";
import {configureCors} from "./config/cors";
import {initializeSocket} from "./socket/socket";
import cookieParser from 'cookie-parser';

const port: string | number = process.env.PORT || 3000;

(async function startServer() {

    try {
        await connectToDb();

        const app: Application = express();
        const server = http.createServer(app);
        const corsOptions = configureCors();
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        //Routes
        mainRouter(app);

        // Initialize Socket.IO
        initializeSocket(server);

        server.listen(Number(port), '0.0.0.0', () => {
            console.log('Server is running on port http://localhost:' + port);
        });

    } catch (error) {
        console.error('Error starting server: ', error);
    }
})();