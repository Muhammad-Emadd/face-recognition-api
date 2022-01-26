const registerHandler = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("empty filds, try again");
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      db.transaction((trx) => {
        return trx
          .insert({ hash: hash, email: email }, "email")
          .into("login")
          .then((newEmail) => {
            return trx("users")
              .insert(
                {
                  email: newEmail[0].email,
                  name: name,
                  joined: new Date(),
                },
                "*"
              )
              .then((user) => res.json(user[0]))
              .catch((err) =>
                res.status(400).json("something went wrong, please try again")
              );
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).catch(function (error) {
        res.status(400).json("something went wrong, please try again");
      });
    });
  });
};
module.exports = { registerHandler };
