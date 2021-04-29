import {
  INCREMENT,
  DECREMENT,
  START_TIMER,
  STOP_TIMER,
  TICK_TOCK,
  RESET,
} from "../actionTypes";

const initialState = {
  started: false,
  focusTime: 25,
  breakTime: 5,
  timeBlock: "focusTime",
  timeLeft: "25:00",
  timerSelector: null,
};

const updateTimeLeft = (type, timeBlock, state) => {
  // only update timeLeft if time changing corresponds to the current timeBlock
  if (state.timeLeft === "00:00") {
    if (state[timeBlock] < 10) {
      return `0${state[timeBlock]}:00`;
    } else {
      return `${state[timeBlock]}:00`;
    }
  }
  if (state.timeBlock === timeBlock) {
    let timeLeft = state.timeLeft;
    let [minutesLeft, secondsLeft] = timeLeft
      .split(":")
      .map((numStr) => parseInt(numStr));
    if (type === "addMin") {
      minutesLeft += 1;
    } else if (type === "subMin") {
      minutesLeft -= 1;
    } else if (type === "subSec") {
      secondsLeft -= 1;
    }

    let [newMinutesLeft, newSecondsLeft] = ["", ""];
    if (minutesLeft < 10) {
      newMinutesLeft = `0${minutesLeft}`;
    } else {
      newMinutesLeft = `${minutesLeft}`;
    }

    if (secondsLeft === -1) {
      newMinutesLeft = minutesLeft - 1;
      newSecondsLeft = 59;
    } else if (secondsLeft < 10) {
      newSecondsLeft = `0${secondsLeft}`;
    } else {
      newSecondsLeft = `${secondsLeft}`;
    }
    timeLeft = `${newMinutesLeft}:${newSecondsLeft}`;
    return timeLeft;
  }

  return state.timeLeft;
};

const pomodoroReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT: {
      if (state[action.payload] < 60) {
        let newTime = state[action.payload] + 1;
        let timeLeft = updateTimeLeft("addMin", action.payload, state);
        if (action.payload === "focusTime") {
          return {
            ...state,
            focusTime: newTime,
            timeLeft,
          };
        }
        return {
          ...state,
          breakTime: newTime,
          timeLeft,
        };
      }
      return { ...state };
    }
    case DECREMENT: {
      if (state[action.payload] > 1) {
        let newTime = state[action.payload] - 1;
        let timeLeft = updateTimeLeft("subMin", action.payload, state);
        if (action.payload === "focusTime") {
          return {
            ...state,
            focusTime: newTime,
            timeLeft,
          };
        }
        return {
          ...state,
          breakTime: newTime,
          timeLeft,
        };
      }
      return { ...state };
    }
    case START_TIMER: {
      let timerSelector = action.timerSelector;
      return {
        ...state,
        started: true,
        timerSelector,
      };
    }
    case STOP_TIMER:
      return { ...state, started: false };
    case TICK_TOCK: {
      let timeBlock = state.timeBlock;
      let timeLeft = updateTimeLeft("subSec", timeBlock, state);
      if (state.timeLeft === "00:01") {
        timeBlock = state.timeBlock === "focusTime" ? "breakTime" : "focusTime"; // update to next timeBlock
      }
      return { ...state, timeBlock, timeLeft };
    }
    case RESET: {
      return {
        ...state,
        started: false,
        breakTime: 5,
        focusTime: 25,
        timeBlock: "focusTime",
        timeLeft: "25:00",
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default pomodoroReducer;
