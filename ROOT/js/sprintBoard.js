let editIndex = 0;

/**
 * Checks for empty fields
 * @param {string} tName task name
 * @param {string} tType task type
 * @param {string} tTag task tag
 * @param {string} sPoint task story point
 * @param {string} tDesc task description
 * @param {string} tStat task statistics
 * @param {string} tPrio task priority
 * @param {string} tAssign member task is assigned to
 */
function checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign){
  if(tName == "" || tType == "" || tTag == "" || sPoint =="" || tDesc == "" || tStat == "" || tPrio == "" || tAssign == ""){
    window.alert("Empty fields found, please fill in all the fields and try again.");
    return false;
  }else{
    return true;
  }
}

/**
 * Adds task to sprint board
 */
function addTask(){
    TaskArray = JSON.parse(localStorage.getItem("Tasks"));
    let tName = document.getElementById("tName").value;
    let tType = document.getElementById("tType").value;
    let tTag = document.getElementById("tTag").value;
    let sPoint = document.getElementById("sPoint").value;
    let tDesc = document.getElementById("tDesc").value;
    let tStat = document.getElementById("tStat").value;
    let tPrio = document.getElementById("tPrio").value;
    let tAssign = document.getElementById("tAssign").value;
    let tDue = document.getElementById("tDue").value;

    if (checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)){
    newTask = new Task(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)

    TaskArray.push(newTask);

    let taskArrayStr = JSON.stringify(TaskArray);
    localStorage.removeItem("Tasks");
    localStorage.setItem("Tasks", taskArrayStr);
    let BoardArray = JSON.parse(localStorage.getItem("board"));
    BoardArray.push(newTask);
    localStorage.removeItem("board");
    localStorage.setItem("board", JSON.stringify(BoardArray));
    let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
    SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.push(newTask);
    localStorage.removeItem("Sprints");
    localStorage.setItem("Sprints", JSON.stringify(SprintArray));
    location.reload();
    }else{
      openForm();
    }
}

/**
 * Edits task in sprint board
 */
function editTask() {
    // let TaskArray = [];
    // temp = JSON.parse(localStorage.getItem("Tasks"));
    // if (temp != null){
    //     for (let i = 0; i < temp.length; i++){
    //       TaskArray.push(temp[i]);
    //     }  
    // }
    TaskArray = JSON.parse(localStorage.getItem("Tasks"));
    let tName = document.getElementById("tName").value;
    let tType = document.getElementById("tType").value;
    let tTag = document.getElementById("tTag").value;
    let sPoint = document.getElementById("sPoint").value;
    let tDesc = document.getElementById("tDesc").value;
    let tStat = document.getElementById("tStat").value;
    let tPrio = document.getElementById("tPrio").value;
    let tAssign = document.getElementById("tAssign").value;
    let tDue = document.getElementById("tDue").value;

    if(checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)){
      TaskArray[editIndex].name = tName;
      TaskArray[editIndex].type = tType;
      TaskArray[editIndex].tag = tTag;
      TaskArray[editIndex].point = sPoint;
      TaskArray[editIndex].desc = tDesc;
      TaskArray[editIndex].stat = tStat;
      TaskArray[editIndex].priority = tPrio;
      TaskArray[editIndex].assigned_by = tAssign;
      TaskArray[editIndex].due_date = tDue;
  
      let taskArrayStr = JSON.stringify(TaskArray);
      localStorage.removeItem("Tasks");
      localStorage.setItem("Tasks", taskArrayStr);
      let BoardArray = JSON.parse(localStorage.getItem("board"));
      BoardArray.splice(editIndex, 1, TaskArray[editIndex])
      localStorage.removeItem("board");
      localStorage.setItem("board",JSON.stringify(BoardArray));
      let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
      SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(editIndex, 1, TaskArray[editIndex]);
      localStorage.removeItem("Sprints");
      localStorage.setItem("Sprints", JSON.stringify(SprintArray));
      location.reload();
    }
}    

/**
 * Deletes task in sprint board
 * @param {number} index index of task in task array
 */
function deleteTask(index){
  TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  boardArray = JSON.parse(localStorage.getItem("board"))
  //for(var i = 0; i < TaskArray.length; i++) {
  //  if(TaskArray[i] == task) {
  //      TaskArray.splice(i, 1);
  //      break;
  //  }
  //}
  TaskArray.splice(index, 1);
  let taskArrayStr = JSON.stringify(TaskArray);
  localStorage.removeItem("Tasks");
  localStorage.setItem("Tasks", taskArrayStr);
  boardArray.splice(index, 1);
  localStorage.removeItem("board");
  localStorage.setItem("board", JSON.stringify(boardArray));
  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(index, 1);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", JSON.stringify(SprintArray));
  closeDeletePop();
  location.reload();
}

/**
 * Displays tasks in sprint board
 * @param {Array} TaskArray the array of tasks
 */
function displayTasks(TaskArray) {

  // notStarted = document.getElementById("Not Started");
  // inProgress = document.getElementById("In Progress");
  // completed = document.getElementById("Completed")

  let kanbanBlocks = document.getElementsByClassName("kanban-block")
  for (let i = 0; i < kanbanBlocks.length; i++) {
      console.log(kanbanBlocks[i].getAttribute("id"));
      kanbanBlocks[i].innerHTML = `<div class = "kanban-blocktitle"> <strong>${kanbanBlocks[i].getAttribute("id")}</strong><div>`;
  }


  // For each row
  for(let j = 0; j < TaskArray.length; j++)
  {
      // // change time from ms to hours
      let time = new Date(Math.floor(TaskArray[j].total_time)).toISOString().slice(11, 19)
      // Add row start 
      output = 
      ` <div class="mdl-grid ">
         <div class="mdl-layout-spacer"></div>`;
      // For each task    
      output += 
      `<div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell--3-col" id="task${j}" draggable="true" ondragstart="drag(event)">
        <h3>${TaskArray[j].name}</h3>
        <div class="content">
          <div class="Attributes">
            <p>Tag: ${TaskArray[j].tag}</p>
            <p>Priority: ${TaskArray[j].priority}</p>
            <p>Story Point: ${TaskArray[j].point}</p>
            <p>Time accumulated: ${time} hours</p>
          </div>
        </div>
        <div class="buttons">
          <div class="features">
            <ul>
              <li class="Info"><span class="material-symbols-outlined" onclick="openInfoPop(${j})">info</span></li>
              <li class="StartTimer"><span class="material-symbols-outlined" onclick="startTimer(${j})" id="start_btn" >timer</span></li>
              <li class="StopTimer"><span class="material-symbols-outlined" onclick="stopTimer(${j})">timer_off</span></li>
              <li class="CompleteTimer"><span class="material-symbols-outlined" onclick="completeTimer(${j})">check_circle</span></li>
            </ul>
          </div>
        </div>
      </div>`;

      // Add row end
      output += `   <div class="mdl-layout-spacer"></div>
                  </div>`;
      
      document.getElementById(TaskArray[j].stat).innerHTML += output;
  }
     

  // container.innerHTML = output;

}

/**
 * Opens task information popup
 * @param {number} index index of task in task array
 */
function openInfoPop(index){
  popup = document.getElementById("info-popup");
  console.log(index);
  member_name_arr = [];
  member_arr = TaskArray[index].assigned_by;
  console.log(member_arr)
  for(i=0; i <= member_arr.length-1; i++){
    let temp = member_arr[i].username;
    member_name_arr.push(temp);
  }
  let member = TaskArray[index].assigned_by[0].username;
  output = 
    `
    <div class = "form-container">
      <h4><b>Task Details<b></h4>
      
      <p>Task name: ${TaskArray[index].name}</h4>
      <br>
      
      <p>Task Type: ${TaskArray[index].type}</p>
      <br>
      
      <p>Task Tag: ${TaskArray[index].tag}</p>
      <br>
      
      <p>Story Points: ${TaskArray[index].point}</p>
      <br>
      
      <p>Task Description: ${TaskArray[index].desc}</p>
      <br>
      
      <p>Task Status: ${TaskArray[index].stat}</p>
      <br>
      
      <p>Task Priority: ${TaskArray[index].priority}</p>
      <br>
      
      <p>Task Assignee: ${member}</p>
      <br>
      
      <p><b>Due Date:  </b>${TaskArray[index].due_date}</p>

      <div>
        <button class="cancel_btn" onclick="closeInfoPop()" id="close_info_btn">Close</button>
      </div>
    </div>` ;

    popup.innerHTML = output;

    popup.style.display = "block";
    document.getElementById("close_info_btn").style.opacity = 0.8;
    document.getElementById("start_timer_btn").style.opacity = 0.8;
    document.getElementById("close_timer_btn").style.opacity = 0.8;
    document.getElementById("complete_timer_btn").style.opacity = 0.8;
}

/**
 * Ends timer for each task
 * @param {number} index index of task in task array
 */
function completeTimer(index){
  TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  let task = TaskArray[index];
  task.stat = "Completed";
  TaskArray[index].stat = "Completed";
  
  // update timer for member
  member = TaskArray[index].assigned_by[0].username;
  //member_info =member.split(",");
  console.log(member);
  team = JSON.parse(localStorage.getItem("members"));
  // Update member story point
  for (i=0; i <= team.length; i++){
    if (team[i].username == member){
        team[i].totalStoryPoints += 1;
        break
    }
  }

  let memberArrayStr = JSON.stringify(team);
  localStorage.removeItem("members");
  localStorage.setItem("members", memberArrayStr);
  let taskArrayStr = JSON.stringify(TaskArray);
  localStorage.removeItem("Tasks");
  localStorage.setItem("Tasks", taskArrayStr);
  let BoardArray = JSON.parse(localStorage.getItem("board"));
  BoardArray.splice(index, 1, TaskArray[index])
  localStorage.removeItem("board");
  localStorage.setItem("board",JSON.stringify(BoardArray));
  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(index, 1, TaskArray[index]);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", JSON.stringify(SprintArray));

  location.reload();
  displayTasks(BoardArray);
  closeInfoPop();

}

/**
 * Starts timer for task
 * @param {number} index index of task in task array
 */
function startTimer(index){
  TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  let task = TaskArray[index];
  if (task.running==true){
    console.log("Timer has started! Return")
    alert("Task has already started!")
    closeInfoPop();
    return
  }
  task.stat = "In Progress";
  TaskArray[index].stat = "In Progress";
  task.running = true
  console.log(task.running)
  let start = new Date()
  task.start_time = start;
  console.log(start);
  TaskArray[index].start_time = start;
  TaskArray[index].running = true;
  console.log(TaskArray[index])
  let taskArrayStr = JSON.stringify(TaskArray);
  localStorage.removeItem("Tasks");
  localStorage.setItem("Tasks", taskArrayStr);
  let BoardArray = JSON.parse(localStorage.getItem("board"));
  BoardArray.splice(index, 1, TaskArray[index])
  localStorage.removeItem("board");
  localStorage.setItem("board",JSON.stringify(BoardArray));
  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(index, 1, TaskArray[index]);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", JSON.stringify(SprintArray));
  location.reload();
  displayTasks(BoardArray);
  closeInfoPop();
}

/**
 * Stops timer for task
 * @param {number} index index of task in task array
 */
function stopTimer(index){
  TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  console.log("Timer stops")
  let task = TaskArray[index];
  if (!task.running){
      console.log("Timer has not start!")
      alert("Task has not started yet!")
      closeInfoPop();
      return
  }
  task.running = false;
  let endTime = new Date();
  console.log(TaskArray[index].start_time)
  start = new Date(TaskArray[index].start_time)
  console.log(start)
  const miliseconds = parseFloat((endTime.getTime() - start.getTime()));
  let new_total_time = parseFloat(task.total_time) + miliseconds;
  task.total_time = parseFloat(new_total_time).toFixed(2);

  console.log(task.total_time)
  TaskArray[index].running = false;
  TaskArray[index].start = 0;
  TaskArray[index].total_time = parseFloat(new_total_time).toFixed(2);

  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
  let sprint_total_time = parseFloat(SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].total_time)
  new_st = sprint_total_time+miliseconds;

  // update timer for member
  let member = TaskArray[index].assigned_by[0].username;
  //member_info =member.split(",");
  console.log(member);
  let MemberArray = JSON.parse(localStorage.getItem("members"));
  // get member time
  for (i=0; i <= MemberArray.length; i++){
    console.log(MemberArray[i]);
    console.log(MemberArray[i].username);
    console.log(member);
    if (MemberArray[i].username == member){
        let total = MemberArray[i].totalTimeSpent+miliseconds;
        console.log(total);
        MemberArray[i].totalTimeSpent = total;
        break
    }
  }
  let memberArrayStr = JSON.stringify(MemberArray);
  localStorage.removeItem("members");
  localStorage.setItem("members", memberArrayStr);
  let taskArrayStr = JSON.stringify(TaskArray);
  localStorage.removeItem("Tasks");
  localStorage.setItem("Tasks", taskArrayStr);
  let BoardArray = JSON.parse(localStorage.getItem("board"));
  BoardArray.splice(index, 1, TaskArray[index])
  localStorage.removeItem("board");
  localStorage.setItem("board",JSON.stringify(BoardArray));
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].total_time = new_st;
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(index, 1, TaskArray[index]);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", JSON.stringify(SprintArray));
  
  location.reload();
  displayTasks(BoardArray);
  closeInfoPop();

}

/**
 * Closes task information popup
 */
function closeInfoPop(){
  document.getElementById("info-popup").style.display = "none";
  //document.getElementById("close_info_button").style.opacity = 0;
}

/**
 * Opens delete task popup
 * @param {number} index index of task in task array
 */
function openDeletePop(index){
  popup = document.getElementById("deletePop");
  //document.getElementById("delete_btn").style.opacity = 0.8;
  //document.getElementById("cancel_btn").style.opacity = 0.8;
  output = 
  `
        <div>
          <p class="delete_title"> DeleteTask</p>
        </div>
        <div>
          <p class="delete_message">
            Deleted task is not removable.
          </p>
        </div>                                          
        <div>
          <button class="delete_btn" onclick="deleteTask(${index})" id="task_delete">Confirm delete</button>
          <button class="cancel_btn" onclick="closeDeletePop()" id="cancel_delete">Cancel</button>
        </div>
      </div>
  `
  popup.innerHTML = output;
  popup.style.display = "block";
  //document.getElementById("delete_btn").style.opacity = 0.8;
  //document.getElementById("cancel_btn").style.opacity = 0.8;

}     


/**
 * Closes delete task information 
 */
function closeDeletePop(){
  document.getElementById("deletePop").style.display = "none";
  //document.getElementById("delete_btn").style.opacity = 0;
  //document.getElementById("cancel_btn").style.opacity = 0;

}


/**
 * Opens add task popup
 */
function openForm() {
  clearForm();
  document.getElementById("formTitle").innerText = "Add Task";
  let addTaskHTML = `<button type="button" class="button" onclick="addTask(); closeForm()" id="addTaskButton">Add Task</button>
                     <button type="button" class="btn cancel" onclick="closeForm()" id = "closeTaskButton">Close</button>`;
  document.getElementById("submitDetailsButton").innerHTML = addTaskHTML;
  document.getElementById("myForm").style.display = "block";
  document.getElementById("createTaskButton").style.opacity = 0;
}


/**
 * Clears add task form
 */
function clearForm() {
  document.getElementById("tName").value = "";
  document.getElementById("tType").value = "";
  document.getElementById("tTag").value = "";
  document.getElementById("sPoint").value = "";
  document.getElementById("tDesc").value = "";
  document.getElementById("tStat").value = "";
  document.getElementById("tPrio").value = "";
  document.getElementById("tAssign").value = "";
  document.getElementById("tDue").value = "";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("createTaskButton").style.opacity = 0.8;
}

function openEditForm(index) {
  editIndex = index;

  document.getElementById("tName").value = TaskArray[index].name;
  document.getElementById("tType").value = TaskArray[index].type;
  document.getElementById("tTag").value = TaskArray[index].tag;
  document.getElementById("sPoint").value = TaskArray[index].point;
  document.getElementById("tDesc").value = TaskArray[index].desc;
  document.getElementById("tStat").value = TaskArray[index].stat;
  document.getElementById("tPrio").value = TaskArray[index].priority;
  document.getElementById("tAssign").value = TaskArray[index].assigned_by;
  document.getElementById("tDue").value = TaskArray[index].due_date;

  document.getElementById("formTitle").innerText = "Edit Task";
  let editTaskHTML = `<button type="button" class="button" onclick="editTask(); closeForm()" id="addTaskButton">Edit Task</button>
                      <button type="button" class="btn cancel" onclick="closeForm()" id = "closeTaskButton">Close</button>`;
  document.getElementById("submitDetailsButton").innerHTML = editTaskHTML;
  document.getElementById("myForm").style.display = "block";
}


/**
 * Closes edit task popup
 */
function closeEditForm() {
  document.getElementById("myForm").style.display = "none";
}


/**
 * Clears task display
 */
function clearDisplay(){
  let emptArr = [];
  displayTasks(emptArr);
}


/**
 * Filters through tasks based on their attributes
 */
function filterTasks(){
  clearDisplay();
  let filteredTaskArray = [];
  let temp = document.getElementById("tTagFilt").value;
  if (temp != ""){
    for (let i = 0; i < TaskArray.length; i++){
      if (TaskArray[i].tag == temp){
          filteredTaskArray.push(TaskArray[i]);
      }
    }
    displayTasks(filteredTaskArray);
  }else{
    displayTasks(TaskArray);
  }
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(`data: ${data}`);
  ev.currentTarget.appendChild(document.getElementById(data));
  TaskArray[parseInt(data[4])].stat = ev.currentTarget.getAttribute("id");

  let taskArrayStr = JSON.stringify(TaskArray);
  localStorage.removeItem("Tasks");
  localStorage.setItem("Tasks", taskArrayStr);
  let BoardArray = JSON.parse(localStorage.getItem("board"));
  BoardArray.splice(editIndex, 1, TaskArray[editIndex])
  localStorage.removeItem("board");
  localStorage.setItem("board",JSON.stringify(BoardArray));
  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));
  SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(editIndex, 1, TaskArray[editIndex]);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", JSON.stringify(SprintArray));
  location.reload();
} 
