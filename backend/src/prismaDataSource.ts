import { PrismaClient, User } from '@prisma/client'
import { DataSource } from 'apollo-datasource'
import DataLoader from 'dataloader'

export class PrismaDataSource extends DataSource {
  public prismaClient: PrismaClient
  public getUsers: DataLoader<number, User, number>

  constructor(prismaClient: PrismaClient) {
    super()
    this.prismaClient = prismaClient
    this.getUsers = new DataLoader<number, User, number>(keys => this.myBatchGetUsers(keys))
  }

  myBatchGetUsers = async (userIds: readonly  number[]): Promise<User[]> => {
    return await this.prismaClient.user.findMany({ where: { id: {in: userIds as number []}}})
  }
}
