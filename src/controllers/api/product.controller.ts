import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { productRepository } from '@/repositories/product.repository'
import { CreateProductDTO, UpdateProductDTO } from '@/dtos/product.dto'

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

  update = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id
    const {name, description, weight } = request.body
    let product

    const dto = new UpdateProductDTO
    dto.id = id
    dto.name = name
    dto.description = description
    dto.weight = weight

    const errors = await validate(dto)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
      const product = await this.productRepository.update(dto)
      if (!product) {
        return response.status(404).send({
          error: 'Product not found'
        })
      }

      return response.status(200).send({
        data: product
      })
    } catch (error) {
      return response.status(500).send({
        error: 'Internal error'
      })
    }
  }


  delete = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    try {
      await this.productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(404).send({
        error: 'Error deleting'
      })
    }
  }

}


export default new ProductController
