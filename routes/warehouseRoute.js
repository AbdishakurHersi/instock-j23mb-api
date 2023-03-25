const router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");
const inventoryController = require("../controllers/inventoryController");

router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.addWarehouse);

router
  .route("/:id")
  .get(warehouseController.singleWarehouse)
  .delete(warehouseController.deleteWarehouse)
  .put(warehouseController.updateWarehouse);

router.route("/:id/inventories").get(inventoryController.warehouseInventories);

module.exports = router;
