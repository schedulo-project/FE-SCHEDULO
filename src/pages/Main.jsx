import SideBox from "../components/SideBox";

//page
import Home from "../pages/Home";

const Main = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <SideBox />
      <Home />
    </div>
  );
};

export default Main;
