import React, { useEffect, useState } from "react";
import Transactions from "./components/Transactions";
import Buttons from "./components/Buttons";
import Chart from "./components/Chart";
import Header from "./components/Header";
import axios from "axios";
import { axiosWithAuth } from "./utils/axiosWithAuth";
import "./App.css";

function App() {
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [channelBalance, setChannelBalance] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosWithAuth()
        .get(`${backendUrl}/users/user`)
        .then((res) => {
          setIsLoggedIn(true);
          setUsername(res.data.username);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const getPrice = () => {
    // Axios is a library that makes it easy to make http requests
    // After we make a request, we can use the .then() method to handle the response asychronously
    // This is an alternative to using async/await
    axios
      .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
      // .then is a promise that will run when the API call is successful
      .then((res) => {
        console.log(res.data.data.amount);
        // set price to only 2 decimal places
        setPrice(Number(res.data.data.amount).toFixed(2));
        updateChartData(res.data.data.amount);
      })
      // .catch is a promise that will run if the API call fails
      .catch((err) => {
        console.log(err);
      });
  };

  const getWalletBalance = () => {
    axios
      .get(`${backendUrl}/lightning/balance`)
      .then((res) => {
        setBalance(res.data.total_balance);
      })
      .catch((err) => console.log(err));
  };

  const getChannelBalance = () => {
    axios
      .get(`${backendUrl}/lightning/channelbalance`)
      .then((res) => {
        setChannelBalance(res.data.balance);
      })
      .catch((err) => console.log(err));
  };

  const getTransactions = () => {
    axios
      .get(`${backendUrl}/lightning/invoices`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.log(err));
  };

  const updateChartData = (currentPrice) => {
    const timestamp = Date.now();
    // We are able to grab the previous state to look at it and do logic before adding new data to it
    setChartData((prevState) => {
      // If we have no previous state, create a new array with the new price data
      if (!prevState)
        return [
          {
            x: timestamp,
            y: Number(currentPrice),
          },
        ];
      // If the timestamp or price has not changed, we don't want to add a new point
      if (
        prevState[prevState.length - 1].x === timestamp ||
        prevState[prevState.length - 1].y === Number(currentPrice)
      )
        return prevState;
      // If we have previous state than keep it and add the new price data to the end of the array
      return [
        // Here we use the "spread operator" to copy the previous state
        ...prevState,
        {
          x: timestamp,
          y: Number(currentPrice),
        },
      ];
    });
  };

  // useEffect is a 'hook' or special function that will run code based on a trigger
  // The brackets hold the trigger that determines when the code inside of useEffect will run
  // Since it is empty [] that means this code will run once on page load
  useEffect(() => {
    getPrice();
    getWalletBalance();
    getChannelBalance();
    getTransactions();
  }, []);

  // Run these functions every 5 seconds after initial page load
  useEffect(() => {
    const interval = setInterval(() => {
      getPrice();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Run these functions every 30 seconds after initial page load
  useEffect(() => {
    const interval = setInterval(() => {
      getWalletBalance();
      getTransactions();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Header />
      <Buttons isLoggedIn={isLoggedIn} />
      <div className="row">
        <div className="balance-card">
          <p>Onchain balance: {balance} sats</p>
          <p>Channel balance: {channelBalance} sats</p>
        </div>
        <div className="balance-card">
          <h2>Price</h2>
          <p>${price}</p>
        </div>
      </div>
      <div className="row">
        <div className="row-item">
          <Transactions transactions={transactions} />
        </div>
        <div className="row-item">
          <Chart chartData={chartData} />
        </div>
      </div>
      <footer>
        <p>Made by plebs, for plebs.</p>
      </footer>
    </div>
  );
}

export default App;
