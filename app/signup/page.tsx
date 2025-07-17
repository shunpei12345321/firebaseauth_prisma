// app/signup/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSignup = async () => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const token = await userCredential.user.getIdToken();
			const uid = userCredential.user.uid;

			// サーバーに送信（uidも一緒に）
			await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					uid,
					email,
					name: userCredential.user.displayName ?? "", // 任意
				}),
			});

			alert("登録成功！");
			router.push("/home");
		} catch (error: any) {
			alert("エラー：" + error.message);
		}
	};

	return (
		<div>
			<h2>サインアップ</h2>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="メールアドレス"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="パスワード"
			/>
			<button onClick={handleSignup}>登録</button>
		</div>
	);
}

//7.17
// "use client";
// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/firebase";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const router = useRouter();

// 	const handleSignup = async () => {
// 		try {
// 			const userCredential = await createUserWithEmailAndPassword(
// 				auth,
// 				email,
// 				password
// 			);
// 			const token = await userCredential.user.getIdToken();

// 			// Prisma に送信
// 			await fetch("/api/auth", {
// 				method: "POST",
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 				},
// 			});

// 			alert("登録成功！");
// 			router.push("/"); // ホームへ遷移
// 		} catch (error: any) {
// 			alert("エラー：" + error.message);
// 		}
// 	};

// 	return (
// 		<div>
// 			<h2>サインアップ</h2>
// 			<input
// 				type="email"
// 				value={email}
// 				onChange={(e) => setEmail(e.target.value)}
// 				placeholder="メールアドレス"
// 			/>
// 			<input
// 				type="password"
// 				value={password}
// 				onChange={(e) => setPassword(e.target.value)}
// 				placeholder="パスワード"
// 			/>
// 			<button onClick={handleSignup}>登録</button>
// 		</div>
// 	);
// }
