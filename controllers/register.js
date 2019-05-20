const handleRegister = (req,res,db,bcrypt) =>{
const { email, name, password} = req.body;//postman property
    if(!email || !name || !password){
        return res.status(400).json('Incorrect submission');
    }
    
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
}

module.exports ={
    handleRegister : handleRegister
};