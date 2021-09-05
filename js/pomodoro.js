

class PomodoroTimer {
  constructor(mins, element, stopButton, finishButton, elemPomodoroNum, resetButton, typeTimerCallback){
    this.clickSound = new Audio('click-sound.wav');
    // typeTime represents if the timer is a pomodoro or is a break
    this.typeTimer = 'Pomodoro';
    // function that will be called when typeTimer change
    this.typeTimerCallback = typeTimerCallback;
    // stateTimer represents if timer is paused or not 
    this.stateTimer = false;
    this.elemPomodoroNum = elemPomodoroNum;
    this.elemPomodoroNum.textContent = 0;

    this.shortBreakTime = new Date(0, 0, 0, 0, 5);
    this.longBreakTime = new Date(0, 0, 0, 0, 20); 
    
    // for remember the minutes of the pomodoro
    this.pomodoroTime = mins;

    this.time = new Date(0, 0, 0, 0, mins-1, 59);
    this.countingTimer = null;

    this.element =  element;
    this.element.textContent = mins;

    this.resetButton = resetButton;
    this.stopButton = stopButton;
    this.finishButton = finishButton;
    this.finishButton.style.display = "none";

    // save the current number of pomodoros and verify if there are pomodoros 
    if(localStorage.getItem('pomodoroNumber') == null){
      localStorage.setItem('pomodoroNumber', 0);
      this.elemPomodoroNum.textContent = Number(localStorage.getItem('pomodoroNumber'));
    }else {
      this.elemPomodoroNum.textContent = Number(localStorage.getItem('pomodoroNumber'));
      this.elemPomodoroNum.style.display = "block";
      console.log(typeof localStorage.getItem('pomodoroNumber'));
    }

    this.resetButton.addEventListener('click', () => {
      this.clickSound.pause();
      this.clickSound.currentTime = 0;
      this.clickSound.play();
      this.resetTimer();
      this.element.textContent = this.time.getMinutes();
    });

    this.stopButton.addEventListener('click', () => {
      if (!this.stateTimer) {
        this.clickSound.pause();
        this.clickSound.currentTime = 0;
        this.clickSound.play();
        this.resumeTimer();
      } else {
        this.clickSound.pause();
        this.clickSound.currentTime = 0;
        this.clickSound.play();
        this.pauseTimer('REANUDAR', false); 
        this.finishButton.style.display = "block";
      }
    });  

    this.finishButton.addEventListener('click', () =>{
      this.clickSound.pause();
      this.clickSound.currentTime = 0;
      this.clickSound.play();
      this.skipTimer();
    });
  } // constructor ends

  // verify if the timer has finished and save the remaning time 
  startTimer(){
    if ((this.time.getMinutes() === 0) && (this.time.getSeconds() == 0)){
      this.pauseTimer('INICIAR', true);
      this.setTimer();     
    } else {
      this.time = new Date(this.time - new Date(1000));
      this.element.textContent = this.time.getMinutes() + ':' + this.time.getSeconds(); 
    }
  }
  // this function set a timer as its argument if it's defined else check if the previous timer is a pomodoro
  // or a break and if it is a break change the typeTimer to pomodoro and viceversa 
  setTimer(explicit){
    if ((this.typeTimer === 'short break' || this.typeTimer === 'long break') || explicit == 'Pomodoro'){
      this.typeTimer = 'Pomodoro';
      this.resetTimer(); 
      this.element.textContent = this.time.getMinutes();
      this.typeTimerCallback('pomodoro');
    } else if (((this.typeTimer === 'Pomodoro') && (Number(localStorage.getItem('pomodoroNumber')) % 3 === 0) && (Number(localStorage.getItem('pomodoroNumber')) !== 0)) || explicit == 'long break') {
      this.setBreak('long break');
    } else if (explicit == undefined || explicit == 'short break'){ 
      this.setBreak('short break');
    }
  }
  // pauses the timer and change the text of the button
  pauseTimer(textStopBtn, isStart){
    clearInterval(this.countingTimer);
    this.stopButton.textContent = textStopBtn;
    if (isStart){
      this.element.textContent = this.time.getMinutes();
      this.finishButton.style.display = "none";
    } else {
      this.element.textContent = this.time.getMinutes()+':'+this.time.getSeconds();
    }
    this.stateTimer = false;
  }
  // resumes the timer and make it works
  resumeTimer(){
    this.countingTimer = setInterval(() => {this.startTimer()}, 1000);
    this.stateTimer = true;
    this.stopButton.textContent = 'PAUSAR';
    this.finishButton.style.display = "none";
  }
  resetTimer(){
    if (this.typeTimer === 'Pomodoro'){
      this.time = new Date(0, 0, 0, 0, this.pomodoroTime);
    } else if (this.typeTimer == 'short break'){
      this.time = this.shortBreakTime;
    } else if (this.typeTimer == 'long break'){
      this.time = this.longBreakTime;
    }
  }
  
  skipTimer(){
    if (confirm("Desea pasar de este timer?")) {
      this.time = new Date(0, 0, 0, 0, 0, 0);
      this.startTimer();
    }
  }
  // change the timer to a break and add a pomodoro
  setBreak(breakType){
    if (breakType === 'short break'){
      this.time = this.shortBreakTime;
      this.typeTimer = 'short break';
      this.typeTimerCallback('short break');
    }
    if (breakType === 'long break'){
      this.time = this.longBreakTime;
      this.typeTimer = 'long break';
      this.typeTimerCallback('long break');
    }
    this.addPomodoro();
  }
  addPomodoro(){
    this.element.textContent = this.time.getMinutes();
    localStorage.setItem('pomodoroNumber', Number(localStorage.getItem('pomodoroNumber')) + 1);
    this.elemPomodoroNum.textContent = Number(localStorage.getItem('pomodoroNumber'));
    this.elemPomodoroNum.style.display = "block";
  }
  resetPomodoros(){
    localStorage.setItem('pomodoroNumber', 0);
    this.elemPomodoroNum.textContent = Number(localStorage.getItem('pomodoroNumber'));
    this.setTimer('Pomodoro');
  }
}

const stopButton = document.querySelector('#button-timer');
const finishButton = document.querySelector('#button-finish');
const timerElem = document.querySelector('#timer');
const pomodoroNumber = document.querySelector('#pomodoro-number');
const resetButton = document.querySelector('#reset-button');
const actualTimer = document.querySelector('#actual-timer');
const optionsButtons = document.querySelector('#options');

const timer = new PomodoroTimer(25, timerElem, stopButton, finishButton, pomodoroNumber, resetButton, (typeTimer) => {
  actualTimer.textContent = timer.typeTimer;
  if (typeTimer === 'pomodoro'){
    document.querySelector('#timer').style.backgroundColor = '#9e3f3f';
    document.querySelector('#timer').style.borderColor = '#8e2f2f';
  } else if (typeTimer == 'short break'){
    document.querySelector('#timer').style.backgroundColor = '#25cc8c';
    document.querySelector('#timer').style.borderColor = '#15bc7c';
  } else if (typeTimer == 'long break'){
    document.querySelector('#timer').style.backgroundColor = '#25cc8c';
    document.querySelector('#timer').style.borderColor = '#15bc7c';
  }
});

const resetPomodorosBtn = document.querySelector('#reset-pomodoros-btn');
console.log(resetPomodorosBtn);

resetPomodorosBtn.onclick = () => {
  timer.resetPomodoros();
};
actualTimer.textContent = timer.typeTimer;






