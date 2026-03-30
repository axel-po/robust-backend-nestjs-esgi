import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// Load env variables (if node > 20, --env-file can be used, else dotenv)
// We assume DATABASE_URL is somehow loaded or we can just require it
const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is not defined in the environment variables.');
  process.exit(1);
}

const client = postgres(url);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // Hash a default password for generated users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  console.log('Inserting Users...');
  const newUsers = await db
    .insert(schema.users)
    .values([
      {
        id: crypto.randomUUID(),
        email: 'mentor1@mentor-esgi.fr',
        name: 'Alice Dubois',
        passwordHash,
        role: 'MENTOR',
        avatarUrl: 'https://i.pravatar.cc/150?u=mentor1',
      },
      {
        id: crypto.randomUUID(),
        email: 'mentor2@mentor-esgi.fr',
        name: 'Bob Martin',
        passwordHash,
        role: 'MENTOR',
        avatarUrl: 'https://i.pravatar.cc/150?u=mentor2',
      },
      {
        id: crypto.randomUUID(),
        email: 'mentee1@mentor-esgi.fr',
        name: 'Charlie Petit',
        passwordHash,
        role: 'MENTEE',
        avatarUrl: 'https://i.pravatar.cc/150?u=mentee1',
      },
    ])
    .returning();

  const mentor1 = newUsers[0];
  const mentor2 = newUsers[1];
  const mentee1 = newUsers[2];

  // 2. Create Mentor Profiles
  console.log('Inserting Mentor Profiles...');
  await db.insert(schema.mentorProfiles).values([
    {
      id: crypto.randomUUID(),
      userId: mentor1.id,
      bio: 'Développeuse Senior spécialisée en React et Node.js.',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      hourlyRate: 50,
      isAvailable: true,
    },
    {
      id: crypto.randomUUID(),
      userId: mentor2.id,
      bio: "Expert en architecture cloud et DevOps. Plus de 10 ans d'expérience.",
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      hourlyRate: 75,
      isAvailable: true,
    },
  ]);

  // 3. Create Mentorship Request (Optional)
  console.log('Inserting Mentorship Requests...');
  await db.insert(schema.mentorshipRequests).values([
    {
      id: crypto.randomUUID(),
      mentorId: mentor1.id,
      menteeId: mentee1.id,
      message:
        'Bonjour Alice, je souhaiterais être mentoré par toi sur React !',
      status: 'PENDING',
    },
  ]);

  console.log('Database seeding completed successfully ✅');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
