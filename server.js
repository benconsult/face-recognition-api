const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

 const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'ben',
      database : 'smart_brain'
}
});
//console.log(postgres.select('*').from ('users'));
/*db.select('*').from ('users').then(data =>{
    console.log(data);//real response from db
});retuens an array*/
const app = express();
app.use(bodyParser.json());//to use middleware bodyParser
app.use(cors())//use middleware
//create databse for checking signin
const database = {
   users:[
       {
           id:'123',
           name:'John',
           password:'cookies',
           email:'john@gmail.com',
           entries:0,
           joined: new Date()
       },
       {
        id:'124',
        name:'Sally',
        password:'bananas',
        email:'sally@gmail.com',
        entries:0,
        joined: new Date()
    }
    
   ],

   login:[
       {
           id:'987',
           hash:'',
           email:'john@gmail.com'
       }
   ]

}

//send request to postman
app.get('/', (req,res) =>{
    //res.send('this is working');
    res.send(database.users);
})
//signin
app.post('/signin', signin.handleSignin(db,bcrypt))//advanced function
//register new user
app.post('/register', (req,res)=>{register.handleRegister(req,res,db,bcrypt)})
//profile:id with get
app.get('/profile/:id', (req,res) =>{ profile.handleProfileGet(req,res,db)})
// image with put method-for image update
app.put('/image', (req,res) =>{ image.handleImage(req,res,db)})
app.post('/imageurl', (req,res) =>{ image.handleApiCall(req,res)})
    

app.listen(3000, ()=>{
  console.log('app is running on port 3000');
})