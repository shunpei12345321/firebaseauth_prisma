// app/_repositories/User.ts
import { prisma } from "../_utils/prismaSingleton";
import { User as PrismaUser } from "@prisma/client";

// eslintnosettei fairu wo kaeru ka
//or file change
// eslintnosettei fairu wo kaeru ka
//or file change
//viだと日本語が打てる
//ESlint拡張させるか.eslint設定ファイルをchangeしてするかです。

export type User = PrismaUser;

export namespace UserRepository {
  export async function findMany(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  export async function findUnique(userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  export async function create(params: {
    name: string;
    email: string;
  }): Promise<User> {
    const { name, email } = params;
    return await prisma.user.create({
      data: { name, email },
    });
  }

  export async function update(
    id: number,
    data: { name: string; email: string }
  ): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  export async function deleteById(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
