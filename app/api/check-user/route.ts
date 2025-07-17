// app/api/check-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
		const token = req.headers.get("authorization")?.split(" ")[1];
		if (!token) {
			return NextResponse.json({ error: "No token" }, { status: 401 });
		}

		const body = await req.json(); // ✅ 修正ポイント
		const { uid } = body;

		if (!uid) {
			return NextResponse.json({ error: "Missing uid" }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { uid } });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ user });
	} catch (e) {
		console.error("check-user error:", e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
