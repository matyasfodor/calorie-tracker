import { PrismaClient } from '@prisma/client'
import { DataSource } from 'apollo-datasource'

export class PrismaDataSource extends DataSource {
  public prismaClient: PrismaClient

  constructor(prismaClient: PrismaClient) {
    super()
    this.prismaClient = prismaClient
  }
}
