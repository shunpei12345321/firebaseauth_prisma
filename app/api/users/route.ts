export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/app/_repositories/User";

export async function GET() {
	const users = await UserRepository.findMany();
	return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
	try {
		const { name, email } = await req.json();

		if (!name || !email) {
			return NextResponse.json(
				{ error: "名前とメールが必要です" },
				{ status: 400 }
			);
		}

		const user = await UserRepository.create({ name, email });
		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error("POST /api/users error:", error);
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 }
		);
	}
}

// export const dynamic = "force-dynamic";
// // app/api/users/route.ts
// import { NextRequest, NextResponse } from "next/server";
// // import prisma from "../../lib/prisma"; // こちらもエイリアス or 相対パスに注意
// import { UserRepository } from "@/app/_repositories/User";

// export async function GET(req: NextRequest, context: any) {
//   const id = Number(context.params.id);
//   const user = await UserRepository.findUnique(id);

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json(user);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { name, email } = await req.json();

//     if (!name || !email) {
//       return NextResponse.json(
//         { error: "名前とメールが必要です" },
//         { status: 400 }
//       );
//     }

//     const user = await UserRepository.create({ name, email });
//     return NextResponse.json(user, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/users error:", error);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// }
