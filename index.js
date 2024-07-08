const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const controller = require("../KarmaTienda/Controllers/KarmaTienda");
const db = require("../KarmaTienda/db/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let products = [];

// Cargar productos desde la base de datos
const loadProductsFromDB = () => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (error, rows) => {
    if (error) {
      console.log(error);
      return;
    }
    products = rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      image: row.image,
      stock: row.stock,
    }));
    console.log("Productos cargados:", products);
  });
};

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/pay", (req, res) => {
  const cartItems = req.body;
  const productsCopy = products.map((p) => ({ ...p }));

  const updateStockPromises = cartItems.map((item) => {
    return new Promise((resolve, reject) => {
      const product = productsCopy.find((p) => p.id === item.id);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        const sql = "UPDATE productos SET stock = ? WHERE id = ?";
        db.query(sql, [product.stock, product.id], (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      } else {
        reject("Sin Stock suficiente");
      }
    });
  });

  Promise.all(updateStockPromises)
    .then(() => {
      products = productsCopy;
      res.send({ message: "Compra procesada con éxito", products });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.use("/", express.static("Front"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  loadProductsFromDB();
});

//PUT actualizar stock
app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const { id, name, price, image, stock } = req.body;

  let updateFields = [];
  let sqlParams = [];

  if (id !== undefined) {
    updateFields.push("id = ?");
    sqlParams.push(id);
  }
  if (name !== undefined) {
    updateFields.push("name = ?");
    sqlParams.push(name);
  }
  if (price !== undefined) {
    updateFields.push("price = ?");
    sqlParams.push(price);
  }
  if (image !== undefined) {
    updateFields.push("image = ?");
    sqlParams.push(image);
  }
  if (stock !== undefined) {
    updateFields.push("stock = ?");
    sqlParams.push(stock);
  }

  sqlParams.push(productId);

  const sql = `UPDATE productos SET ${updateFields.join(", ")} WHERE id = ?`;

  db.query(sql, sqlParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el producto");
    }

    const updatedProduct = products.find((p) => p.id == productId);
    if (updatedProduct) {
      if (id !== undefined) updatedProduct.id = id;
      if (name !== undefined) updatedProduct.name = name;
      if (price !== undefined) updatedProduct.price = price;
      if (image !== undefined) updatedProduct.image = image;
      if (stock !== undefined) updatedProduct.stock = stock;
    }

    res.send({
      message: "Producto actualizado con éxito",
      product: updatedProduct,
    });
  });
});

//DELETE borrar dato
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM productos WHERE id = ?";
  db.query(sql, [productId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error al eliminar el producto");
    }

    const index = products.findIndex((p) => p.id == productId);
    if (index !== -1) {
      products.splice(index, 1);
    }

    res.send({ message: "Producto eliminado con éxito" });
  });
});

//CREATE agregar productos
app.post("/api/products", (req, res) => {
  const { id, name, price, image, stock } = req.body;

  const sql =
    "INSERT INTO productos (id, name, price, image, stock) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [id, name, price, image, stock], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error al agregar el producto");
    }

    const newProduct = {
      id,
      name,
      price,
      image,
      stock,
    };

    products.push(newProduct);

    res.send({ message: "Producto agregado con éxito", product: newProduct });
  });
});
