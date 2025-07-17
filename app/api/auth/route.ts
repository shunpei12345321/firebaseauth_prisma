// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	const token = req.headers.get("authorization")?.split(" ")[1];
	if (!token) {
		return NextResponse.json({ error: "No token" }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { uid, email, name } = body;

		if (!uid || !email) {
			return NextResponse.json(
				{ error: "Missing uid or email" },
				{ status: 400 }
			);
		}

		// UIDまたはメールアドレスで upsert
		const user = await prisma.user.upsert({
			where: { email }, // または uid でユニークにしても良い
			update: { uid, name },
			create: { email, uid, name },
		});

		return NextResponse.json({ user });
	} catch (e) {
		console.error("❌ Error:", e);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

// 7.17↓
// import { NextRequest, NextResponse } from "next/server";
// import { admin } from "@/firebaseAdmin";
// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
// 	prisma: PrismaClient | undefined;
// };

// const prisma =
// 	globalForPrisma.prisma ??
// 	new PrismaClient({
// 		log: ["query", "error", "warn"],
// 	});

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export async function POST(req: NextRequest) {
// 	const token = req.headers.get("authorization")?.split(" ")[1];
// 	if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

// 	try {
// 		const decoded = await admin.auth().verifyIdToken(token);
// 		const email = decoded.email;

// 		const user = await prisma.user.findUnique({
// 			where: { email },
// 		});

// 		if (!user) {
// 			return NextResponse.json({ exists: false }, { status: 404 });
// 		}

// 		return NextResponse.json({ exists: true });
// 	} catch (error: any) {
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }

// 7.17↑

// export async function POST(req: NextRequest) {
// 	const token = req.headers.get("authorization")?.split(" ")[1];

// 	if (!token) {
// 		return NextResponse.json({ error: "No token" }, { status: 401 });
// 	}

// 	try {
// 		console.log("📨 Received token:", token);
// 		const decoded = await admin.auth().verifyIdToken(token);
// 		console.log("✅ Decoded token:", decoded);

// 		const { email, name } = decoded;

// 		if (!email) {
// 			return NextResponse.json({ error: "No email in token" }, { status: 400 });
// 		}

// 		const user = await prisma.user.upsert({
// 			where: { email },
// 			update: { name },
// 			create: { email, name },
// 		});

// 		console.log("👤 User upserted:", user);
// 		return NextResponse.json({ user });
// 	} catch (e) {
// 		console.error("❌ Token or Prisma error:", e);
// 		return NextResponse.json({ error: (e as Error).message }, { status: 500 });
// 	}
// }
