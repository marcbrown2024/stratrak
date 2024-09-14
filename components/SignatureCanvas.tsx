// react/nextjs components
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// firebase components
import { uploadSignature } from "@/firebase";

// icons
import { IoCloseCircle } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import useUser from "@/hooks/UseUser";

type DrawingAction = {
  path: { x: number; y: number }[];
  style: { color: string; lineWidth: number };
};

type Style = {
  color: string;
  lineWidth: number;
};

type SignatureCanvasProps = {
  setSignatureButton: React.Dispatch<React.SetStateAction<boolean>>;
  signatureButton: boolean;
  setSignature: React.Dispatch<React.SetStateAction<string>>;
};

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  setSignatureButton,
  signatureButton,
  setSignature,
}) => {
  const {user} = useUser()

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [drawingActions, setDrawingActions] = useState<DrawingAction[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [currentStyle, setCurrentStyle] = useState<Style>({
    color: "black",
    lineWidth: 3,
  });
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const reDrawPreviousData = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawingActions.forEach(({ path, style }) => {
        ctx.beginPath();
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.lineWidth;
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });
    },
    [drawingActions] // Add drawingActions as a dependency
  );

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 650;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        reDrawPreviousData(ctx);
      }
    }
  }, [canvasRef.current]); // Ensure this effect runs when canvasRef.current changes

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!drawing || !context) return;
    context.strokeStyle = currentStyle.color;
    context.lineWidth = currentStyle.lineWidth;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
    setCurrentPath((prevPath) => [
      ...prevPath,
      { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  const endDrawing = () => {
    if (drawing) {
      setDrawing(false);
      if (context) context.closePath();
      if (currentPath.length > 0) {
        setDrawingActions((prevActions) => [
          ...prevActions,
          { path: currentPath, style: currentStyle },
        ]);
      }
      setCurrentPath([]);
    }
  };

  const changeColor = (color: string) => {
    setCurrentColor(color);
    setCurrentStyle((prevStyle) => ({ ...prevStyle, color }));
  };

  const changeWidth = (width: number) => {
    setLineWidth(width);
    setCurrentStyle((prevStyle) => ({ ...prevStyle, lineWidth: width }));
  };

  const undoDrawing = () => {
    if (drawingActions.length > 0) {
      const newActions = [...drawingActions];
      newActions.pop();
      setDrawingActions(newActions);

      if (canvasRef.current) {
        const newContext = canvasRef.current.getContext("2d");
        if (newContext) {
          newContext.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          newActions.forEach(({ path, style }) => {
            newContext.beginPath();
            newContext.strokeStyle = style.color;
            newContext.lineWidth = style.lineWidth;
            newContext.moveTo(path[0].x, path[0].y);
            path.forEach((point) => {
              newContext.lineTo(point.x, point.y);
            });
            newContext.stroke();
          });
        }
      }
    }
  };

  const clearDrawing = () => {
    if (canvasRef.current) {
      const newContext = canvasRef.current.getContext("2d");
      if (newContext) {
        newContext.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setDrawingActions([]);
        setCurrentPath([]);
        setSignatureData(null); // Clear the saved signature when clearing the canvas
      }
    }
  };

  const saveSignature = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const base64String = canvas.toDataURL("image/png"); // Get the base64 string of the image
      const userId = user?.id;

      if (userId) {
        setSignature(base64String);
        await uploadSignature(userId, base64String);
        clearDrawing();
        setSignatureButton(false);
      }
    }
  };

  return (
    <div
      className={`absolute h-full w-full ${
        signatureButton ? "flex" : "hidden"
      } flex-col items-center justify-start bg-slate-50`}
    >
      <div className="relative h-fit w-fit">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="border-2 border-gray-400"
        />
        <button
          onClick={() => {
            setSignatureButton(false);
            clearDrawing();
          }}
          className="absolute -top-4 -right-4 text-red-700 bg-white rounded-full"
        >
          <IoCloseCircle size={40} />
        </button>
        <button
          onClick={saveSignature}
          className="absolute -top-4 -left-3 text-blue-700 bg-slate-100 p-1.5 rounded-full"
        >
          <FaSave size={28} />
        </button>
        <div className="flex items-center justify-between">
          <div className="flex justify-center my-4 space-x-2">
            <button
              onClick={() => changeColor("black")}
              className="w-8 h-8 bg-black rounded-full border-2 border-gray-200"
            />
            <button
              onClick={() => changeColor("blue")}
              className="w-8 h-8 bg-blue-600 rounded-full border-2 border-gray-200"
            />
            <button
              onClick={() => changeColor("darkgray")}
              className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-200"
            />
            <button
              onClick={() => changeColor("brown")}
              className="w-8 h-8 bg-[#964B00] rounded-full border-2 border-gray-200"
            />
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => changeWidth(Number(e.target.value))}
          />
          <div className="flex my-4 space-x-4">
            <button
              onClick={undoDrawing}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Undo
            </button>
            <button
              onClick={clearDrawing}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      {signatureData && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Saved Signature:</h3>
          <Image
            src={signatureData}
            alt="Signature"
            className="border-2 border-gray-400"
          />
          {/* You can use this hidden input to send the signature data to a server */}
          <input
            type="hidden"
            name="signature"
            value={signatureData}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default SignatureCanvas;