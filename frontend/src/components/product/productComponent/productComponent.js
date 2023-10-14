import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice'; // Update the import path

const ProductComponent = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // Dispatch the addToCart action with the product data
    dispatch(addToCart(product));
  };

  return (
    // Your component JSX here
    <td className="icons">
      <button onClick={handleAddToCart}>
        <i className="fa fa-cart-plus" /> Add to Cart
      </button>
    </td>
  );
};

export default ProductComponent;
