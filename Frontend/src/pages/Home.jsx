import React from "react";
import SplitText from "../../reactbits/SplitText/SplitText";
import Loader from "../components/Loader";
import bgImg from "/src/assets/24467670_db74_5pad_220302.jpg";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/dashboard")

    console.log("Quiz started!");
  };
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div
        className="flex flex-col justify-center items-center text-center gap-4"
        style={{
          backgroundImage:
            `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${bgImg})`,
          backgroundRepeat: "no-repeat",
          height: "93vh",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          width: "100%",
        }}
      >
        <div className="md:w-1/2 m-3 p-10 bg-[#B3E0EF] bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <small className="text-black">Let's The Game Begin</small>
          <h1 className="text-4xl text-[#8B5C1B] font-bold font-mono">
            <SplitText
              text="Let's The Game Begin"
              className="md:text-4xl  text-3xl font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </h1>
          <p className="text-lg text-[#336422] font-mono">
            GameStore is the daily Trivia and quiz playing platform. It brings
            some exciting surprises every day.
          </p>
          <div>
            <button
              className="mt-4 bg-[#82576C] text-white py-2 px-4 rounded shadow-lg hover:bg-[#CB8029] transition duration-300 cursor-pointer"
              onClick={handleClick}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
