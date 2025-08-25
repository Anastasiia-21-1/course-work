import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  console.log('🧹 Clearing existing data...');
  await prisma.find.deleteMany();
  await prisma.lost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.city.deleteMany();

  console.log('🏙️ Creating cities...');
  const cities = [
    'Київ',
    'Львів',
    'Харків',
    'Одеса',
    'Дніпро',
    'Запоріжжя',
    'Івано-Франківськ',
    'Тернопіль',
    'Рівне',
    'Луцьк',
  ];

  const createdCities = await Promise.all(
    cities.map((name) =>
      prisma.city.create({
        data: { name },
      }),
    ),
  );

  console.log('📂 Creating categories...');
  const categories = [
    { name: 'Електроніка', icon: '📱' },
    { name: 'Одяг', icon: '👕' },
    { name: 'Документи', icon: '📄' },
    { name: 'Ключі', icon: '🔑' },
    { name: 'Гаманець', icon: '👛' },
    { name: 'Телефон', icon: '📞' },
    { name: 'Книги', icon: '📚' },
    { name: 'Інше', icon: '❓' },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.create({
        data: cat,
      }),
    ),
  );

  console.log('👥 Creating users...');
  const users = [];
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        image: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  console.log('🔍 Creating lost items...');
  const lostItems = [];
  for (let i = 0; i < 50; i++) {
    const lost = await prisma.lost.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        photo: faker.image.url(),
        time: faker.date.recent({ days: 30 }).toISOString(),
        location: faker.location.streetAddress(),
        user_id: faker.helpers.arrayElement(users).id,
        city_id: faker.helpers.arrayElement(createdCities).id,
        category_id: faker.helpers.arrayElement(createdCategories).id,
      },
    });
    lostItems.push(lost);
  }

  console.log('✅ Creating found items...');
  const foundItems = [];
  for (let i = 0; i < 40; i++) {
    const found = await prisma.find.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        photo: faker.image.url(),
        time: faker.date.recent({ days: 30 }).toISOString(),
        location: faker.location.streetAddress(),
        user_id: faker.helpers.arrayElement(users).id,
        city_id: faker.helpers.arrayElement(createdCities).id,
        category_id: faker.helpers.arrayElement(createdCategories).id,
      },
    });
    foundItems.push(found);
  }

  console.log('🎉 Database seeding completed!');
  console.log(`Created ${createdCities.length} cities`);
  console.log(`Created ${createdCategories.length} categories`);
  console.log(`Created ${users.length} users`);
  console.log(`Created ${lostItems.length} lost items`);
  console.log(`Created ${foundItems.length} found items`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
