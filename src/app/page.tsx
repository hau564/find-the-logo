"use client"; 
import { useState, useRef, useEffect } from "react";

const images = ["/data/1.png", "/data/2.png", "/data/3.png", "/data/4.png", "/data/5.png"];
const logos = ["Adidas", "CHANEL", "MAESTRO", "ecco", "Thang máy cùng tầng"];
const coordinates = [
  [[57,905],[176,987]],
  [[1381,520],[1441,537]],
  [[523,433],[585,446]],
  [[163,532],[222,547]],
  [[517,99],[726,256]]
];
let times = []

export default function Home() {
  const [name, setName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [time, setTime] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setTime(Date.now());
    setIsStarted(true);
  };

  const checkClickPosition = (event: React.MouseEvent): boolean => {
    if (!imageRef.current) return false;
    
    // Get image dimensions and position
    const rect = imageRef.current.getBoundingClientRect();
    const scale =  0.5;
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    
    console.log(`Clicked at coordinates: (${x.toFixed(3)}, ${y.toFixed(3)})`);
    
    return x >= coordinates[index][0][0] && x <= coordinates[index][1][0] &&
           y >= coordinates[index][0][1] && y <= coordinates[index][1][1];
  };

  const addResult = async (name: string, image_id: number, time: number | null) => {
    try {
      const response = await fetch("/api/saveResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, image_id, time }),
      });
      if (!response.ok) {
        throw new Error("Failed to save results");
      }
      const data = await response.json();
      console.log("Results saved:", data);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const handleSkip = () => {
    addResult(name, index + 1, null);
    setTime(Date.now());
    if (index < images.length - 1) {
      setIndex(index + 1);
    } else {
      console.log("All images shown");
      setIsComplete(true);
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    const shouldProceed = checkClickPosition(event);
    if (shouldProceed) {
      
      const currentTime = Date.now();
      addResult(name, index + 1, currentTime - time);
      setTime(currentTime);

      if (index < images.length - 1) {
        setIndex(index + 1);
      } else {
        console.log("All images shown");
        setIsComplete(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
        {!isStarted ? (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              maxLength={40}
              onPaste={(e) => e.preventDefault()}
              className="border p-2 rounded-md w-64 text-center text-black"
            />
            <button 
              onClick={handleStart}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
              Start
            </button>
          </>
        ) : isComplete ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Thank you!</h1>
            <p className="text-lg text-black">You've completed all the images.</p>
          </div>
        ) : (
          <>
            <div 
              ref={imageRef} 
              className="relative cursor-pointer" 
              onClick={handleImageClick}
              style={{transformOrigin: 'top left' }}
            >
              <img
                src={images[index]}
                alt="Test Image"
                className="rounded-lg shadow-md"
                style={{ maxWidth: 'none' }}
              />
            </div>
            <h1 className="text-2xl font-bold text-black relative">Click on {index === 4 ? logos[index] : `"${logos[index]}"`}</h1>
            <button 
              onClick={handleSkip}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}