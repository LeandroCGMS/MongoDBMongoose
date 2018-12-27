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

// Model - Usuários
// Definindo o Model
const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }
})

// Collection
mongoose.model('usuarios', UsuarioSchema)

const Victor = mongoose.model('usuarios')

new Victor({
    nome: "Jhon",
    sobrenome: "Joe",
    email: "jhon@joe.com",
    idade: 34,
    pais: "EUA"
}).save().then(() => {
    console.log("Usuário criado com sucesso.")
}).catch((erro) => {
    console.log("Houve um erro ao registrar usuário. Erro: " + erro)
})