import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { Repository } from 'typeorm'
import AppDataSource from '@/connection'
import { Product } from '@/entities/product.entity'

class ProductController {

  async findAll(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)
    const products = await productRepository.find()

    return response.status(200).send({
      data: products
    })
  }

  async findOne(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id
    const productRepository = AppDataSource.getRepository(Product)

    try {
      const product = await productRepository.findOneByOrFail({ id })

      return response.status(200).send({
        data: product
      })
    } catch (error) {
      return response.status(404).send({
        error: 'Product not found'
      })
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, description, weight } = request.body

    const newProduct = new Product
    newProduct.name = name
    newProduct.weight = weight
    newProduct.description = description

    const errors = await validate(newProduct)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }


    const productRepository = AppDataSource.getRepository(Product)
    const product = await productRepository.save(newProduct)

    return response.status(201).send({
      data: product
    })
  }

  async update(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id
    const { name, description, weight } = request.body
    const productRepository = AppDataSource.getRepository(Product)
    let product

    try {
      product = await productRepository.findOneByOrFail({ id })
    } catch (error) {
      return response.status(404).send({
        error: 'Product not found'
      })
    }

    product.name = name
    product.weight = weight
    product.description = description

    const errors = await validate(product)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
      const productDb = await productRepository.save(product)

      return response.status(200).send({
        data: productDb
      })
    } catch (error) {
      return response.status(500).send({
        error: 'Internal error'
      })
    }
  }


  async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id
    const productRepository = AppDataSource.getRepository(Product)

    try {
      await productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(404).send({
        error: 'Error deleting'
      })
    }
  }

}


export default new ProductController
