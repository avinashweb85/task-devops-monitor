import { Server } from 'socket.io';
import axios from 'axios';
import http from 'http';
import { EndpointData } from './types';
import { ENDPOINTS, PORT } from './constants';

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const fetchData = async (): Promise<EndpointData[]> => {
    const results = await Promise.all(ENDPOINTS.map(async (url) => {
        try {
            const response = await axios.get(url);
            return { url, data: response.data };
        } catch (error) {
            return { url, data: null, error: (error as Error).message };
        }
    }));

    return results;
};

io.on('connection', (socket) => {
    console.log('Client connected');

    const intervalId = setInterval(async () => {
        const data = await fetchData();
        socket.emit('update', data);
    }, 10000);

    socket.on('disconnect', () => {
        clearInterval(intervalId);
        console.log('Client disconnected');
    });
});


server.listen(8080, () => {
    console.log(`Socket.IO server is running on ${PORT}`);
});
