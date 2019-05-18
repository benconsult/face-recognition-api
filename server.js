const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
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
app.post('/signin', (req,res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       
    if(isValid){
        return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
            //console.log(user);
            res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
    }else{
        res.status(400).json('wrong credentials')
    }
    })
    .catch(err => res.status(400).json('wrong credentials'))

    
})

//register new user
app.post('/register', (req,res) =>{
    const { email, name, password} = req.body;//postman property
    /*bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
        // Store hash in your password DB.
    });*/
    const  hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash:hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')//all
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user=>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })


    //to test what we get
   .catch(err => res.status(400).json('unable to register'))
})
//profile:id with get
app.get('/profile/:id', (req, res) =>{
    const { id}=req.params;//postman params
    
    db.select('*').from('users').where({id})//check through objects
    .then(user =>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('not found');
        }
    })
    .catch(err => res.status(400).json('error getting user'))
        
})
// image with put method-for image update
app.put('/image', (req,res) =>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})
//bcrypt


app.listen(3000, ()=>{
  console.log('app is running on port 3000');
})