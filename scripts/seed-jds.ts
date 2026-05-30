import { prisma } from "../src/config/prisma";
import { sampleJds, isSeedTitle } from "./sample-data";

async function main() {
  console.log("Removing existing seed JDs…");
  const removed = await prisma.jobDescription.deleteMany({
    where: { title: { startsWith: "[Seed] " } },
  });
  console.log(`  ✓ removed ${removed.count}`);

  console.log("\nInserting sample JDs…");
  for (const jd of sampleJds) {
    if (!isSeedTitle(jd.title)) continue;
    const created = await prisma.jobDescription.create({
      data: { ...jd, source: "MANUAL" },
      select: { id: true, title: true },
    });
    console.log(`  ✓ ${created.title}  (id: ${created.id})`);
  }

  console.log("\nDone. Open the JDs page in the UI to see them.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
