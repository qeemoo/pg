'use client';

import { useEffect, useRef, useState } from 'react';
import S from './apple.module.css';
import Link from 'next/link';

const generateAppleGrid = () => {
  return Array.from({ length: 10 * 20 }, () => Math.floor(Math.random() * 9));
};

const findZeroPoint = (searchGrid: number[]) => {
  return searchGrid.filter((n) => n === 0).length;
};

const Apple = () => {
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [appleGrid, setAppleGrid] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [muted, setMuted] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // 초기 셋업
  useEffect(() => {
    const grid = generateAppleGrid();
    setAppleGrid(grid);
    setScore(findZeroPoint(grid));

    backgroundMusicRef.current = new Audio('/sound/apple.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = volume;
    backgroundMusicRef.current.muted = muted;

    backgroundMusicRef.current.play().catch((err) => {
      console.warn('브라우저가 자동 재생을 막음:', err);
    });

    return () => {
      backgroundMusicRef.current?.pause();
      backgroundMusicRef.current = null;
    };
  }, []);

  // 오디오 볼륨/음소거 반영
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
      backgroundMusicRef.current.muted = muted;
    }
  }, [volume, muted]);

  // 게임 시작 핸들러 (선택사항: 시작 시 음악 재생 보장)
  const handleStart = () => {
    setStarted(true);
    backgroundMusicRef.current?.play();
  };

  // 게임 리셋
  const handleReset = () => {
    const newGrid = generateAppleGrid();
    setAppleGrid(newGrid);
    setScore(findZeroPoint(newGrid));
    setTimeLeft(120);
    setStarted(false);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.pause();
    }
  };

  // 타이머 작동
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  return (
    <div className={S.container}>
      {!started ? (
        <div className={S.cover}>
          <button onClick={handleStart}>게임 시작</button>
        </div>
      ) : (
        <>
          <div className={S.play_container}>
            <div className={S.main_container}>
              <div className={S.main_grid}>
                {appleGrid.map((number, index) => (
                  <div key={index}>{number}</div>
                ))}
              </div>
            </div>
            <div className={S.option_container}>
              <div className={S.logo_box}>
                <Link href='/'>logo</Link>
              </div>
              <div className={S.score_box}>{score}</div>
              <div className={S.reset_box}>
                <button onClick={handleReset}>reset</button>
              </div>
              <div className={S.volume_box}>
                <button onClick={() => setMuted((prev) => !prev)}>
                  {muted ? '🔇' : '🔊'}
                </button>
                <input
                  type='range'
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (muted) setMuted(false); // 슬라이더 조작 시 자동 음소거 해제
                  }}
                />
              </div>
            </div>
          </div>
          <div className={S.timer_container}>
            <div className={S.number_timer}>{timeLeft}</div>
            <div
              className={S.bar_timer}
              style={
                { '--time-ratio': `${timeLeft / 120}` } as React.CSSProperties
              }
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Apple;
