"use client";
import { useEffect } from "react";
import Link from "next/link";
import { User } from "../../_repositories/User";
import styles from "./HomeScreen.module.css";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

type Props = {
	users: User[];
};

export default function HomeScreen({ users }: Props) {
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [currentUid, setCurrentUid] = useState<string | null>(null);
	const [currentName, setCurrentName] = useState<string | null>(null);
	const [currentEmail, setCurrentEmail] = useState<string | null>(null);
	// const [users, setUsers] = useState([]);
	const [userList, setUserList] = useState(users);
	const [loading, setLoading] = useState(true); // ← 追加
	//
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				router.push("/login");
			} else {
				setCurrentUid(user.uid);

				const token = await user.getIdToken();
				const res = await fetch("/api/check-user", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ uid: user.uid }),
				});

				if (res.status === 404) {
					router.push("/signup");
				} else if (res.ok) {
					const data = await res.json();
					setCurrentName(data.user.name ?? "未設定");
				}
			}
		});

		return () => unsubscribe();
	}, [router]);

	useEffect(() => {
		if (!currentUid) return;

		const fetchUsers = async () => {
			const res = await fetch(`/api/users?uid=${currentUid}`);
			if (res.ok) {
				const data = await res.json();
				setUserList(data);
			}
			setLoading(false); // ローディング完了
		};

		fetchUsers();
	}, [currentUid]);

	// ✅ ログイン判定完了するまでは描画しない
	if (loading) return null;

	const handleDeleteUser = async (id: number) => {
		if (!confirm("このユーザーを削除してもよろしいですか？")) return;

		setDeletingId(id);
		const res = await fetch(`/api/users/${id}`, {
			method: "DELETE",
		});

		if (res.ok) {
			location.reload();
		} else {
			alert("削除に失敗しました");
			setDeletingId(null);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.headerRow}>
				<h2 className={styles.title}>ユーザーリスト</h2>

				{currentUid && (
					<div className="text-sm text-gray-600">
						{/* <p>ログインUID: {currentUid}</p> */}
						<p>ユーザーネーム: {currentName}</p>
						<p>Email:{currentEmail}</p>
					</div>
				)}

				<button
					onClick={async () => {
						await signOut(auth);
						router.push("/login");
					}}
					className="bg-blue-500 text-white p-2 rounded"
				>
					ログアウト
				</button>
				<Link href="/create" className={styles.createButton}>
					＋ 新規ユーザー作成
				</Link>
			</div>

			<table className={`table-auto ${styles.userTable}`}>
				<thead>
					<tr>
						<th className={styles.userId}>ユーザーID</th>
						<th className={styles.userName}>名前</th>
						<th className={styles.userEmail}>Email</th>
						<th className={styles.userAction}>操作</th>
					</tr>
				</thead>
				<tbody>
					{userList.map((user) => (
						<tr
							key={user.id}
							onClick={() => router.push(`/edit/${user.id}`)}
							className="cursor-pointer hover:bg-gray-100 transition-colors"
						>
							<td className={styles.userId}>{user.id}</td>
							<td className={styles.userName}>{user.name}</td>
							<td className={styles.userEmail}>{user.email}</td>
							<td>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteUser(user.id);
									}}
									disabled={deletingId === user.id}
									className="bg-transparent hover:bg-red-100 text-red-500 p-2 rounded"
								>
									<Trash2 className="inline" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
