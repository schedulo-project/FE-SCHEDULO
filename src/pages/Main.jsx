import SideBox from "../components/SideBox";
import Navbar from "../components/Navbar";

//page
import Home from "../pages/Home";

const Main = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <SideBox />
      <div className="flex flex-col w-full h-screen">
        <Navbar />
        <Home />
      </div>
    </div>
  );
};

export default Main;
