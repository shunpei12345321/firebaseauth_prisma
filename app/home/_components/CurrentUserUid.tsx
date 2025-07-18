"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CurrentUserUid() {
	const [uid, setUid] = useState<string | null>(null);
	const [currentEmail, setCurrentEmail] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUid(user.uid); // UIDを保存
				setCurrentEmail(user.email);
			} else {
				setUid(null);
			}
		});
		return () => unsubscribe();
	}, []);

	if (!uid) {
		return <p>ログインしていません。</p>;
	}

	return (
		<div className="p-4 bg-gray-100 rounded shadow">
			<p>
				現在のユーザー : <span className="font-mono">{uid}</span>
				{currentEmail && <p>Email: {currentEmail}</p>}
			</p>
		</div>
	);
}
