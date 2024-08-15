import { useState } from "react";
import styles from "./Drawer.module.scss";

import useCart from "../hooks/useCart";
import Info from "../Info";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
    const { cartItems, setCartItems, totalPrice } = useCart();
    const [orderId, setOrderId] = useState(null);
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClickOrder = async () => {
        try {
            setIsLoading(true);

            // Лог для проверки наличия элементов в корзине
            console.log("Cart Items:", cartItems);

            // Симуляция задержки
            await delay(1000);

            // Фейковый ID заказа и успешное завершение
            setOrderId(Date.now());
            setIsOrderComplete(true);

            // Очистка корзины
            if (cartItems.length > 0) {
                setCartItems([]);
            } else {
                console.warn("Cart is already empty.");
            }

            // Лог для проверки завершения заказа
            console.log("Order Complete:", isOrderComplete);
        } catch (error) {
            alert("Ошибка при оформлении заказа :(");
            console.error("Order Error:", error);
        }

        setIsLoading(false);
    };

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
            <div className={styles.drawer}>
                <h2 className="d-flex justify-between mb-30">
                    Корзина{" "}
                    <img onClick={onClose} className="cu-p" src="img/btn-remove.svg" alt="Close" />
                </h2>

                {items.length > 0 ? (
                    <div className="d-flex flex-column flex">
                        <div className="items flex">
                            {items.map((obj) => (
                                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                    <div
                                        style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                        className="cartItemImg"></div>

                                    <div className="mr-20 flex">
                                        <p className="mb-5">{obj.title}</p>
                                        <b>{obj.price} руб.</b>
                                    </div>
                                    <img
                                        onClick={() => onRemove(obj.id)}
                                        className="removeBtn"
                                        src="img/btn-remove.svg"
                                        alt="Remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li>
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>{totalPrice} руб. </b>
                                </li>
                                <li>
                                    <span>Налог 18%:</span>
                                    <div></div>
                                    <b>{(totalPrice / 100) * 18} руб. </b>
                                </li>
                            </ul>
                            <button
                                disabled={isLoading}
                                onClick={onClickOrder}
                                className="greenButton">
                                Оформить заказ <img src="img/arrow.svg" alt="Arrow" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Info
                        title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
                        description={
                            isOrderComplete
                                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
                        }
                        image={isOrderComplete ? "img/complete-order.jpg" : "img/empty-cart.jpg"}
                    />
                )}
            </div>
        </div>
    );
}

export default Drawer;
