import { Product } from "@/entities/product.entity";
import { Repository } from "typeorm";
import  AppDataSource from "@/database/connection";
import CreateProductDTO from "@/dtos/products/create.dto";

export class productRepository {
  private repository: Repository<Product>

  constructor() {
    this.repository = AppDataSource.getRepository(Product)
  }

  async getAll(): Promise<Product[]> {
    return await this.repository.find()
  }

  async create(input: CreateProductDTO): Promise<Product> {

    const newProduct = new Product
    newProduct.name = input.name
    newProduct.weight = input.weight
    newProduct.description = input.description

    return await this.repository.save(newProduct)
  }

  async find(id: string): Promise<Product | null> {
    return await this.repository.findOneBy( {id} )
  }
}
