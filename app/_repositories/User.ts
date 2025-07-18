// app/_repositories/User.ts
import { prisma } from "../_utils/prismaSingleton";
import { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;

export const UserRepository = {
	create: async (params: {
		name: string;
		email: string;
		uid: string;
	}): Promise<User> => {
		const { name, email, uid } = params;
		return await prisma.user.create({
			data: { name, email, uid },
		});
	},

	findManyByUid: async (uid: string): Promise<User[]> => {
		return await prisma.user.findMany({
			where: { uid },
			orderBy: { createdAt: "desc" },
		});
	},

	findMany: async (): Promise<User[]> => {
		return await prisma.user.findMany({
			orderBy: { id: "desc" },
		});
	},

	update: async (
		id: number,
		data: { name: string; email: string }
	): Promise<User> => {
		return await prisma.user.update({
			where: { id },
			data,
		});
	},

	deleteById: async (id: number): Promise<User> => {
		return await prisma.user.delete({
			where: { id },
		});
	},
};

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
	uid: string;
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
