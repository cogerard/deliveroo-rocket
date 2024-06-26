import "./App.css";
import axios from "axios";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// Components
import Category from "./components/Category";
import Cart from "./components/Cart";

const calculateTotal = (cart) => {
  console.log("calculating total");
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].quantity * cart[i].price;
  }
  return total;
};

function App() {
  console.log("App render");

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState("white");

  const myInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://site--deliveroo-backend--5ytnmfswy69s.code.run/",
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = useCallback((meal) => {
    setCart((prev) => {
      const cartCopy = structuredClone(prev);
      const mealPresent = cartCopy.find((elem) => elem.id === meal.id);
      if (mealPresent) mealPresent.quantity++;
      else cartCopy.push({ ...meal, quantity: 1 });
      return cartCopy;
    });
  }, []);

  const handleRemoveFromCart = useCallback((meal) => {
    setCart((prev) => {
      const cartCopy = structuredClone(prev);
      const mealPresent = cartCopy.find((elem) => elem.id === meal.id);
      if (mealPresent.quantity === 1) {
        const index = cartCopy.indexOf(mealPresent);
        cartCopy.splice(index, 1);
      } else {
        mealPresent.quantity--;
      }
      return cartCopy;
    });
  }, []);

  const total = useMemo(() => calculateTotal(cart), [cart]);

  console.log("render");

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className={`App ${theme === "white" ? "theme-white" : "theme-red"}`}>
      <div className="hero container">
        <div>
          <h1>{data.restaurant.name}</h1>
          <p>{data.restaurant.description}</p>
        </div>
        <img src={data.restaurant.picture} alt="" />
        <button
          className="theme-button"
          onClick={() => {
            setTheme((prev) => (prev === "white" ? "red" : "white"));
          }}
        >
          Switch theme
        </button>
      </div>
      <div className="content">
        <label className="sections-container container">
          Search:
          <input type="text" ref={myInput} />
        </label>
        <div className="sections-container container">
          <section className="left-section">
            {data.categories.map((category, index) => {
              if (category.meals.length !== 0) {
                return (
                  <Category
                    key={index}
                    category={category}
                    handleAddToCart={handleAddToCart}
                  />
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="right-section">
            <Cart
              cart={cart}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddToCart={handleAddToCart}
              total={total}
            />
          </section>
        </div>
        <button
          className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
          onClick={() => {
            myInput.current.focus();
          }}
        >
          Search focus
        </button>
      </div>
    </div>
  );
}

export default App;
