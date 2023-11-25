import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import './Checkout.scss';

const Checkout = () => {
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const { totalAmount } = location.state; // Assuming you're passing the total amount from the previous page

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handlePayment = () => {
    if (selectedPaymentMethod === "card") {
      // Redirect to card payment details page
      // Implement logic to handle card payment
    } else if (selectedPaymentMethod === "cash") {
      // Implement logic for cash payment confirmation
    } else {
      // Handle if no payment method selected
      alert("Please select a payment method");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total Amount: ${totalAmount}</p>
      <div>
        <button onClick={() => handlePaymentSelection("cash")}>
          Pay with Cash
        </button>
        <button onClick={() => handlePaymentSelection("card")}>
          Pay with Card
        </button>
      </div>
      {selectedPaymentMethod && (
        <div>
          {selectedPaymentMethod === "card" ? (
            <div>
              {/* Card payment details form */}
              {/* Implement the form fields for card details */}
              <button onClick={handlePayment}>Pay with Card</button>
            </div>
          ) : (
            <div>
              {/* Confirmation for cash payment */}
              <p>Please proceed to pay in cash.</p>
              <button onClick={handlePayment}>Confirm Payment</button>
            </div>
          )}
        </div>
      )}
      <Link to="/">Cancel</Link>
    </div>
  );
};

export default Checkout;
