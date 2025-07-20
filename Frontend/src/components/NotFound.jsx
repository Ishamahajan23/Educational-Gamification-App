import React from "react";
import FuzzyText from "../../reactbits/FuzzyText/FuzzyText";

const NotFound = () => {
  const hoverIntensity = 0.5;
  const enableHover = true;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#B3E0EF]">
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={hoverIntensity}
        enableHover={enableHover}
        className="text-xl font-bold text-red-600"
      >
        404 - Page Not Found
      </FuzzyText>
    </div>
  );
};

export default NotFound;
