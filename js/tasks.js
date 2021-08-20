const checkTaskList = (list) => {
  let len = list.children.length; 
   
  for (let elem of  list.children){
    elem.setAttribute('position', len);
    len -= 1;
  }
};

const deleteTask = (list, taskToDelete) => {
  taskToDelete.remove();
  checkTaskList(list);
  // send to server
};

const createTaskElement = (list, taskInfo) => {
  let taskElement = document.createElement('div');
  let deleteTaskBtn = document.createElement('button');
  let doneTask = document.createElement('input');
  
  doneTask.type = 'checkbox';

  deleteTaskBtn.textContent = 'delete';
  deleteTaskBtn.className = 'delete-task-btn';
  deleteTaskBtn.addEventListener('click', () => {
    deleteTask(list, taskElement);
  });
  
  taskElement.className = "single-task";
  taskElement.id = taskInfo.id;
  taskElement.textContent = taskInfo.text;
  taskElement.style.backgroundColor = taskInfo.color;
  taskElement.setAttribute('position', taskInfo.position);

  taskElement.append(deleteTaskBtn);
  taskElement.prepend(doneTask);

  return taskElement;
};

const addTask = (list, element, input) => {
  // Send task to the server
  input.value = '';
  checkInput(input);

  list.prepend(element);  

  checkTaskList(list);
};

const textToTask = (inputText, inputColor, inputTitle) => {
  let taskObj = {
    id: 0,
    title: inputTitle,
    text: inputText, 
    color: inputColor, 
    done: false,
    position: undefined, 
  };
  
  return taskObj;
};

const checkInput = (input) => {
  if (input.value.trim() == ''){
    addTaskBtn.disabled = true;
  } else { 
    addTaskBtn.disabled = false;
  }
};

const taskList = document.querySelector('#task-list');
const addTaskBtn = document.querySelector('#add-task-btn');
const createTaskText = document.querySelector('#create-task-text');

// console.log(taskList.firstElementChild.getAttribute('hola'));
createTaskText.addEventListener('input', () => {
  checkInput(createTaskText);
});

addTaskBtn.addEventListener('click', () => {
  addTask(taskList, createTaskElement(taskList, textToTask(createTaskText.value)), createTaskText);
});




