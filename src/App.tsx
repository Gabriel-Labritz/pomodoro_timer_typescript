import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App() {
  return (
    <div className="App">
      <PomodoroTimer
        defaultMainTime={1500}
        defaultShortBreakTime={300}
        defaultLongBreakTime={900}
        cycles={4}
      />
    </div>
  );
}

export default App;
