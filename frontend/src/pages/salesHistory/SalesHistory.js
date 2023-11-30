import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { orders } from "../../redux/features/cart/cartSlice";
import {
  selectSalesHistory,
  STORE_SALES,
} from "../../redux/features/salesHistory/salesSlice";
import styles from "./SalesHistory.module.scss";

const SalesHistory = () => {
  const sales = useSelector(orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // You need to dispatch the STORE_SALES action with data or an API call.
    dispatch(STORE_SALES(SalesHistory));
    // Example: dispatch(STORE_SALES(someData));
    // This should be the data from your sales history.
    // Replace 'someData' with the actual data or API call.
  }, [dispatch]);

  useEffect(() => {
    console.log(JSON.stringify(sales));
  }, []);

  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };

  return (
    <section>
      <div className={`container ${styles.order}`}>
        <h2>Your Sales History</h2>
        <br />
        <>
          {/* You might want to conditionally render the Loader while fetching data */}
          {/*sales.length === 0 && <Loader /> */}
          <div className={styles.table}>
            {sales.length === 0 ? (
              <p>No sales found</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>s/n</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) =>
                      sale.items.map((item, index) => {
                        const { name, price, image } = item.product;
                        const { _id, quantity } = item;

                        return (
                          <tr key={_id}>
                            <td>{index + 1}</td>
                            <td>
                              <p>
                                <b>{name}</b>
                              </p>
                              <img
                                src={image.filePath}
                                alt={name}
                                style={{ width: "100px" }}
                              />
                            </td>
                            <td>{price}</td>
                            <td>
                              <div className={styles.count}>
                                <p>
                                  <b>{quantity}</b>
                                </p>
                              </div>
                            </td>
                            <td>{(Number(price) * quantity).toFixed(2)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default SalesHistory;
