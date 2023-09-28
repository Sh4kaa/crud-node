import express, { Response, Request } from "express";
import { randomUUID } from "crypto";
import fs from 'fs';



const app = express();
app.use(express.json());

interface Products {
  name: string;
  price: number;
  id: string;
}


let products: Products[] = [];

fs.readFile('./src/db.json', (err, data) => {
  if(err) {
    console.log(err)
  } else {
    products = JSON.parse(data.toString())
    
  }
})

/* GET Home*/
app.get("/", (request: Request, response: Response) => {
  return response.json({ message: "Olá, você acessou a rota Home" });
});

/* POST product cadastro */
app.post("/products", (request: Request, response: Response) => {
  const { name, price } = request.body;

  const product: Products = {
    name,
    price,
    id: randomUUID(),
  };
  products.push(product);
  productFile()
  
  return response.status(200).json(product);
});

/* GET All products */

app.get("/products", (request: Request, response: Response) => {
  return response.status(200).json(products);
});

/* GET products pelo ID */

app.get("/products/:id", (request: Request, response: Response) => {
  const { id } = request.params;

  const productId = products.find((product) => product.id === id);
  if (productId) {
    return response.status(200).json(productId);
  } else {
    return response
      .status(404)
      .json({ message: "Não foi possivel encontrar esse Produto" });
  }
});
/* Update Product */
app.put("/products/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, price } = request.body;
  const productIndex = products.findIndex((product) => product.id === id);

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  if (!productIndex) {
    return response.status(404).json({ message: "Não encontrado" });
  }
  productFile()

  return response.status(200).json(products[productIndex]);
});

app.delete('/products/:id', (request: Request, response: Response) => {
  const {id} = request.params;
  const productIndex = products.findIndex(product => product.id === id);

  const itemDeleted = products.splice(productIndex, 1)
  productFile()

  return response.json({message: `${itemDeleted[0].name} removido com sucesso`})
})

app.listen(4001, () => console.log("Server is running, PORT:4001"));


function productFile() {
  fs.writeFile('./src/db.json', JSON.stringify(products), (err) => {
    if(err) {
      console.log('deu erro')
    } else {
      console.log('Arquivo inserido com sucesso')
    }
  })
}
