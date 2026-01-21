import prisma from "@/lib/prisma";

async function seedDailyActivity() {
  const userEmail = "arzibusiness1@gmail.com";

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.error(`User with email ${userEmail} not found!`);
    return;
  }

  console.log(`Found user: ${user.username} (${user.email})`);

  // Clear existing daily activity for this user
  await prisma.dailyActivity.deleteMany({
    where: { userId: user.id },
  });

  console.log("Cleared existing daily activity data");

  // Generate data for the last 30 days
  const today = new Date();
  const activities = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Skip some days randomly to make it more realistic (streak breaks)
    const skipDay = Math.random() < 0.15; // 15% chance to skip a day

    if (skipDay) {
      console.log(`Skipping ${date.toISOString().split("T")[0]} (no activity)`);
      continue;
    }

    // Random points and items count
    // Higher chance of moderate activity, occasional high activity
    const rand = Math.random();
    let points: number;
    let itemsCount: number;

    if (rand < 0.4) {
      // Low activity day (40% chance)
      points = Math.floor(Math.random() * 50) + 10; // 10-60 points
      itemsCount = Math.floor(Math.random() * 2); // 0-1 items
    } else if (rand < 0.8) {
      // Moderate activity day (40% chance)
      points = Math.floor(Math.random() * 100) + 60; // 60-160 points
      itemsCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
    } else {
      // High activity day (20% chance)
      points = Math.floor(Math.random() * 150) + 160; // 160-310 points
      itemsCount = Math.floor(Math.random() * 4) + 3; // 3-6 items
    }

    activities.push({
      userId: user.id,
      date,
      points,
      itemsCount,
    });

    console.log(
      `${date.toISOString().split("T")[0]}: ${points} points, ${itemsCount} items`
    );
  }

  // Insert all activities
  await prisma.dailyActivity.createMany({
    data: activities,
  });

  console.log(`\n✅ Successfully seeded ${activities.length} days of activity data`);

  // Calculate and display statistics
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const totalItems = activities.reduce((sum, a) => sum + a.itemsCount, 0);
  const avgPoints = Math.round(totalPoints / activities.length);
  const avgItems = (totalItems / activities.length).toFixed(1);

  console.log(`\n📊 Statistics:`);
  console.log(`   Total Points: ${totalPoints}`);
  console.log(`   Total Items: ${totalItems}`);
  console.log(`   Avg Points/Day: ${avgPoints}`);
  console.log(`   Avg Items/Day: ${avgItems}`);
}

seedDailyActivity()
  .catch((error) => {
    console.error("Error seeding daily activity:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
