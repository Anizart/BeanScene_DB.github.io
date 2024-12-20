const express = require('express'),
      {Sequelize, DataTypes} = require('sequelize'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      path = require('path'),
      bcrypt = require('bcryptjs'), // для хэширования
      cookieParser = require('cookie-parser');

     app = express(),
     port = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'public/dataBase.sqlite' // сохраняю в папку public для последующего просмотра
});

//+ Middleware для разрешения запросов с клиента:
app.use(cors());

app.use(express.static('public'));

//+ Добавляю парсер JSON-тела запроса:
app.use(express.json());

//+ Модель таблицы подписок:
const Subscribe = sequelize.define('subscribe', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

//+ Модель таблицы пользователей:
const User = sequelize.define('registration', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// + Модель таблицы продуктов:
const Product = sequelize.define('product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// + Модель таблицы заказов:
const Order = sequelize.define('order', {
    id_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// + Модель таблицы корзины:
const Basket = sequelize.define('basket', {
    id_order: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_product: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

sequelize.sync(); //+ Синхранизация бд...

//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json());
app.use(cookieParser());

//+ Registration:
app.post('/regist', async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //+ Проверка на существование пользователя:
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        //+ Хеширование пароля
        const salt = await bcrypt.genSalt(10); // Генерация соли
        const hashedPassword = await bcrypt.hash(password, salt); // Хеширование пароля

        //+ Создание пользователя с захешированным паролем:
        const newUser = await User.create({
            name,
            email,
            address,
            password: hashedPassword // Сохраняю хешированный пароль
        });

        newUser.save(); //! вот добавил

        console.log("User created:", newUser.toJSON());

        //+ Сохранение userId в cookie на 18 дней:
        res.cookie('userId', newUser.id, {
            httpOnly: true, // Кука доступна только для сервера
            maxAge: 18 * 24 * 60 * 60 * 1000 // 18 дней в миллисекундах
        });

        //+ Ответ клиенту:
        res.status(201).json({ message: "The user has been successfully registered", user: newUser });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//+ Authorization:
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "The user was not found ㄟ( ▔, ▔ )ㄏ" });
        }

        //+ Проверка пароля:
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //+ Устанавливаем cookie с userId на 18 дней;
        res.cookie('userId', user.id, {
            httpOnly: true, // Кука доступна только для сервера
            maxAge: 18 * 24 * 60 * 60 * 1000 // 18 дней в миллисекундах
        });

        res.status(200).json({ message: "Authorization is successful（￣︶￣）↗" });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Internal server error (＃°Д°)" });
    }
});

//+ Ссылка офиса (прверка):
//+ Маршрут для проверки авторизации:
app.get('/check-auth', (req, res) => {
    const userId = req.cookies.userId;

    if (userId) {
        return res.json({isAuthenticated: true});
    } else {
        return res.json({isAuthenticated: false});
    }
});

//+ Эндпоинт для получения данных пользователя:
app.get('/user-profile', async (req, res) => {
    try {
        const userId = req.cookies.userId;

        //+ Проверка наличия userId:
        if (!userId) {
            return res.status(401).json({message: 'Not authorized'});
        }

        //+ Получение пользователя из БД:
        const user = await User.findByPk(userId);

        //+ Проверка существования пользователя:
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //+ Возврат данных пользователя:
        res.status(200).json({
            name: user.name,
            email: user.email,
            address: user.address
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//+ Эндпоинт для обновления профиля пользователя:
app.put('/update-profile', async (req, res) => {
    try {
        const userId = req.cookies.userId;

        // Проверка наличия userId:
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, address, password } = req.body;

        // Проверка обязательных полей:
        if (!name || !address || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Поиск пользователя:
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Хэширование нового пароля:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Обновление данных пользователя:
        user.name = name;
        user.address = address;
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//+ Эндпоинт для выхода (Logout):
app.post('/logout', (req, res) => {
    res.clearCookie('userId'); // Удаляю куку с userId
    res.status(200).json({ message: 'Logout successful' });
});

//+ Функции:
//+ Добавление пользователя:
// function () {

// }

app.listen(port, () => {
    console.log(`the server is running, the port is: ${port}`);
});