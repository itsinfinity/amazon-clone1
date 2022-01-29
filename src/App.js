import React, { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import reducer, { initialState } from "./reducer";
import Login from "./Login";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51K53CqSDPghL5DIMlTjMoYVz3BLFSQAxlFBJ0Aeqp0XiCnDi1SqzfyMt5JOi76YleV0l5RuUR0lbxxpGmsiK2cau00JqHhZ7Kj"
);

export const StateContext = React.createContext();

function App() {
  const [{ basket, user }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    //will only run when the ap component loads

    onAuthStateChanged(auth, (authUser) => {
      console.log("THE USER IS >>>", authUser);
      if (authUser) {
        //the user just logged in / the user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <StateContext.Provider value={{ basket: basket, user: user, dispatch: dispatch }}>
      <Router>
        <div className="app">
          <Switch>
            <Route path="/orders">
              <Header />
              <Orders />
            </Route>
            <Route path="/login">
              <Login />
            </Route>

            <Route path="/checkout">
              <Header />
              <Checkout />
            </Route>
            <Route path="/payment">
              <Header />
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            </Route>
            <Route path="/">
              <Header />

              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </StateContext.Provider>
  );
}

export default App;
