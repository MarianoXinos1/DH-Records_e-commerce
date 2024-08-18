require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const dbConfig = require('./models/db/config/database'); 
const mysql = require('mysql2');

// Config del puerto
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// express.static es un middleware que sirve para configurar la ruta de los archivos estáticos.
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));   

// Template Engine (configura Express para usar EJS como motor de plantillas)
app.set("view engine","ejs");
app.set('views', path.join(__dirname,"/views"));

// Config de session
const session = require('express-session');
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Asegúrate de que 'secure' esté en 'false' si no estás usando HTTPS
}));

// Config de cookies
const cookies = require('cookie-parser');
app.use(cookies());

// Config estado de Log del usuario 
const userLoggedMid = require('./middlewares/userLoggedMid');
app.use(userLoggedMid);

// Config para capturar la info del formulario con POST en req.body
app.use(express.urlencoded({ extended: false }));   
app.use(express.json());

// Config solicitudos CORS - APIs
const cors = require('cors');
app.use(cors()); // Cualquier página web puede hacer solicitudes a tu API sin ser bloqueada

// PUT/Delete
const methodOverride = require('method-override'); 
app.use(methodOverride('_method')); 

// Config de rutas
const homeRoutes = require('./routes/home.routes');
const productsRoutes = require('./routes/products.routes');
const usersRoutes = require('./routes/users.routes');
const apisRoutes = require('./routes/apis.routes');

app.use('/', homeRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/apis', apisRoutes);

// Configuración de la base de datos según el entorno
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let connection;
if (config.use_env_variable) {
  connection = mysql.createConnection(process.env[config.use_env_variable]);
} else {
  connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Ejemplo de uso de la conexión en una ruta
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.send(`La solución es: ${results[0].solution}`);
  });
});


module.exports = app;