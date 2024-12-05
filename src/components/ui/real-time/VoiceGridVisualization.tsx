"use client";

import React, { forwardRef, useEffect } from "react";

const VoiceCircleVisualization = forwardRef<
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

    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Set the canvas width and height, scaled for high-DPI screens
    const logicalWidth = 300;
    const logicalHeight = 300;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    // Scale the context to handle the high-DPI canvas
    ctx.scale(dpr, dpr);

    // Set the canvas style dimensions (CSS size)
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    const drawCircle = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      // Calculate activity level - average the frequency data
      const average =
        frequencyData.reduce((sum, value) => sum + Math.abs(value), 0) /
        frequencyData.length;
      const activity = Math.min(Math.max(average, 0), 1);

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;
      const maxRadius = Math.min(logicalWidth, logicalHeight) / 4;

      // Create soft gradient
      const gradient = ctx.createRadialGradient(
        centerX - maxRadius * 0.2,
        centerY - maxRadius * 0.2,
        0,
        centerX,
        centerY,
        maxRadius
      );

      // Use softer colors based on the type
      if (type === "client") {
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(0.2, "rgba(179, 214, 255, 0.9)");
        gradient.addColorStop(0.6, "rgba(77, 147, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 89, 255, 0.1)");
      } else {
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(0.2, "rgba(255, 214, 179, 0.9)");
        gradient.addColorStop(0.6, "rgba(255, 147, 77, 0.8)");
        gradient.addColorStop(1, "rgba(255, 89, 0, 0.1)");
      }

      // Create a pulsing effect
      const pulseRadius = maxRadius * (0.8 + activity * 0.2);
      const glowRadius = pulseRadius * 1.1;

      // Draw outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        pulseRadius * 0.8,
        centerX,
        centerY,
        glowRadius
      );
      glowGradient.addColorStop(
        0,
        type === "client"
          ? "rgba(77, 147, 255, 0.2)"
          : "rgba(255, 147, 77, 0.2)"
      );
      glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // Draw the glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw main circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    // Create animation loop
    const animate = () => {
      drawCircle();
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
      style={{ aspectRatio: "1" }}
    />
  );
});

VoiceCircleVisualization.displayName = "VoiceCircleVisualization";
export default VoiceCircleVisualization;
