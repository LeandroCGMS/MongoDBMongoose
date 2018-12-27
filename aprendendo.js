const mongoose = require('mongoose')

// Configurando o Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/aprendendo", {
    useMongoClient: true
}).then(() => {
    console.log("Conectado com sucesso.")
}).catch((erro) => {
    console.log("Houve um erro ao conectar. Erro: " + erro)
})