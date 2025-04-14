import React, { useEffect, useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [next, setNext] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    return Number(localStorage.getItem("bestTime")) || null;
  });
  const [allRecords, setAllRecords] = useState(() => {
    return JSON.parse(localStorage.getItem("allRecords")) || [];
  });
  const [soundOn, setSoundOn] = useState(true);
  const timerRef = useRef(null);
  const tickSoundRef = useRef(null);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (next > 1 && next <= 25) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (soundOn && tickSoundRef.current) tickSoundRef.current.play();
      }, 1000);
    } else if (next > 25) {
      clearInterval(timerRef.current);
      if (!bestTime || seconds < bestTime) {
        setBestTime(seconds);
        localStorage.setItem("bestTime", seconds);
      }
      const updatedRecords = [...allRecords, seconds].sort((a, b) => a - b).slice(0, 5);
      setAllRecords(updatedRecords);
      localStorage.setItem("allRecords", JSON.stringify(updatedRecords));
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
  };

  const handleClick = (number) => {
    if (number === next) {
      setNext(next + 1);
    }
  };

  return (
    <div className="app">
      <audio ref={tickSoundRef} src="https://www.soundjay.com/clock/sounds/clock-ticking-1.mp3" preload="auto" />

      <h1>🎯 1부터 25까지 숫자 없애기 게임</h1>
      <p>순서대로 클릭해보세요!</p>

      <div className="grid">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            disabled={num < next}
            className={`cell ${num === next ? "next" : num < next ? "done" : ""}`}
          >
            {num}
          </button>
        ))}
      </div>

      <p>현재 번호: <strong>{next}</strong></p>
      <p>⏱️ 경과 시간: {seconds}초</p>
      {bestTime !== null && <p>🏆 최고 기록: {bestTime}초</p>}

      <div className="controls">
        <button onClick={startGame} className="restart">🔄 다시 시작</button>
        <button onClick={() => window.location.reload()} className="end">❌ 종료</button>
        <button onClick={() => setSoundOn(!soundOn)} className="sound">{soundOn ? "🔊 소리끄기" : "🔇 소리켜기"}</button>
      </div>

      {allRecords.length > 0 && (
        <div className="record-board">
          <h3>🏅 기록 TOP 5</h3>
          <ol>
            {allRecords.map((time, index) => (
              <li key={index}>{index + 1}위 - {time}초</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}