import { useContext } from "react";
import AppContext from "../../context";

const useCart = () => {
    const { cartItems, setCartItems } = useContext(AppContext);
    const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);
    return { cartItems, setCartItems, totalPrice };
};

export default useCart;
