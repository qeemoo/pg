import S from './apple.module.css';

const Apple = () => {
  return (
    <div className={S.container}>
      <div className={S.play_container}>
        <div className={S.main_container}>main</div>
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
