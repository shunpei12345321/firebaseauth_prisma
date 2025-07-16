import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	const token = req.headers.get("authorization")?.split(" ")[1];

	if (!token) {
		return NextResponse.json({ error: "No token" }, { status: 401 });
	}

	try {
		console.log("📨 Received token:", token);
		const decoded = await admin.auth().verifyIdToken(token);
		console.log("✅ Decoded token:", decoded);
		const { email, name } = decoded;

		if (!email) {
			console.warn("⚠️ Tokenにはemailが含まれていません");
			return NextResponse.json({ error: "No email in token" }, { status: 400 });
		}

		const user = await prisma.user.upsert({
			where: { email },
			update: { name },
			create: { email, name },
		});

		console.log("👤 User upserted:", user);
		return NextResponse.json({ user });
	} catch (e) {
		console.error("❌ Error verifying token or upserting user:", e);
		return NextResponse.json({ error: "Token error" }, { status: 403 });
	}
}
