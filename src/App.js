import { useEffect, useState } from "react";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [cartOpened, setCartOpened] = useState(false);

    useEffect(() => {
        axios.get("https://66ac845af009b9d5c73257b9.mockapi.io/items").then((res) => {
            setItems(res.data);
        });
        axios.get("https://66ac845af009b9d5c73257b9.mockapi.io/cart").then((res) => {
            setCartItems(res.data);
        });
    }, []);

    const onAddToCart = (obj) => {
        axios.post("https://66ac845af009b9d5c73257b9.mockapi.io/cart", obj);
        const itemExist = cartItems.some((item) => item.id === obj.id);
        if (!itemExist) {
            setCartItems((prev) => [...cartItems, obj]);
        }
    };

    const onRemoveFromCart = (id) => {
        axios.delete(`https://66ac845af009b9d5c73257b9.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = (obj) => {
        console.log("Adding to favorites:", obj); // Проверка, вызывается ли функция
        // Проверяем, существует ли уже этот товар в избранном
        const itemExist = favorites.some((item) => item.id === obj.id);
        if (!itemExist) {
            // Если товар не существует в избранном, добавляем его
            setFavorites((prev) => [...prev, obj]);
        }
    };

    const onRemoveFromFavorite = (id) => {
        // Удаляем товар из избранного
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const onSearchChangeInput = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className="wrapper clear">
            <div className={`overlay ${cartOpened ? "overlayVisible" : ""}`}>
                {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveFromCart} />}
            </div>

            <Header onClickCart={() => setCartOpened(true)} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            items={items}
                            cartItems={cartItems}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            onSearchChangeInput={onSearchChangeInput}
                            onAddToFavorite={onAddToFavorite}
                            onAddToCart={onAddToCart}
                        />
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <Favorites
                            favorites={favorites}
                            onAddToFavorite={onAddToFavorite}
                            onRemoveFromFavorite={onRemoveFromFavorite}
                            onAddToCart={onAddToCart}
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
