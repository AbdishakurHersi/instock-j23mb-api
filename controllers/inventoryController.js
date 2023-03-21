const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("inventory")
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      res.status(400).send(`Error retrieving Inventories: ${err}`);
    });
};
