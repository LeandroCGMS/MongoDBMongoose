if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI: "mongodb://leandro:mpe04ameLSC@#@ds153824.mlab.com:53824/blogapp-prod"
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/blogapp"
    }
}