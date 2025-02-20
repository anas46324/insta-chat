// server.js
const express = require('express');
const bodyparser = require('body-parser');
const port = 3000;
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js')
const messageRoutes = require('./routes/message.routes.js')
const connectDb = require('./db/connection.js');
const cookieParser = require('cookie-parser');
const { app, server } = require('./libs/socket.js');

const path = require('path');

const PORT = process.env.PORT
const _dirname = path.resolve()

app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

connectDb();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Optional
  next();
});


const corsOption = {
  origin: 'http://localhost:5173',
  "Access-Control-Allow-Origin": "*",
  methods: 'GET, POST, PUT, DELETE',
  // allowedHeaders: ['Content-Type, Authorization' , 'Content-Type: application/json'],
  credentials: true,
}

app.use(cors(corsOption));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// if(process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(_dirname, "../Frontend/dist")))
  
//   app.get("*", (req, res)=>{
//     res.sendFile(path.join(_dirname, "../Frontend", "dist", "index.html"))
//   })
// }

server.listen(port, () =>{
  console.log(`Server is running at http://localhost:${port}`);
});