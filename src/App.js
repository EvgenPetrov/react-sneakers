import { useEffect, useState } from "react";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const itemsResponse = await axios.get(
                    "https://66ac845af009b9d5c73257b9.mockapi.io/items"
                );
                const cartResponse = await axios.get(
                    "https://66ac845af009b9d5c73257b9.mockapi.io/cart"
                );

                setCartItems(cartResponse.data);
                setItems(itemsResponse.data);

                setIsLoading(false);
            } catch (error) {
                alert("Ошибка при запросе данных ;(");
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, []);

    const onAddToCart = (obj) => {
        if (cartItems.some((item) => item.id === obj.id)) {
            setCartItems((prev) => prev.filter((item) => item.id !== obj.id));
        } else {
            axios.post("https://66ac845af009b9d5c73257b9.mockapi.io/cart", obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };

    const onRemoveFromCart = (id) => {
        axios.delete(`https://66ac845af009b9d5c73257b9.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = (obj) => {
        setFavorites((prev) => {
            let updatedFavorites;

            if (prev.some((favObj) => Number(favObj.id) === Number(obj.id))) {
                // Удаляем из избранного
                updatedFavorites = prev.filter((item) => Number(item.id) !== Number(obj.id));
            } else {
                // Добавляем в избранное
                updatedFavorites = [...prev, obj];
            }

            // Сохраняем обновленный список избранного в localStorage
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

            return updatedFavorites;
        });
    };

    // Восстанавливаем состояние избранного из localStorage при загрузке страницы
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    }, []);

    const onSearchChangeInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id));
    };

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                onAddToFavorite,

                onAddToCart,
                setCartOpened,
                setCartItems,
            }}>
            <div className="wrapper clear">
                <div className={`overlay ${cartOpened ? "overlayVisible" : ""}`}>
                    {cartOpened && (
                        <Drawer
                            items={cartItems}
                            onClose={() => setCartOpened(false)}
                            onRemove={onRemoveFromCart}
                        />
                    )}
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
                                isLoading={isLoading}
                            />
                        }
                    />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
