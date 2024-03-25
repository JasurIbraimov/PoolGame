import { useRef, useEffect, useCallback } from "react";
import { ICanvasProps } from "../types";

type CanvasOptions = Pick<ICanvasProps, "options">; 

const useCanvas = ({options}: CanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function resizeCanvas(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }

    return false;
  }

  const postDraw = useCallback((context: CanvasRenderingContext2D) => {
    context.restore();
  }, []);

  const preDraw = useCallback(
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      context.save();
      resizeCanvas(canvas, context);
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);
    },
    []
  );

  const draw = useCallback(
    (context: CanvasRenderingContext2D, frameCount: number) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = "#000000";
      context.beginPath();
      context.arc(
        50,
        100,
        20 * Math.sin(frameCount * 0.05) ** 2,
        0,
        2 * Math.PI
      );
      context.fill();
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext(options.context);
    if (!context) return;

    let frameCount = 0;
    let animationFrameId: number;
    const render = () => {
      frameCount++;
      preDraw(canvas, context);
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
      postDraw(context);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, preDraw, postDraw, options.context]);

  return canvasRef;
};

export default useCanvas;
