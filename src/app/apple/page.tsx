'use client';

import { useEffect, useState } from 'react';
import S from './apple.module.css';

const generateAppleGrid = () => {
  return Array.from(
    { length: 10 * 20 },
    () => Math.floor(Math.random() * 9) + 1
  );
};

const Apple = () => {
  const [appleGrid, setAppleGrid] = useState<number[]>([]);

  useEffect(() => {
    setAppleGrid(generateAppleGrid());
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
          <div className={S.logo_box}>logo</div>
          <div className={S.score_box}>score</div>
          <div className={S.reset_box}>reset</div>
          <div className={S.volume_box}>vol</div>
        </div>
      </div>
      <div className={S.timer_container}>타이머</div>
    </div>
  );
};

export default Apple;
