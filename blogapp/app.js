// Carregando Módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const Postagem = mongoose.model("postagens")
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)
// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
        
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
            console.log("Conectado ao Mongo.")
        }).catch((erro) => {
            console.log("Ocorreu um erro ao conectar-se no Mongo. Erro: " + erro)
        })
    // Public
        app.use(express.static(path.join(__dirname,"public")))

        /*app.use((req, res, next) => {
            console.log("OI, EU SOU UM MIDDLEWARE.")
            next()
        })*/

// Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao recuperar postagens do banco de" +
            "dados. Erro: " + erro)
            res.redirect("/404")
        })
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            } else {
                req.flash("error_msg", "Esta postagem não existe.")
                res.redirect('/')
            }
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno. Erro: " + erro)
            res.redirect('/')
        })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao procurar as categorias. Erro: " + erro)
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens) => {
                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro ao procurar postagens desta categoria." +
                    " Erro: " + erro)
                    res.redirect('/')
                })
            } else {
                req.flash("error_msg", "Esta categoria não existe.")
                res.redirect('/')
            }
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao recuperar a categoria escolhida. Erro: " + erro)
            res.redirect('/')
        })
    })

    app.get("/404", (req, res) => {
        res.send("Erro 404.")
    })

    app.get('/posts', (req, res) => {
        res.send("Lista de Posts")
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT + ".")
})