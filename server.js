const express = require('express'),
      {Sequelize, DataTypes} = require('sequelize'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      path = require('path'),
      bcrypt = require('bcryptjs'), // для хэширования

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

        //+ Ответ клиенту:
        res.status(201).json({ message: "User successfully registered", user: newUser });
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
            return res.status(400).json({ message: "Email и пароль обязательны" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        // Проверка пароля
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // Устанавливаем cookie с userId
        res.cookie('userId', user.id, { httpOnly: true, maxAge: 3600000 });  // cookie на 1 час

        res.status(200).json({ message: "Авторизация успешна" });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
});


//+ Функции:
//+ Добавление пользователя:
// function () {

// }

app.listen(port, () => {
    console.log(`the server is running, the port is: ${port}`);
});