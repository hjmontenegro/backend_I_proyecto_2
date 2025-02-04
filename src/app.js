import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

import homeRouter from './routes/home.routers.js'
import productsRouter from './routes/products.routers.js'
import cartsRouter from './routes/carts.routers.js'

import { Server } from 'socket.io'
const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({ extended : true }))

//Configurar Handlebars para leer el conrtenido de los endpoint
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views') // Todo
app.set('view engine', 'handlebars')

//Utilizar recursos estaticos
app.use(express.static(__dirname + '/public'))

//Ahora toda la logica de las vistas quedan en router
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use('/', homeRouter)

/*app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})*/

const httpServer = app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', socketServer => {
    console.log(`Nuevo cliente conectado`)

    socketServer.on('producto', data => {
       
        const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const products = { id, ...data}

        console.log(`Dta: ${JSON.stringify(products)}`)
        //products.unshift(data);
        //fs.writeFileSync('./database/products.json',JSON.stringify(products, null, '\t'))
        socketServer.emit('productoLog', data)
    })
})

