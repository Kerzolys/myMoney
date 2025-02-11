import { useEffect } from "react";
import "./App.css";
import {
  addCategory,
  addTransaction,
  changeName,
  changePassword,
  deleteCategory,
  deleteTransaction,
  editCategory,
  editTransaction,
  loginUser,
  registerUser,
} from "./api/api";
import { useUserState } from "./services/zustand/store";
import { TCategoryType } from "./services/types/types";

function App() {
  const { isLoggedIn } = useUserState();
  useEffect(() => {
    registerUser("gleb", "kerzolys@gmail.com", "gfhjkm");
    loginUser("kerzolys@gmail.com", "gfhjkm");
  }, []);
  useEffect(() => {
    fetch("./api/user")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, [isLoggedIn]);

  // useEffect(() => {
  //   fetch("./api/user/transactions")
  //     .then((response) => response.json())
  //     .then((data) => console.log(data));
  // }, [isLoggedIn]);

  useEffect(() => {
    fetch("./api/user/categories")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, [isLoggedIn]);

  // changeName('kerzolys@gmail.com')
  // addTransaction("1", 200, "heat", false);
  // editTransaction("1", { description: "househhold" });
  // deleteTransaction('1')
  // addCategory("household", TCategoryType.EXPENSE);
  // editCategory("1", { name: "household" });
  // deleteCategory("1");

  return <>hello</>;
}

export default App;
