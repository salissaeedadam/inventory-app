import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  selectSalesHistory,
  STORE_SALES,
} from "../../redux/features/salesHistory/salesSlice";
import styles from "./SalesHistory.module.scss";

const SalesHistory = () => {
  const sales = useSelector(selectSalesHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // You need to dispatch the STORE_SALES action with data or an API call.
    // Example: dispatch(STORE_SALES(someData));
    // This should be the data from your sales history.
    // Replace 'someData' with the actual data or API call.
  }, [dispatch]);

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
          { /*sales.length === 0 && <Loader /> */}
          <div className={styles.table}>
            {sales.length === 0 ? (
              <p>No sales found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Saled ID</th>
                    <th>sales Amount</th>
                    <th>sales Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((order, index) => {
                    const {
                      id,
                      salesDate,
                      salesTime,
                      salesAmount,
                      salesStatus,
                    } = order; // Use 'order', not 'sales'
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {salesDate} at {salesTime}
                        </td>
                        <td>{id}</td>
                        <td>
                          {"$"}
                          {salesAmount}
                        </td>
                        <td>
                          <p
                            className={
                              salesStatus !== "Delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {salesStatus}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default SalesHistory;
