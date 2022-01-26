const signinHandler = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("empty filds, try again");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      bcrypt
        .compare(password, data[0].hash)
        .then((ress) => {
          if (ress) {
            return db("users")
              .select("*")
              .where("email", "=", email)
              .then((data) => {
                res.json(data[0]);
              });
          } else {
            throw new Error("unable to get the user, wrong password");
          }
        })
        .catch((err) => res.status(400).json(err.message));
    })
    .catch((err) => {
      res.status(400).json("wrong password or email adress ");
    });
};

module.exports = { signinHandler };
