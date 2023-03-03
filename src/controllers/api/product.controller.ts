import { validate } from 'class-validator'
import { Request, Response } from 'express'
import AppDataSource from '@/database/connection'
import { Product } from '@/entities/product.entity'
import { productRepository } from '@/repositories/product.repository'
import CreateProductDTO from '@/dtos/products/create.dto'

class ProductController {
  private productRepository: productRepository

  constructor() {
    this.productRepository = new productRepository
  }

  findAll = async (request: Request, response: Response): Promise<Response> => {
    const products = await this.productRepository.getAll()

    return response.status(200).send({
      data: products
    })
  }

  findOne = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    const product = await this.productRepository.find(id)

    if (!product) {
      return response.status(404).send({
        error: 'Product not found'
      })
    }

    return response.status(200).send({
      data: product
    })
  }

  create = async (request: Request, response: Response): Promise<Response> => {
    const { name, description, weight } = request.body
    const dto = new CreateProductDTO

    dto.name = name
    dto.description = description
    dto.weight = weight

    const errors = await validate(dto)
    if (errors.length > 0) {
      return response.status(422).send({
        error: errors
      })
    }

    const newProduct = await this.productRepository.create(dto)

    return response.status(201).send({
      data: newProduct
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
