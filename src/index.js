/*
Configuración de MongoDB Atlas:

- Ve a MongoDB Atlas y crea una cuenta.
- Crea un nuevo proyecto y un clúster gratuito.
- Una vez que se haya creado el clúster, haz clic en "CONNECT" 
y sigue las instrucciones para agregar la IP de tu máquina 
y crear un usuario de base de datos.
- Elige "Connect Your Application", selecciona Node.js como 
tu driver y copia la URI de conexión.
*/

const express = require("express"); //Agregamos express a nuestro proyecto
const mongoose = require("mongoose"); //Agregamos mogoose a nuestro proyecto
require("dotenv").config(); //requerir dotenv para poder accesar variables de ambiente creadas por nosotros
const app = express(); //Ejecutamos express

app.use(express.json()); //middleware lee los datos Json y los convierte en un objeto JavaScript

// Conexión a MongoDB Atlas
const mongoUri = process.env.MONGODB_URI; //Uri de mongodb atlas traida desde .env

//Conexión a la base de datos en mogodb atlas a travez de mongoose
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true, // Utiliza el nuevo parser de cadena de conexión
    useUnifiedTopology: true, // Utiliza el nuevo motor de monitoreo y administración de conexiones unificado
  })
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
  });

// Obtiene una referencia a la conexión con la base de datos
const db = mongoose.connection;

// Escucha el evento "error" en la conexión. Si ocurre un error, lo mostrará en la consola.
db.on("error", console.error.bind(console, "Error de conexión:"));

// Escucha el evento "open", el cual se activa una vez que la conexión con MongoDB ha sido establecida exitosamente.
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

// Define un esquema para el modelo Libro.
// El esquema determina la estructura de los documentos en la colección de MongoDB.
// En este caso, cada libro tendrá un título y un autor, ambos de tipo String.
const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

// Crea un modelo llamado "Libro" utilizando el esquema definido anteriormente.
// Con este modelo, puedes realizar operaciones CRUD sobre la colección de libros en la base de datos.
// Mongoose creará o utilizará una colección llamada "libros" (versión pluralizada del nombre del modelo) en la base de datos.
const Libro = mongoose.model("Libro", libroSchema);

// Middleware de autenticación
/*app.use((req, res, next) => {
  const authToken = req.headers["authorization"];

  // En un escenario real, compararía este token con una base de datos o algún otro sistema de autenticación.
  if (authToken === "Bearer miTokenSecreto123") {
    next(); // Si la autenticación es correcta, permitimos que la solicitud continúe
  } else {
    res.status(401).send("Acceso no autorizado");
  }
});*/

// ... [Todas las rutas de CRUD de libros aquí]

//Ruta raiz
app.get("/", (req, res) => {
  res.send("Bienvenido a la tienda de libros");
});

//Ruta para pedir todos los libros
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener libros");
  }
});

// Ruta para obtener un libro específico por su ID
app.get("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar el libro");
  }
});

// Crear un nuevo libro
app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar libro");
  }
});

// Ruta para actualizar un libro específico por su ID
app.put("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true } // Esta opción hará que se devuelva el documento actualizado
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar el libro");
  }
});

// Ruta para eliminar un libro específico por su ID
app.delete("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndRemove(req.params.id);
    if (libro) {
      res.status(204).send();
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el libro");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor ejecutándose en http://localhost:3000/");
});

//Instalar nodemon npm i nodemon -D dependencia desarrollo

/*Agregar el nuevo script para nodemon 
"scripts": {
    "start": "nodemon src/index.js"
  },
*/

//Instalar mogoose npm i mongoose

//Traer la uri de conexión y llevarla a una variable de ambiente

//Instalar dotenv npm i dotenv

//En mongo atlas se debe crear la cuenta, crear el nuevo proyecto
//Creamos la base de datos gratuita y dejamos por defecto
//Creamos el usuario y contraseña en data base access
//Creamos la ip aqui se debe configurar la ip publica o ip donde
//tengamos alojado el back para hacer consultas etc por authorization
//lo dejamos con acceso a todos
//Lo siguiente es hacer la conexion mediante el link que se proporciona en connect
//alli la conexion seria connect your aplication en driver, mongodb compas es similar a phpmyadmind

//Para subir a render.com build command npm install, start command npm run start
//Y agregar las variables de entorno que en este caso es solo 1
