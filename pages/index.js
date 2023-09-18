// pages/index.js
import GettingStarted from "@/components/GettingStarted";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
          <Navbar />
          <GettingStarted/>
      <div className="main-content">
        {/* Add your homepage sections here */}
      </div>
    </div>
  );
};

export default Home;
