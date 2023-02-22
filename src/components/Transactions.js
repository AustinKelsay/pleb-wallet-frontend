import React from "react";
import "./Transactions.css";

const Transactions = ({ transactions }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatValue = (value) => {
    return `${value > 0 ? "+" : ""}${value} sats`;
  };

  const formatDescription = (tx) => {
    let description;
    if (tx.settled === 0) {
      description = "Unpaid invoice";
    } else if (tx.value > 0) {
      description = `${
        tx.send === 0 ? "Received from" : "Sent to"
      } ${tx.payment_request.substring(0, 25)}...`;
    } else {
      description = `${
        tx.send === 0 ? "Sent to" : "Received from"
      } ${tx.payment_request.substring(0, 25)}...`;
    }
    return description;
  };

  return (
    <div>
      <h3>Transactions</h3>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`tx-item ${tx.settled === 0 ? "unsettled" : ""}`}
        >
          <p>{formatDescription(tx)}</p>
          <p>{formatValue(tx.value)}</p>
          <p className="transaction-date">{formatDate(tx.created_at)}</p>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
