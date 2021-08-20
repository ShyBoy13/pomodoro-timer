class PomodoroTimer {
  constructor(mins, element, stopButton, finishButton, elemPomodoroNum, resetButton, typeTimerCallback){
    // typeTime represents if the timer is a pomodoro or is a break
    this.typeTimer = 'pomodoro';
    // function that will be called when typeTimer change
    this.typeTimerCallback = typeTimerCallback;
    // stateTimer represents if timer is paused or not 
    this.stateTimer = false;
    this.elemPomodoroNum = elemPomodoroNum;

    this.shortBreakTime = new Date(0, 0, 0, 0, 5);
    this.longBreakTime = new Date(0, 0, 0, 0, 20); 
    
    // for remember the minutes of the pomodoro
    this.initialTime = mins;

    this.pomodoroTime = new Date(0, 0, 0, 0, mins-1, 59);
    this.countingTimer = null;

    this.element =  element;
    this.element.textContent = mins;

    this.resetButton = resetButton;
    this.stopButton = stopButton;
    this.finishButton = finishButton;
    this.finishButton.style.display = "none";

    // save the current number of pomodoros and verify if there are pomodoros 
    if(sessionStorage.getItem('pomodoroNumber') == null){
      sessionStorage.setItem('pomodoroNumber', 1);
    }else {
      this.elemPomodoroNum.textContent = Number(sessionStorage.getItem('pomodoroNumber')) - 1;
      this.elemPomodoroNum.style.display = "block";
      console.log(typeof sessionStorage.getItem('pomodoroNumber'));
    }

    this.resetButton.addEventListener('click', () => {
      this.resetTimer();
      this.element.textContent = this.pomodoroTime.getMinutes();
    });

    this.stopButton.addEventListener('click', () => {
      if (!this.stateTimer) {
        this.resumeTimer();
        this.stopButton.textContent = 'PAUSAR';
        this.finishButton.style.display = "none";
      } else {
        this.pauseTimer('REANUDAR', true); 
        this.finishButton.style.display = "block";
      }
    });  

    this.finishButton.addEventListener('click', () =>{
      this.finishTimer();
    });
  } // constructor ends

  // verify if the timer has finished and save the remaning time 
  startTimer(){
    if ((this.pomodoroTime.getMinutes() === 0) && (this.pomodoroTime.getSeconds() == 0)){
      this.pauseTimer('INICIAR', false);
      this.checkTypeTimer();     
    } else {
      this.pomodoroTime = new Date(this.pomodoroTime - new Date(1000));
      this.element.textContent = this.pomodoroTime.getMinutes() + ':' + this.pomodoroTime.getSeconds(); 
    }
  }
  // this function check if the previous timer is a pomodoro or a break 
  checkTypeTimer(){
    // if it is a break change the typeTimer to pomodoro and viceversa 
    if (this.typeTimer === 'shortBreak' || this.typeTimer === 'longBreak'){
      this.typeTimer = 'pomodoro';
      this.resetTimer(); 
      this.element.textContent = this.pomodoroTime.getMinutes();
      this.typeTimerCallback('pomodoro');
    } else if ((this.typeTimer === 'pomodoro') && (Number(sessionStorage.getItem('pomodoroNumber')) % 4 === 0)) {
      this.setBreak('longBreak');
    } else { 
      this.setBreak('shortBreak');
    }
  }
  // pauses the timer and change the text of the button
  pauseTimer(textStopBtn, showSeconds){
    clearInterval(this.countingTimer);
    this.stopButton.textContent = textStopBtn;
    if (showSeconds && this.pomodoroTime.getSeconds() != 0){
      this.element.textContent = this.pomodoroTime.getMinutes()+':'+this.pomodoroTime.getSeconds();
    } else {
      this.element.textContent = this.pomodoroTime.getMinutes();
    }
    this.stateTimer = false;
  }
  // resumes the timer and make it works
  resumeTimer(){
    this.countingTimer = setInterval(() => {this.startTimer()}, 1000);
    this.stateTimer = true;
  }
  resetTimer(){
    if (this.typeTimer === 'pomodoro'){
      this.pomodoroTime = new Date(0, 0, 0, 0, this.initialTime);
    } else if (this.typeTimer == 'shortBreak'){
      this.pomodoroTime = this.shortBreakTime;
    } else if (this.typeTimer == 'longBreak'){
      this.pomodoroTime = this.longBreakTime;
    }
  }

  finishTimer(){
    if (confirm("Desea pasar de este timer?")) {
      this.pomodoroTime = new Date(0, 0, 0, 0, 0, 0);
      this.startTimer();
    }
  }
  // change the timer to a break and add a pomodoro
  setBreak(breakType){
    if (breakType === 'shortBreak'){
      this.pomodoroTime = this.shortBreakTime;
      this.typeTimer = 'shortBreak';
      this.typeTimerCallback('shortBreak');
    }
    if (breakType === 'longBreak'){
      this.pomodoroTime = this.longBreakTime;
      this.typeTimer = 'longBreak';
      this.typeTimerCallback('longBreak');
    }
    this.addPomodoro();
  }
  addPomodoro(){
    this.element.textContent = this.pomodoroTime.getMinutes();
    sessionStorage.setItem('pomodoroNumber', Number(sessionStorage.getItem('pomodoroNumber')) + 1);
    this.elemPomodoroNum.textContent = Number(sessionStorage.getItem('pomodoroNumber')) - 1;
    this.elemPomodoroNum.style.display = "block";
  }
}

const stopButton = document.querySelector('#button-timer');
const finishButton = document.querySelector('#button-finish');
const timerElem = document.querySelector('#timer');
const pomodoroNumber = document.querySelector('#pomodoro-number');
const resetButton = document.querySelector('#reset-button');
const actualTimer = document.querySelector('#actual-timer');

const timer = new PomodoroTimer(25, timerElem, stopButton, finishButton, pomodoroNumber, resetButton, (typeTimer) => {
  actualTimer.textContent = timer.typeTimer;
  if (typeTimer === 'pomodoro'){
    document.querySelector('body').style.backgroundColor = '#3e3e3e';
  } else if (typeTimer == 'shortBreak'){
    document.querySelector('body').style.backgroundColor = '#505050';
  } else if (typeTimer == 'longBreak'){
    document.querySelector('body').style.backgroundColor = '#505050';
  }
});

actualTimer.textContent = timer.typeTimer;




