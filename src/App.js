
import React, { useEffect, useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [next, setNext] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    return Number(localStorage.getItem("bestTime")) || null;
  });
  const timerRef = useRef(null);
  const tickSoundRef = useRef(null);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (next > 1 && next <= 25) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (tickSoundRef.current) tickSoundRef.current.play();
      }, 1000);
    } else if (next > 25) {
      clearInterval(timerRef.current);
      if (tickSoundRef.current) tickSoundRef.current.pause(); // ✅ 추가!
      if (!bestTime || seconds < bestTime) {
        setBestTime(seconds);
        localStorage.setItem("bestTime", seconds);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [next]);

  const startGame = () => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
    setNext(1);
    setSeconds(0);
    clearInterval(timerRef.current);
    if (tickSoundRef.current) tickSoundRef.current.pause(); // ✅ 시작할 때도 소리 멈춤
  tickSoundRef.current.currentTime = 0;
  };

  const handleClick = (number) => {
    if (number === next) {
      setNext(next + 1);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        padding: 20,
        textAlign: "center",
        background: "#f0f4f8",
        minHeight: "100vh"
      }}
    >
      <audio ref={tickSoundRef} src="https://www.soundjay.com/clock/sounds/clock-ticking-1.mp3" preload="auto" />

      <h1 style={{ fontSize: 32, marginBottom: 10 }}>🎯 1부터 25까지 숫자 없애기 게임</h1>
      <p style={{ fontSize: 16, color: "#555", marginBottom: 30 }}>
        순서대로 클릭해보세요!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 60px)",
          gap: 10,
          justifyContent: "center"
        }}
      >
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            disabled={num < next}
            style={{
              backgroundColor: num === next
                ? "#4caf50"
                : num < next
                ? "#ccc"
                : "#8bc34a",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              padding: "10px 0",
              border: "none",
              borderRadius: 10,
              cursor: num >= next ? "pointer" : "default",
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              height: 60,
              width: 60
            }}
          >
            {num}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 30, fontSize: 16, color: "#333" }}>
        현재 번호: <strong>{next}</strong>
      </p>

      <p style={{ fontSize: 16, color: "#555" }}>⏱️ 경과 시간: {seconds}초</p>

      {bestTime !== null && (
        <p style={{ fontSize: 16, color: "#009688" }}>🏆 최고 기록: {bestTime}초</p>
      )}
 <div style={{
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: 30
}}>
  <button
    onClick={startGame}
    style={{
      padding: "10px 20px",
      fontSize: 16,
      backgroundColor: "#2196f3",
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      minWidth: 120,
      fontWeight: "bold"
    }}
  >
    🔄 다시 시작
  </button>

  <button
    onClick={() => window.location.reload()}
    style={{
      padding: "10px 20px",
      fontSize: 16,
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      minWidth: 120,
      fontWeight: "bold"
    }}
  >
    ❌ 종료
  </button>
</div>
{/* ✅ 여기까지 추가 */}


    </div>
  );
}
