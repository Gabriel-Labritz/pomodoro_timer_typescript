import React, { useState, useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Timer } from './timer';
import { Button } from './button';
import { secondsToTime } from '../utils/seconds-to-time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const workingBellSong = require('../sounds/src_sounds_bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const restingBellSong = require('../sounds/src_sounds_bell-finish.mp3');

const workingBell = new Audio(workingBellSong);
const restingBell = new Audio(restingBellSong);

interface Props {
  defaultMainTime: number;
  defaultShortBreakTime: number;
  defaultLongBreakTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultMainTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [cyclesQtdMenager, setCyclesQtdMenager] = useState(
    new Array(props.cycles - 1),
  );
  const [numbersOfPomodoro, setNumbersOfPomodoro] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [workedTime, setWorkedTime] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (isWorking) setWorkedTime(workedTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configWorking = () => {
    setIsWorking(true);
    setTimeCounting(true);
    setIsResting(false);
    setMainTime(props.defaultMainTime);
    workingBell.play();
  };

  const configRest = (long: boolean) => {
    setIsResting(true);
    setTimeCounting(false);
    setIsWorking(false);

    if (long) {
      setMainTime(props.defaultLongBreakTime);
    } else {
      setMainTime(props.defaultShortBreakTime);
    }

    restingBell.play();
  };

  useEffect(() => {
    if (isWorking) document.body.classList.add('working');
    if (isResting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (isWorking && cyclesQtdMenager.length > 0) {
      configRest(false);
      cyclesQtdMenager.pop();
    } else if (isWorking && cyclesQtdMenager.length <= 0) {
      configRest(true);
      setCyclesQtdMenager(new Array(props.cycles - 1));
      setCompletedCycles(completedCycles + 1);
    }

    if (isWorking) setNumbersOfPomodoro(numbersOfPomodoro + 1);
    if (isResting) configWorking();
  }, [
    isWorking,
    isResting,
    mainTime,
    cyclesQtdMenager,
    numbersOfPomodoro,
    configRest,
    configWorking,
    props,
  ]);

  return (
    <div className="pomodoro">
      <h2>Pomodoro Timer</h2>
      <div className="timer-area">
        <h3>You are: {timeCounting && isWorking ? 'Working' : 'Resting'}</h3>
        <Timer mainTime={mainTime} />
        <div className="button-area">
          <Button
            classButton="bt-work"
            textButton="WORK"
            onClick={() => configWorking()}
          />
          <Button
            classButton="bt-rest"
            textButton="REST"
            onClick={() => configRest(false)}
          />
          <Button
            classButton={!isWorking && !isResting ? 'hidden' : 'bt-pause'}
            textButton={timeCounting ? 'PAUSE' : 'PLAY'}
            onClick={() => setTimeCounting(!timeCounting)}
          />
        </div>
      </div>
      <div className="details">
        <h3>Your progress !</h3>
        <p>Completed pomodoros: #{numbersOfPomodoro}</p>
        <p>Time worked: {secondsToTime(workedTime)}</p>
        <p>Cycles completed: #{completedCycles}</p>
      </div>
    </div>
  );
}
