import React from "react";
import "./Transactions.css";

const Transactions = ({ transactions }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatValue = (value, send) => {
    return `${send ? "-" : "+"}${value} sats`;
  };

  const formatDescription = (tx) => {
    let description;
    if (tx.settled === 0) {
      description = "Unpaid invoice";
    } else {
      description = `${
        tx.send === 0 ? "Received from" : "Sent to"
      } ${tx.payment_request.substring(0, 25)}...`;
    }
    return description;
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="transactions">
      <h3>Transactions</h3>
      {sortedTransactions.map((tx) => (
        <div
          key={tx.id}
          className={`tx-item ${tx.settled === 0 ? "unsettled" : ""}`}
        >
          <p>{formatDescription(tx)}</p>
          <p>{formatValue(tx.value, tx.send)}</p>
          <p className="transaction-date">{formatDate(tx.created_at)}</p>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
