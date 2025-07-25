import { Kafka } from 'kafkajs';
import { handleEvent } from '../services/fifoService.js';

const kafka = new Kafka({
  clientId: 'inventory-system',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'fifo-group' });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-events', fromBeginning: true });
  console.log('Kafka Consumer Connected');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Received Event from Kafka:', event);
      await handleEvent(event);
    },
  });
};
