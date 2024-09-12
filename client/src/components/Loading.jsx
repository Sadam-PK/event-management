import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import the default styles

const Loading = () => {
  return (
    <div>
      <div className="flex justify-center pt-5">
        <Skeleton width="40vw" height="6vh" />
      </div>
      <div className="flex flex-row gap-3 flex-wrap justify-center items-center mt-10">
        <Skeleton width="30vw" height="30vh" />
        <Skeleton width="30vw" height="30vh" />
        <Skeleton width="30vw" height="30vh" />
        <Skeleton width="30vw" height="30vh" />
        <Skeleton width="30vw" height="30vh" />
        <Skeleton width="30vw" height="30vh" />
      </div>
    </div>
  );
};

export default Loading;
