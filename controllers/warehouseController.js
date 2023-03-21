const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("warehouse")
    .select("id", "name", "manager")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouses ${err}`));
};

exports.singleWarehouse = (req, res) => {
  knex("warehouse")
    .where({ id: req.params.id })
    .then((warehouses) => {
      if (warehouses.length === 0) {
        return res.status(404).json({
          message: `Unable to find warehouse with id: ${req.params.id}`,
        });
      }

      res.json(warehouses[0]);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.warehouseInventories = (req, res) => {
  // Find all inventories for a given warehouse id (req.params.id)
  knex("inventory")
    .where({ warehouse_id: req.params.id })
    .then((inventories) => {
      if (inventories.length === 0) {
        // Diving Deeper: If warehouse exists, send back empty array instead

        return res.status(404).json({
          error: `Unable to find inventories for warehouse ${req.params.id}`,
        });
      }

      res.json(inventories);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.deleteWarehouse = (req, res) => {
  // Delete the warehouse with ID matching req.params.id
  knex("warehouse")
    .where({ id: req.params.id })
    .del()
    .then((numberOfWarehousesDeleted) => {
      if (numberOfWarehousesDeleted === 0) {
        return res.status(404).json({
          message: `Warehouse not found with id ${req.params.id}`,
        });
      }

      // 204 - No Content
      res.sendStatus(204);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.addWarehouse = (req, res) => {
  if (
    !req.body.name ||
    !req.body.position ||
    !req.body.manager ||
    !req.body.address ||
    !req.body.phone ||
    !req.body.email
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: name, position, manager, address, phone, email",
    });
  }

  const { name, position, manager, address, phone, email } = req.body;

  // Check for unique email
  knex("warehouse")
    .where({ email: email })
    .then((warehouses) => {
      if (warehouses.length > 0) {
        return res.status(400).json({
          message: "Email is already taken",
        });
      }

      knex("warehouse")
        .insert({
          name,
          position,
          manager,
          address,
          phone,
          email,
        })
        .then((createdIds) => {
          const warehouseId = createdIds[0];

          return knex("warehouse").where({ id: warehouseId });
        })
        .then((warehouses) => {
          return res.status(201).json(warehouses[0]);
        })
        .catch((error) => {
          return res.status(400).json({
            message: "There was an issue with the request",
            error,
          });
        });
    });
};

exports.updateWarehouse = (req, res) => {
  if (
    !req.body.name ||
    !req.body.position ||
    !req.body.manager ||
    !req.body.address ||
    !req.body.phone ||
    !req.body.email
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: name, position, manager, address, phone, email",
    });
  }

  const { name, position, manager, address, phone, email } = req.body;

  knex("warehouse")
    .update({
      name,
      position,
      manager,
      address,
      phone,
      email,
    })
    .where({ id: req.params.id })
    .then(() => {
      // Grab the new data from this record
      return knex("warehouse").where({ id: req.params.id });
    })
    .then((warehouses) => {
      res.json(warehouses[0]);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};
