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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const grid = generateAppleGrid();
    setAppleGrid(grid);
    setScore(findZeroPoint(grid));

    backgroundMusicRef.current = new Audio('/sound/apple.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = volume;
    backgroundMusicRef.current.muted = muted;

    backgroundMusicRef.current.play().catch((err) => {
      console.warn('자동 재생 실패:', err);
    });

    return () => {
      backgroundMusicRef.current?.pause();
      backgroundMusicRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
      backgroundMusicRef.current.muted = muted;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowModal(true);
          backgroundMusicRef.current?.pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const handleReset = () => {
    const newGrid = generateAppleGrid();
    setAppleGrid(newGrid);
    setScore(findZeroPoint(newGrid));
    setTimeLeft(120);
    setStarted(false);
    setShowModal(false);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play();
    }
  };

  const handleRestart = () => {
    const newGrid = generateAppleGrid();
    setAppleGrid(newGrid);
    setScore(findZeroPoint(newGrid));
    setTimeLeft(10);
    setShowModal(false);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play();
    }
  };

  return (
    <div className={S.container}>
      {!started ? (
        <div className={S.start_screen}>
          <button onClick={() => setStarted(true)}>게임 시작</button>
        </div>
      ) : (
        <>
          <div className={S.play_container}>
            <div className={S.main_container}>
              <div className={S.main_grid}>
                {appleGrid.map((number, index) => (
                  <div
                    key={index}
                    className={`${S.grid_item} ${selectedIndices.includes(index) ? S.selected : ''}`}
                    onMouseDown={() => {
                      setSelectedIndices([index]);
                      setIsDragging(true);
                    }}
                    onMouseEnter={() => {
                      if (isDragging && !selectedIndices.includes(index)) {
                        setSelectedIndices([...selectedIndices, index]);
                      }
                    }}
                    onMouseUp={() => {
                      setIsDragging(false);
                      const sum = selectedIndices.reduce(
                        (acc, i) => acc + appleGrid[i],
                        0
                      );
                      if (sum === 10) {
                        const newGrid = [...appleGrid];
                        selectedIndices.forEach((i) => {
                          newGrid[i] = 0;
                        });
                        setAppleGrid(newGrid);
                        setScore(findZeroPoint(newGrid));
                      }
                      setSelectedIndices([]);
                    }}
                  >
                    {number}
                  </div>
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
                    if (muted) setMuted(false);
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

      {showModal && (
        <div className={S.modal_overlay}>
          <div className={S.modal_container}>
            <p>Score: {score}</p>
            <button onClick={handleRestart}>reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apple;
