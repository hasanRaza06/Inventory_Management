import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import { startConsumer } from './kafka/consumer.js';
import { startProducer } from './kafka/producer.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

startConsumer();
startProducer();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.get("/",(req,res)=>{
  res.send("Hello World");
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
