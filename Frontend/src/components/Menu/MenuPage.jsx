import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "./ProductList";
import Loader from "../shared/Loader";
import useCart from "../../hooks/useCart";
import { fetchProducts } from "../../services/api";
import "./MenuPage.css";

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) setTableNumber(table);

    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Menu load nahi hua. Dobara try karo."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h2 className="menu-heading">Our Menu 🍽️</h2>
      <ProductList products={products} />
    </div>
  );
};

export default MenuPage;