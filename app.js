import express from 'express';
import 'dotenv/config'
import './src/db/connectionDB.js'
import router from './src/routers/authRoutes.js';
import cors from 'cors';
const app=express();
const PORT=process.env.PORT || 5000;
app.use(cors({
    origin: ['http://localhost:3000', 'https://space-time-a4q1.vercel.app'],
    credentials: true
  }));
import { swaggerDocs } from './src/utils/swagger.js';


swaggerDocs(app); // bunu app.listen-dən əvvəl çağır

app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Hello World! ')
})

app.use('/api/auth',router)
app.listen(PORT,()=>{
    console.log(`Server is running http://localhost:${PORT}`);
    console.log(`Swagger sənədi: http://localhost:${PORT}/api-docs`);

})

