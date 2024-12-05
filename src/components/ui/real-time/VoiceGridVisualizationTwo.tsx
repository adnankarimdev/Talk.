"use client";

import React, { forwardRef, useEffect } from "react";

const VoiceGridVisualization = forwardRef<
  HTMLCanvasElement,
  {
    type: "client" | "server";
    frequencyData: Float32Array;
    canvasRef: React.RefObject<HTMLCanvasElement>;
  }
>(({ type, frequencyData, canvasRef }, _) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set fixed dimensions
    canvas.width = 300;
    canvas.height = 300;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate activity level - average the frequency data
      const average =
        frequencyData.reduce((sum, value) => sum + Math.abs(value), 0) /
        frequencyData.length;
      const activity = Math.min(Math.max(average, 0), 1);

      // Calculate cell size
      const cellSize = canvas.width / 3;

      // Draw 3x3 grid
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const isCenter = row === 1 && col === 1;

          // Calculate cell position
          const x = col * cellSize;
          const y = row * cellSize;

          if (type === "client") {
            if (isCenter) {
              // Center cell - active with real-time activity
              ctx.fillStyle = `rgba(0, 128, 255, ${activity})`;
            } else {
              // Outer cells - static
              ctx.fillStyle = "rgba(0, 128, 255, 0.1)";
            }
          } else {
            if (isCenter) {
              // Center cell - active with real-time activity
              ctx.fillStyle = `rgba(255, 128, 0, ${activity})`;
            } else {
              // Outer cells - static
              ctx.fillStyle = "rgba(255, 128, 0, 0.1)";
            }
          }

          // Fill cell
          ctx.fillRect(x, y, cellSize, cellSize);

          // Add cell border
          ctx.strokeStyle =
            type === "client"
              ? "rgba(0, 128, 255, 0.2)"
              : "rgba(255, 128, 0, 0.2)";
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    };

    // Create animation loop
    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [type, frequencyData, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ aspectRatio: "1/1" }}
    />
  );
});

VoiceGridVisualization.displayName = "VoiceGridVisualization";
export default VoiceGridVisualization;
