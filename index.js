const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors());
app.use(express.json());

const warehouseRoutes = require("./routes/warehouseRoute");
const inventoryRoutes = require("./routes/inventoryRoute");

app.use("/warehouses", warehouseRoutes);
app.use("/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
