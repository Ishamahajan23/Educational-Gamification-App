import React from "react";
import FuzzyText from "../../reactbits/FuzzyText/FuzzyText";

const NotFound = () => {
  const hoverIntensity = 0.5;
  const enableHover = true;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#B3E0EF] px-4 sm:px-6 lg:px-8">
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={hoverIntensity}
        enableHover={enableHover}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-red-600 text-center"
      >
        404 - Page Not Found
      </FuzzyText>
    </div>
  );
};

export default NotFound;
