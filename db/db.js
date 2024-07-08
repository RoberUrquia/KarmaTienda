const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "mysql-proyectonode.alwaysdata.net",
    user: "367724_free",
    password: "ProyectoNodeJs1!",
    database: "proyectonode_database",
});

connection.connect((error) => {
    if(error) {
        return console.log(error);
    }

    console.log("Conectado a base de datos");
});

module.exports = connection;