import { useEffect } from "react";
import "./App.css";
import { changeName, changePassword, loginUser, registerUser } from "./api/api";

function App() {
  useEffect(() => {
    fetch("./api/user")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  registerUser("gleb", "kerzolys@gmail.com", "gfhjkm");
  loginUser('kerzolys@gmail.com', 'gfhjkm')
  changeName('kerzolys@gmail.com')

  return <>hello</>;
}

export default App;
