"use client";

import { useEffect, useState } from "react";

const UaeClock = ({ className }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dubai",
    });

    const updateTime = () => {
      setTime(formatter.format(new Date()));
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return <p className={className}>{time}</p>;
};

export default UaeClock;
