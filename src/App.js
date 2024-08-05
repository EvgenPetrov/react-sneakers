import { useEffect, useState } from "react";
import Card from "./components/Card";
import Drawer from "./components/Drawer";
import Header from "./components/Header";

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [items, setItems] = useState([]);
    const [cartOpened, setCartOpened] = useState(false);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await fetch("https://66ac845af009b9d5c73257b9.mockapi.io/items");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data); // Обновляем состояние items, если data является массивом
                } else {
                    console.error("Полученные данные не являются массивом:", data);
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        FetchData();
    }, []);

    const onAddToCart = (obj) => {
        const itemExist = cartItems.some((item) => item.id === obj.id);
        if (!itemExist) {
            setCartItems((prev) => [...cartItems, obj]);
        }
    };

    const onRemoveFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    console.log(cartItems);

    return (
        <div className="wrapper clear">
            <div className={`overlay ${cartOpened ? "overlayVisible" : ""}`}>
                {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveFromCart} />}
            </div>

            <Header onClickCart={() => setCartOpened(true)} />

            <div className="content p-40">
                <div className="d-flex align-center justify-between mb-40">
                    <h1>Все кроссовки</h1>
                    <div className="search-block d-flex">
                        <img src="/img/search.svg" alt="Search" />
                        <input placeholder="Поиск..." />
                    </div>
                </div>

                <div className=" d-flex flex-wrap ">
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            title={item.title}
                            price={item.price}
                            imageUrl={item.imageUrl}
                            onFavorite={() => console.log("Добавили в закладки")}
                            onPlus={(obj) => onAddToCart(item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
