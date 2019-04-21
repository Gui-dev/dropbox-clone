const express = require( 'express' )
const mongoose = require( 'mongoose' )
const routes = require( './routes' )
const path = require( 'path' )
const socket = require( 'socket.io' )
const http = require( 'http' )
const cors = require( 'cors' )

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const server = http.Server( app )
const io = socket(server)
const port = process.env.PORT || 3333


io.on( 'connection', socket => {

  socket.on( 'connectRoom', box => {
    socket.join( box )
  } )
} )

mongoose.connect( 'mongodb+srv://gui:gui@cluster0-cvlc0.mongodb.net/omnistack?retryWrites=true', 
    { useNewUrlParser: true } 
)

app.use( ( req, res, next ) => {
  req.io = io
  return next()
} )
app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( '/files', express.static( 
  path.resolve( __dirname, '..', 'tmp' )
 ) )
app.use( routes )


server.listen( port, () => {

  console.log( `Servidor rodando na porta ${port}` )
} )