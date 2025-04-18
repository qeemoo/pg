'use client';

import { useEffect, useState } from 'react';
import S from './apple.module.css';
import Link from 'next/link';

const generateAppleGrid = () => {
  return Array.from(
    { length: 10 * 20 },
    () => Math.floor(Math.random() * 9) + 0 // test를 위하여 0으로 변경 1로 수정필요
  );
};

const findZeroPoint = (searchGrid: number[]) => {
  return searchGrid.filter((n) => n === 0).length;
};

const Apple = () => {
  const [appleGrid, setAppleGrid] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setAppleGrid(generateAppleGrid());
    setScore(findZeroPoint(generateAppleGrid()));
  }, []);

  return (
    <div className={S.container}>
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
            <Link href='/'> logo</Link>
          </div>
          <div className={S.score_box}>{score}</div>
          <div className={S.reset_box}>
            <button
              onClick={() => {
                const newGrid = generateAppleGrid();
                setAppleGrid(newGrid);
                setScore(findZeroPoint(newGrid));
              }}
            >
              reset
            </button>
          </div>
          <div className={S.volume_box}>vol</div>
        </div>
      </div>
      <div className={S.timer_container}>타이머</div>
    </div>
  );
};

export default Apple;
