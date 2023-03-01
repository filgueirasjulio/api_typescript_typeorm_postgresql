import 'module-alias/register'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
dotenv.config()

import '@/connection';
import productController from '@/controllers/api/product.controller';

const PORT = process.env.PORT || 8080

const app = express()
app.use(bodyParser.json())
app.use(cors())

//rotas
app.get('/', (request, response) => {
  response.send("server up")
})

//produtos
app.get('/api/products', productController.findAll)
app.post('/api/products', productController.create)
app.get('/api/products/:id', productController.findOne)
app.put('/api/products/:id', productController.update)
app.delete('/api/products/:id', productController.delete)

app.listen(PORT, () => {
  console.log(`server runing in port ${PORT}`)
})
