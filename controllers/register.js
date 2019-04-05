
const handleRegister = (req, res, db, bcrypt) => {
  const {email, name, password} = req.body;
  const hash = bcrypt.hashSync(password); // hashes the pw
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginemail => { //
        return trx('users')
          .returning('*') // knex function that returns all the added data '*'
          .insert({
          email: loginemail[0],
          name: name,
          joined: new Date()
          })
          .then(user => {
            res.json(user[0]); // returns the last user registered
          })
      })
      .then(trx.commit) // commits all transactions if succesful
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
} 