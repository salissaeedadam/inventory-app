import {React, useState} from "react"
import PaystackPop from "@paystack/inline-js"

const PaystackIntegration = () => {
    const [email, setEmail] =useState("")
    const [amount, setAmount] =useState("")
    const payWithPaystack = (e) => {
        e.preventDefault()
        const paystack = new PaystackPop()
        paystack.newTransaction({
            key:"pk_live_0f3bffb988a5f8dd748dba25e79a609d735e3685",
            amount: amount * 100,
            email,
            onSuccess(transaction){
                let message = `Payment Complete! Reference ${transaction.reference}`
                alert(message)
            },
            onCancel(){
                alert("You have cancel the transaction")
            }
        })
    }

    return (
        <div className="w3-container w3-row">
            <div className="w3-container w3-green">
                <h3 className="w3-center">Make Payment</h3>
            </div>
            <div className="w3-container w3-quarter"></div>
            <div className="w3-container w3-half">
        <div className="w3-container w3-card-4">
            <form id="paymentForm">
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w3-input" id="email-address" required />
  </div>
  <div class="form-group">
    <label for="amount">Amount</label>
    <input type="tel" className="w3-input" id="amount" required />
  </div>
  <div class="form-submit">
    <button className="w3-btn w3-block w3-green" type="submit" onclick={payWithPaystack}> Pay </button>
  </div>
</form>
</div>
        </div>
        </div>
    )
}

export default PaystackIntegration