const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router.route("/").get(inventoryController.index);
router.route("/:id")
   .get(inventoryController.singleInventoryItem)
   .delete(inventoryController.deleteInventoryItem);

module.exports = router;
