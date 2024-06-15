import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import React from "react";

const HomePage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden before:absolute before:top-0 before:start-1/2  before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2",
        className
      )}
    >
      <h1>Hello world</h1>
    </div>
  );
};

export { HomePage };
