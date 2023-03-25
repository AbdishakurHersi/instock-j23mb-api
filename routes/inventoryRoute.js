const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");
const warehouseController = require("../controllers/warehouseController");

router
  .route("/")
  .get(inventoryController.index)
  .post(inventoryController.addInventory);
router
  .route("/:id")
  .get(inventoryController.singleInventoryItem)
  .delete(inventoryController.deleteInventoryItem);

module.exports = router;
