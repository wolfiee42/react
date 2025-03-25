import React, { useEffect, useState } from "react";

type Props = {
  render: (x: number, y: number) => React.ReactNode;
};

export const mouseTracker = ({ render }: Props) => {
  const [positions, setPositions] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPositions({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return render(positions.x, positions.y);
};
