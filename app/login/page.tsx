"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const token = await userCredential.user.getIdToken();
			const uid = userCredential.user.uid;
			const name = userCredential.user.displayName ?? "";

			// Prisma に送信
			await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					uid,
					email,
					name,
				}),
			});

			alert("ログイン成功！");
			router.push("/"); // ホームへ
		} catch (error: any) {
			alert("ログインエラー：" + error.message);
		}
	};

	return (
		<div>
			<h2>ログイン</h2>
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
			<button onClick={handleLogin}>ログイン</button>
		</div>
	);
}
