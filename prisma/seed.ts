// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const users = [
    { name: "田中 太郎", email: "tanaka.taro@example.com" },
    { name: "山田 花子", email: "yamada.hanako@example.com" },
    { name: "佐藤 一郎", email: "sato.ichiro@example.com" },
    { name: "鈴木 さくら", email: "suzuki.sakura@example.com" },
    { name: "高橋 健太", email: "takahashi.kenta@example.com" },
    { name: "伊藤 美咲", email: "ito.misaki@example.com" },
    { name: "渡辺 大輔", email: "watanabe.daisuke@example.com" },
    { name: "加藤 ゆり", email: "kato.yuri@example.com" },
    { name: "木村 拓也", email: "kimura.takuya@example.com" },
    { name: "林 あや", email: "hayashi.aya@example.com" },
  ];
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Seeding completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
