const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      res.status(400).send(`Error retrieving Inventories: ${err}`);
    });
};

// Gets information for an single inventory item by inventory id.
exports.singleInventoryItem = (req, res) => {
  knex("inventories")
    .where({ "inventories.id": req.params.id })
    .innerJoin("warehouses", "warehouses.id", "inventories.warehouse_id")
    .select(
      "inventories.id",
      "warehouse_name",
      "item_name",
      "description",
      "category",
      "status",
      "quantity"
    )
    .then((inventories) => {
      if (inventories.length === 0) {
        return res.status(404).json({
          message: `Unable to find inventory with id: ${req.params.id}`,
        });
      }

      res.json(inventories[0]);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

// Gets all inventory items for the specific warehouse.
exports.warehouseInventories = (req, res) => {
  knex("inventories")
    .where({ warehouse_id: req.params.id })
    .select("id", "item_name", "category", "status", "quantity")
    .then((inventories) => {
      if (inventories.length === 0) {
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
