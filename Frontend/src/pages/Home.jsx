import React from "react";
import SplitText from "../../reactbits/SplitText/SplitText";
import Loader from "../components/Loader";
import bgImg from "/src/assets/24467670_db74_5pad_220302.jpg";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "../../reactbits/SpotlightCard/SpotlightCard";
import Ballpit from "../../reactbits/Ballpit/Ballpit";

export const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/dashboard");

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
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${bgImg})`,
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
      <div className="flex flex-col items-center justify-center pt-3 bg-gradient-to-b from-[#B3E0EF] to-[#C97E2A]">
        <div className="relative overflow-hidden w-full h-[150vh] sm:h-[70vh] md:h-[70vh] lg:h-[60vh] xl:h-[70vh]">
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6 w-full max-w-7xl mx-auto z-10 p-2 md:p-2 lg:p-6">
            <SpotlightCard
              className="custom-spotlight-card mt-2 md:mt-4 lg:mt-6 border border-[#B3E0EF] rounded-xl md:rounded-2xl h-[250px] md:h-[280px] lg:h-[320px] flex flex-col"
              spotlightColor="#8B5C1B"
            >
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#8B5C1B] mb-2 md:mb-4">
                Why Choose GameStore?
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base lg:text-lg text-[#336422] space-y-1 flex-1">
                <li>Daily quizzes to test your knowledge</li>
                <li>Exciting rewards and surprises</li>
                <li>Engaging and educational content</li>
                <li>Compete with friends and earn badges</li>
              </ul>
            </SpotlightCard>
            <SpotlightCard
              className="custom-spotlight-card mt-2 md:mt-4 lg:mt-6 border border-[#B3E0EF] rounded-xl md:rounded-2xl h-[250px] md:h-[280px] lg:h-[320px] flex flex-col"
              spotlightColor="#C97E2A"
            >
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#8B5C1B] mb-2 md:mb-4">
                Join the GameStore Community
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[#336422] flex-1">
                Connect with fellow gamers, share your scores, and climb the
                leaderboard. Join us today and start your gaming journey!
              </p>
            </SpotlightCard>
            <SpotlightCard
              className="custom-spotlight-card mt-2 md:mt-4 lg:mt-6 border border-[#B3E0EF] rounded-xl md:rounded-2xl h-[250px] md:h-[280px] lg:h-[320px] md:col-span-2 lg:col-span-1 flex flex-col"
              spotlightColor="#336422"
            >
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#8B5C1B] mb-2 md:mb-4">
                Quiz Subjects
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[#336422] mb-3 md:mb-4 flex-1">
                Explore a wide range of quiz subjects including history,
                science, technology, and more. Test your knowledge and learn
                something new every day!
              </p>
              <button
                className="w-full md:w-auto bg-[#82576C] text-white py-2 px-4 rounded shadow-lg hover:bg-[#CB8029] transition duration-300 cursor-pointer text-sm md:text-base mt-auto"
                onClick={handleClick}
              >
                Start Quiz
              </button>
            </SpotlightCard>
          </div>
          <div className="absolute inset-0 z-0">
            <Ballpit
              colors={[0xff0000, 0x00ff00, 0x0000ff]}
              count={100}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
