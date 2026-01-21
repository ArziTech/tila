import prisma from "@/lib/prisma";

/**
 * Migration script to mark existing users as verified
 * Run this after deploying the email verification feature
 * to avoid disrupting existing users
 */

async function verifyExistingUsers() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        emailVerified: null,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Successfully marked ${result.count} existing users as verified`);
  } catch (error) {
    console.error("❌ Error verifying existing users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyExistingUsers();
