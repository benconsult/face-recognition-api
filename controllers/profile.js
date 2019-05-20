const handleProfileGet = (req, res,db) =>{
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
        
}
module.exports = {
    handleProfileGet
}