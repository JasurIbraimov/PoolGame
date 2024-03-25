import useCanvas from "../hooks/useCanvas";
import { ICanvasProps } from "../types";

const Canvas = ({ options, ...rest } : ICanvasProps) => {

  const canvasRef = useCanvas({options});

  return <canvas ref={ canvasRef } {...rest} />;
};

export default Canvas;
