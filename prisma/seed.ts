import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function isoRecentDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

async function main() {
  console.log('🌱 Починаємо наповнення бази даних...');

  console.log('🧹 Очищення наявних даних...');
  await prisma.find.deleteMany();
  await prisma.lost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.city.deleteMany();

  console.log('🏙️ Створення міст...');
  const cityNames = [
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
    'Чернівці',
    'Ужгород',
    'Черкаси',
    'Полтава',
    'Чернігів',
    'Суми',
    'Вінниця',
    'Житомир',
    'Миколаїв',
    'Херсон',
    'Кропивницький',
  ];

  const createdCities = await Promise.all(
    cityNames.map((name) => prisma.city.create({ data: { name } })),
  );

  console.log('📂 Створення категорій...');
  const categories = [
    { name: 'Електроніка', icon: '📱' },
    { name: 'Одяг', icon: '👕' },
    { name: 'Документи', icon: '📄' },
    { name: 'Ключі', icon: '🔑' },
    { name: 'Гаманець', icon: '👛' },
    { name: 'Телефон', icon: '📞' },
    { name: 'Книги', icon: '📚' },
    { name: 'Аксесуари', icon: '🎒' },
    { name: 'Ювелірні вироби', icon: '💍' },
    { name: 'Спорт', icon: '🏀' },
    { name: 'Домашні тварини', icon: '🐶' },
    { name: 'Інше', icon: '❓' },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) => prisma.category.create({ data: cat })),
  );

  console.log('👥 Створення користувачів з відомими обліковими даними...');
  const basePassword = 'password123';
  const hashedPassword = await bcrypt.hash(basePassword, 10);

  const knownUsersData = [
    { first_name: 'Олена', last_name: 'Іваненко', email: 'olena@example.com' },
    { first_name: 'Ігор', last_name: 'Петренко', email: 'ihor@example.com' },
    { first_name: 'Марія', last_name: 'Шевченко', email: 'maria@example.com' },
    { first_name: 'Андрій', last_name: 'Коваль', email: 'andrii@example.com' },
    { first_name: 'Наталія', last_name: 'Бондаренко', email: 'nataliia@example.com' },
    { first_name: 'Сергій', last_name: 'Мельник', email: 'serhii@example.com' },
    { first_name: 'Катерина', last_name: 'Сидоренко', email: 'kateryna@example.com' },
    { first_name: 'Ростислав', last_name: 'Гриценко', email: 'rostyslav@example.com' },
    { first_name: 'Юрій', last_name: 'Ткаченко', email: 'yurii@example.com' },
    { first_name: 'Інна', last_name: 'Кравченко', email: 'inna@example.com' },
  ];

  const createdUsers = await Promise.all(
    knownUsersData.map((u) =>
      prisma.user.create({
        data: {
          email: u.email,
          password: hashedPassword,
          first_name: u.first_name,
          last_name: u.last_name,
          name: `${u.first_name} ${u.last_name}`,
          image: null,
        },
      }),
    ),
  );

  const extraNames: Array<[string, string]> = [
    ['Богдан', 'Романюк'],
    ['Оксана', 'Дорошенко'],
    ['Володимир', 'Марчук'],
    ['Ірина', 'Левченко'],
    ['Микола', 'Савченко'],
    ['Тетяна', 'Зінченко'],
    ['Артем', 'Поліщук'],
    ['Дарина', 'Гаврилюк'],
    ['Василь', 'Клименко'],
    ['Лілія', 'Данилюк'],
    ['Павло', 'Семенюк'],
    ['Ольга', 'Руденко'],
    ['Роман', 'Кравець'],
    ['Христина', 'Мельничук'],
    ['Світлана', 'Остапчук'],
    ['Євген', 'Лисенко'],
    ['Максим', 'Білик'],
    ['Юлія', 'Тимощук'],
    ['Анна', 'Федорчук'],
    ['Степан', 'Ковальчук'],
  ];

  const extraUsers = await Promise.all(
    extraNames.map(([fn, ln], idx) =>
      prisma.user.create({
        data: {
          email: `user${idx + 1}@example.com`,
          password: hashedPassword,
          first_name: fn,
          last_name: ln,
          name: `${fn} ${ln}`,
          image: null,
        },
      }),
    ),
  );

  const users = [...createdUsers, ...extraUsers];

  console.log('🔎 Підготовка статичних наборів даних для оголошень...');
  const productTitles = [
    'Смартфон iPhone 13 чорний',
    'Смартфон Samsung Galaxy S21',
    'Навушники AirPods Pro',
    'Планшет iPad Air 64GB',
    'Ноутбук Lenovo ThinkPad X1',
    'Фотоапарат Canon EOS 250D',
    'Гаманець шкіряний коричневий',
    'Портмоне чорне з блискавкою',
    'Зв’язка ключів з брелоком тризуб',
    'Документи: паспорт громадянина',
    'Посвідчення водія у чохлі',
    'Студентський квиток НУ «ЛП»',
    'Книга «Кобзар» Т. Шевченка',
    'Книга «Мистецтво війни»',
    'Рюкзак туристичний Deuter',
    'Парасолька складна синя',
    'Окуляри для читання в футлярі',
    'Ключі від авто Toyota',
    'Фітнес-браслет Xiaomi Mi Band',
    'Годинник Casio чорний',
  ];

  const descriptions = [
    'Загублено під час поїздки громадським транспортом. Дуже прошу повернути, є винагорода.',
    'Знайдено на зупинці біля торгового центру. Опишіть предмет, щоб підтвердити.',
    'Ймовірно залишено в кав’ярні. Важливі дані всередині.',
    'Є подряпина на корпусі. Має захисне скло.',
    'Усередині декілька карток та готівка. Документи на моє ім’я.',
    'Поблизу парку Шевченка. Чекаю власника.',
    'Втрата сталася близько 18:30. Можливий район — центр.',
    'У комплекті зарядний пристрій та кабель.',
    'Колір чорний, без чохла. Екран цілий.',
    'Є іменний напис на внутрішній стороні.',
  ];

  const locations = [
    'вул. Хрещатик, 22',
    'пл. Ринок, 1',
    'просп. Науки, 17',
    'вул. Дерибасівська, 5',
    'просп. Дмитра Яворницького, 64',
    'вул. Соборна, 10',
    'вул. Незалежності, 45',
    'вул. Замкова, 3',
    'вул. Грушевського, 12',
    'вул. Соборності, 8',
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35fb?q=80&w=1200&auto=format&fit=crop', // phone
    'https://images.unsplash.com/photo-1518447433716-1f48a82a1e7a?q=80&w=1200&auto=format&fit=crop', // headphones
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop', // laptop
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f3b?q=80&w=1200&auto=format&fit=crop', // wallet
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop', // keys
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1200&auto=format&fit=crop', // book
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', // backpack
    'https://images.unsplash.com/photo-1518544801976-3e8a04f2eb35?q=80&w=1200&auto=format&fit=crop', // umbrella
    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1200&auto=format&fit=crop', // glasses
    'https://images.unsplash.com/photo-1514894780887-121968d00567?q=80&w=1200&auto=format&fit=crop', // watch
  ];

  const timeOffsets = [1, 2, 3, 5, 7, 10, 14, 18, 21, 25];

  console.log('📦 Створення великої кількості оголошень (втрати/знахідки)...');
  const targetLost = 120;
  const targetFind = 120;

  const pick = <T>(arr: T[], i: number) => arr[i % arr.length];

  const lostItems = await Promise.all(
    range(targetLost).map((i) => {
      const user = users[i % users.length];
      const city = createdCities[i % createdCities.length];
      const category = createdCategories[i % createdCategories.length];
      return prisma.lost.create({
        data: {
          title: `${pick(productTitles, i)} — втрачено`,
          description: pick(descriptions, i + 3),
          photo: pick(imageUrls, i + 1),
          time: isoRecentDaysAgo(pick(timeOffsets, i)),
          location: pick(locations, i),
          user_id: user.id,
          city_id: city.id,
          category_id: category.id,
        },
      });
    }),
  );

  const foundItems = await Promise.all(
    range(targetFind).map((i) => {
      const user = users[(i + 3) % users.length];
      const city = createdCities[(i + 5) % createdCities.length];
      const category = createdCategories[(i + 7) % createdCategories.length];
      return prisma.find.create({
        data: {
          title: `${pick(productTitles, i)} — знайдено`,
          description: pick(descriptions, i + 1),
          photo: pick(imageUrls, i + 2),
          time: isoRecentDaysAgo(pick(timeOffsets, i + 1)),
          location: pick(locations, i + 2),
          user_id: user.id,
          city_id: city.id,
          category_id: category.id,
        },
      });
    }),
  );

  console.log('🎉 Наповнення завершено!');
  console.log(`Міста: ${createdCities.length}`);
  console.log(`Категорії: ${createdCategories.length}`);
  console.log(`Користувачі: ${users.length}`);
  console.log(`Втрати: ${lostItems.length}`);
  console.log(`Знахідки: ${foundItems.length}`);
  console.log('Облікові дані (для входу через email/пароль):');
  console.table(knownUsersData.map((u) => ({ Email: u.email, Password: basePassword })));
}

main()
  .catch((e) => {
    console.error('❌ Помилка під час наповнення:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
