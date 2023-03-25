const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const warehouseRoutes = require("./routes/warehouseRoute");
const inventoryRoutes = require("./routes/inventoryRoute");

app.use("/warehouses", warehouseRoutes);
app.use("/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
