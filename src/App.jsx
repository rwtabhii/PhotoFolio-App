import "./App.css"

// Components imports
import {Navbar} from "../src/component/navbar/navbar.jsx"
import {AlbumList} from "../src/component/albumList/albumList.jsx"

// React Toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Navbar />
      <div className="content">
        <AlbumList />
      </div>
    </div>
  );
}

export default App;
