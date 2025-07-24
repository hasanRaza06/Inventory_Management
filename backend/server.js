import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.send("Hello World");
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
