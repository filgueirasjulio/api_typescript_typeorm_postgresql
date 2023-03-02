import { Product } from "@/entities/product.entity";
import { Repository } from "typeorm";
import AppDataSource from "@/database/connection";

export class productRepository {
  private repository: Repository<Product>

  constructor() {
    this.repository = AppDataSource.getRepository(Product)
  }

  async getAll(): Promise<Product[]> {
    return await this.repository.find()
  }
}
