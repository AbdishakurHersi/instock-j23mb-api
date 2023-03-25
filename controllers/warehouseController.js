const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouses ${err}`));
};

exports.singleWarehouse = (req, res) => {
   knex("warehouses")
   .where({ "warehouses.id": req.params.id })
   .leftJoin("inventories", "warehouses.id", "inventories.warehouse_id")
   .select('*')
    .then((warehouses) => {
      if (warehouses.length === 0) {
        return res.status(404).json({
          message: `Unable to find warehouse with id: ${req.params.id}`,
        });
      }
      res.json(warehouses);
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
  knex("warehouses")
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
  knex("warehouses")
    .where({ email: email })
    .then((warehouses) => {
      if (warehouses.length > 0) {
        return res.status(400).json({
          message: "Email is already taken",
        });
      }

      knex("warehouses")
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

          return knex("warehouses").where({ id: warehouseId });
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

// PUT/EDIT request for a warehouse by id.
exports.updateWarehouse = (req, res) => {
  // Checks for an empty field in the PUT body request.
  if (
    !req.body.id ||
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    res.status(400).json({
      message:
        "Missing one or more required fields: warehouse name, address, city, country, contact name, contact position, contact phone, and contact email",
    });
  }

  // Contact email validation
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      req.body.contact_email
    )
  ) {
    res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  // Contact phone validation
  if (
    !/^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g.test(
      req.body.contact_phone
    )
  ) {
    res.status(400).json({
      message: "Please enter a valid phone number.",
    });
  }

  knex("warehouses")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      // Grab the new data from this record
      return knex("warehouses").where({ id: req.params.id });
    })
    .then((warehouses) => {
      if (warehouses.length === 0) {
        res.status(404).json({
          message: `Unable to update warehouse with id: ${req.params.id}`,
        });
      } else {
        res.status(200).json(warehouses[0]);
      }
    })
    .catch((err) => {
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`);
    });
};
