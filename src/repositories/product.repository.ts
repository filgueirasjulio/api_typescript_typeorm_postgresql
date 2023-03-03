import { Product } from "@/entities/product.entity";
import { Repository } from "typeorm";
import  AppDataSource from "@/database/connection";
import  { CreateProductDTO, UpdateProductDTO } from "@/dtos/product.dto";

export class productRepository {
  private repository: Repository<Product>

  constructor() {
    this.repository = AppDataSource.getRepository(Product)
  }

  async getAll(): Promise<Product[]> {
    return await this.repository.find()
  }

  async find(id: string): Promise<Product | null> {
    return await this.repository.findOneBy( {id} )
  }

  async create(input: CreateProductDTO): Promise<Product> {

    const newProduct = new Product
    newProduct.name = input.name
    newProduct.weight = input.weight
    newProduct.description = input.description

    return await this.repository.save(newProduct)
  }


  async update(input: UpdateProductDTO): Promise<Product|null> {

    const product = await this.find(input.id)
    if (!product) {
      return null
    }
    product.name = input.name
    product.weight = input.weight
    product.description = input.description

    return await this.repository.save(product)
  }

  async delete(id: string) {
    await this.repository.delete(id)
  }
}
