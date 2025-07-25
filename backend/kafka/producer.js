import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-system',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

export const startProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer Connected');
};

export const produceEvent = async (eventData) => {
  console.log('Sending event to Kafka:', eventData);
  await producer.send({
    topic: 'inventory-events',
    messages: [
      { value: JSON.stringify(eventData) }
    ]
  });
};
