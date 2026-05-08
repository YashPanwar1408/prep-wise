import { currentUser } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

export async function ensureDatabaseUser(userId: string) {
  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    `${userId}@clerk.local`;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
    clerkUser?.username ||
    null;

  return prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      name,
    },
    create: {
      id: userId,
      email,
      name,
    },
  });
}
