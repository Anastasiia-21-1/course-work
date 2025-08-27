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
  const productInfo = [
    {
      name: 'Ноутбук Lenovo ThinkPad X1',
      img: 'https://content2.rozetka.com.ua/goods/images/big/423031985.jpg',
    },
    {
      name: 'Фотоапарат Canon EOS 250D',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Canon_EOS_Kiss_X10_11_May_2019a.jpg/1200px-Canon_EOS_Kiss_X10_11_May_2019a.jpg',
    },
    {
      name: 'Гаманець шкіряний коричневий',
      img: 'https://modnotak.com.ua/wa-data/public/shop/products/88/73/7388/images/61185/61185.970.jpg',
    },
    {
      name: 'Портмоне чорне з блискавкою',
      img: 'https://bolinni.in.ua/image/cache/catalog/data/product2/muzhskoj-koshelek-klatch-na-dva-otdelenija_1-404x404.jpg',
    },
    {
      name: 'Зв’язка ключів з брелоком тризуб',
      img: 'https://ireland.apollo.olxcdn.com/v1/files/ojgzovpqsl0x-UA/image;s=3000x3000',
    },
    {
      name: 'Паспорт',
      img: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Ukrainian_passport_2017.jpg',
    },
    {
      name: 'Посвідчення водія у чохлі',
      img: 'https://images.prom.ua/4761746635_w640_h320_chehol-na-prava.jpg',
    },
    {
      name: 'Студентський квиток НУ «ЛП»',
      img: 'https://volynonline.com/wp-content/uploads/2019/05/60250941_2490477811179699_7333135077091573760_n-1.jpg',
    },
    {
      name: 'Книга «Кобзар» Т. Шевченка',
      img: 'https://book24.ua/upload/iblock/009/0092cac0d691d62a0b5409bfc58b6a56.png',
    },
    {
      name: 'Рюкзак туристичний Deuter',
      img: 'https://tramp.in.ua/content/images/13/536x536l50nn0/19868958150000.jpg',
    },
    {
      name: 'Парасолька складна синя',
      img: 'https://content.rozetka.com.ua/goods/images/big/313258345.jpg',
    },

    {
      name: 'Годинник Casio чорний',
      img: 'https://images.prom.ua/3675946033_w600_h600_3675946033.jpg',
    },
    {
      name: 'Xiaomi 14T Pro',
      img: 'https://i02.appmifile.com/675_operatorx_operatorx_opx/26/09/2024/f81bba823d0ac2abe8c07ce09e2eb11f.png',
    },
    {
      name: 'Ключ Honda Accord',
      img: 'https://images.prom.ua/1407031_w640_h640_klyuch-honda-accord.jpg',
    },
    {
      name: 'Ключі BMW E39',
      img: 'https://bumer.com.ua/wp-content/uploads/2017/03/vykidnoj-klyuch-bmv-e39.jpg',
    },
    {
      name: 'Ключ Lada',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoOB3nsOHCSresGRle6CFJdKAJDTr9ez_WaA&s',
    },
    {
      name: 'Паспорт',
      img: 'https://images.ctfassets.net/496uch1l97fc/4YK7cOqkhzgaB2bJiYAsdQ/d4d2904a3d8650a6e425b1388d2fb636/pexels-borys-zaitsev-8061986.jpg?fm=webp',
    },
    {
      name: 'Окуляри для читання в футлярі',
      img: 'https://kupit-ochki.com.ua/image/cache/catalog/Vizzini/metall/okulyary-dlya-zoru-vizzini-03-008-K01-box-800x550.jpg',
    },
    {
      name: 'Фітнес-браслет Xiaomi Mi Band',
      img: 'https://kvshop.com.ua/users/products/423/423716/big/vcdbu23ou5tc2key4pa8zcesuo94jsji.webp',
    },
    {
      name: 'Паспорт',
      img: 'https://visitukraine.today/media/blog/previews/k1YzFCNIZr8LRfqk20JNbSWLfTqWbPMJDqscc2l7.webp',
    },
    {
      name: 'Рюкзак',
      img: 'https://static.prego.ua/photo?n=4bf61180-068c-4c3d-b736-79b8868a162a.jpg&s=1000&q=80',
    },
    {
      name: 'Рюкзак',
      img: 'https://images.prom.ua/5211403233_w600_h600_5211403233.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://bagsetc.ua/image/cache/catalog/data/788984/2D_788984-01-2000x2000.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://ronto.com.ua/image/cache/catalog/products/hlno04250/hln004_250_01_2-700x500.jpg',
    },
    {
      name: 'Паспорт',
      img: 'https://nikvesti.com/images/imageeditor/2025/2/14/301385/301385_67af754b01ad49_39914892_1500.webp',
    },
    {
      name: 'Ключі від авто Toyota',
      img: 'https://dublikator.com/wp-content/uploads/2017/10/Toyota-Innova-Smart-Key-1-418x315.jpg.pagespeed.ce.JI6eP9JoiD.jpg',
    },
    {
      name: 'Паспорт',
      img: 'https://vgorode.ua/img/article/12096/50_main-v1655193419.jpg',
    },
    {
      name: 'Паспорт',
      img: 'https://novyny.pro/i/image_1200x630/media/image/660/c14/a5c/660c14a5c7483.jpg',
    },
    {
      name: 'Паспорт',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpTmBFinETMTOPOfLVlGjS76KeD0B4hVfa1jifa4ODuDjdThkqW4npnHbK0Tp5HFfh3WY&usqp=CAU',
    },
    {
      name: 'Смартфон iPhone 13 чорний',
      img: 'https://img.jabko.ua/image/cache/catalog/products/2024/08/051004/15-black-1-(1)-(1)-1204x1204.jpg.webp',
    },
    {
      name: 'Смартфон Samsung Galaxy S21',
      img: 'https://i.guim.co.uk/img/media/460229e455cd38808a11b1d0ebe866fcfd5f06ae/373_437_4638_2783/master/4638.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=a738f3c6316aaa69b8ffffbd56933c78',
    },
    {
      name: 'Паспорт',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT42UVkIVZQRV5Y70v1k-OYkYuGAR8HdNZnTQ&s',
    },
    {
      name: 'Паспорт',
      img: 'https://uspih.in.ua/wp-content/uploads/2024/05/pasport-1800x900.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://content1.rozetka.com.ua/goods/images/big/555205354.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://cdn.27.ua/sc--media--prod/default/32/63/e2/3263e23e-a16d-4507-bff4-07dc23e6bb2b.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxbYshm0wpOWl236andM0Hvkv1CcsOkI8ZQg&s',
    },
    {
      name: 'Навушники AirPods Pro',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWyUqJyxVasqMmKAghLRK8zYrEl2rUlb0_1Kd9VN24ZbfKqPPfDiVt2X6a5MqZfI2fzzw&usqp=CAU',
    },
    {
      name: 'Планшет iPad Air 64GB',
      img: 'https://img.jabko.ua/image/cache/catalog/products/2022/03/082300/ipad-air-select-wifi-spacegray-2-1397x1397.jpg.webp',
    },
    {
      name: 'Рюкзак',
      img: 'https://militarist.ua/upload/resize_cache/iblock/653/1000_1000_2/653eeae8fa49b0c3978e7578bdad2f01.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://content2.rozetka.com.ua/goods/images/big/561804574.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://axes.com.ua/image/cache/data/products/13-ryukzak-zhen/2019-04/002-01-1000x1000.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://ronto.com.ua/image/cache/catalog/products/hlno04165/hlno04_165_01_2-700x500.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://images.avrora.ua/images/detailed/48/44366_9865.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://travelite.in.ua/36004-thickbox_default/ryukzak-dlya-noutbuka-travelite-basics-anthracite-tl096508-05.jpg',
    },
    {
      name: 'Рюкзак',
      img: 'https://newbalance.ua/img/photos/f0132b23eb0305992da7a9144d91e7c4.jpg',
    },
  ];

  const descriptions = [
    'Дуже рідкісне',
    'Виглядає звично, проте може бути важливим для власника.',
    'Без видимих ушкоджень, функціональний стан невідомий.',
    'Має охайний вигляд, використовувався обережно.',
    'Може використовуватись щодня, нічого надзвичайного.',
    'Стан об’єкта не викликає занепокоєння.',
    'Є особливі деталі, помітні при уважному огляді.',
    'Не має явних позначок, що вказують на власника.',
    'Зовні виглядає стандартно, нічим не відрізняється.',
    'Предмет побутового призначення, акуратного вигляду.',
    'Зберігає презентабельний вигляд, без очевидних дефектів.',
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

  const timeOffsets = [1, 2, 3, 5, 7, 10, 14, 18, 21, 25];

  console.log('📦 Створення великої кількості оголошень (втрати/знахідки)...');
  const targetLost = 120;
  const targetFind = 120;

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const lostItems = await Promise.all(
    range(targetLost).map((i) => {
      const user = users[i % users.length];
      const city = createdCities[i % createdCities.length];
      const category = createdCategories[i % createdCategories.length];
      const { name, img } = pick(productInfo);
      return prisma.lost.create({
        data: {
          title: name,
          description: pick(descriptions),
          photo: img,
          time: isoRecentDaysAgo(pick(timeOffsets)),
          location: pick(locations),
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
      const { name, img } = pick(productInfo);
      return prisma.find.create({
        data: {
          title: name,
          description: pick(descriptions),
          photo: img,
          time: isoRecentDaysAgo(pick(timeOffsets)),
          location: pick(locations),
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
