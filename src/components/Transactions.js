import React from "react";
import "./Transactions.css";

// This component renders a list of transactions, each transaction is an object with multiple properties.
const Transactions = ({ transactions }) => {
  // This helper function takes a timestamp and formats it to a human-readable date-time string.
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // This helper function formats a transaction's value. If the transaction is a send, it prepends a '-'; otherwise, a '+'.
  // The formatted value is returned as a string.
  const formatValue = (value, send) => {
    return `${send ? "-" : "+"}${value} sats`;
  };

  // This helper function creates a descriptive string for the transaction.
  // If the transaction is not settled, it returns 'Unpaid invoice'.
  // Otherwise, it uses parts of the payment request to describe the transaction.
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

  // This creates a new sorted array of transactions, ordered from newest to oldest.
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // The returned JSX displays a list of sorted transactions, where each transaction includes a description, a value, and a date.
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
