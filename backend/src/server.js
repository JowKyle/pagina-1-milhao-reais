import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import pixelsRouter from './routes/pixels.js'
import { pool } from './db.js'

dotenv.config()
const app = express()
app.use(helmet())
app.use(cors({origin:process.env.FRONTEND_URL || true}))
app.use(express.json({limit:'10mb'}))

app.use('/', pixelsRouter)
app.get('/', (req,res)=>res.send('PaginaDe1MilhaoDeReais backend'))

const port = process.env.PORT || 4000
app.listen(port, ()=>console.log('listening',port))
