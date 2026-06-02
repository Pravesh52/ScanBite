const { getProducts } = require("../services/googleSheetService");

const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Products fetch error:", error.message);
    res.status(500).json({ message: "Products load nahi hue" });
  }
};

module.exports = { getAllProducts };