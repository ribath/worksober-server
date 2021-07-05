/* eslint-disable no-unused-vars */
import express, { Request, Response, Application, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import MyResponse from './src/interfaces/response'
import clubHandler from './src/routes/clubHandler'

const app:Application = express()
const PORT = 8000

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://localhost/worksober', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connection successful')
}).catch((err) => {
  console.log(err)
})

app.get('/', function (req:Request, res:Response) {
  res.send('Hello world!')
})

app.use('/club', clubHandler)

// default error handler
function errorHandler (err: Error, req: Response, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  const myResponse:MyResponse = { status: 500, message: err.toString() }
  res.status(500).json(myResponse)
}

app.listen(PORT)
