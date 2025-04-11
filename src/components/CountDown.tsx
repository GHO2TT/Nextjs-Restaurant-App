"use client";
import React, { useState, useEffect } from "react";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date("2025-10-10") - +new Date();
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null; // Or a loading spinner

  return (
    <span className="font-bold text-5xl text-yellow-300 text-center">
      {timeLeft.days}:{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
      {/* <p className="text-xs">Client-only countdown</p> */}
    </span>
  );
};

export default CountDown;
