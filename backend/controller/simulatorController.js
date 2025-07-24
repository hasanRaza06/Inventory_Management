import { handleEvent } from '../services/fifoService.js';

export const simulateEvent = async (req, res) => {
  try {
    const result = await handleEvent(req.body);
    return res.status(200).json({ message: 'Event Done ', result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
