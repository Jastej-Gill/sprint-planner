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
 * Adds task to array of tasks
 * @param {Array} TaskArray the array of tasks
 */
function addTask(TaskArray){
    let selected = [];
    member = 0
    //console.log("ok")
    for (let option of document.getElementById('tAssign').options){
      if (option.selected){
        let tObj = option.value;
        let temp = tObj.split(",");
        console.log(temp)
        
        member = new Members(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5]);
        
        console.log(temp);
        selected.push(member)
      }
    }
    console.log("ok2")
    TaskArray = JSON.parse(localStorage.getItem("Tasks"));
    let tName = document.getElementById("tName").value;
    let tType = document.getElementById("tType").value;
    let tTag = document.getElementById("tTag").value;
    let sPoint = document.getElementById("sPoint").value;
    let tDesc = document.getElementById("tDesc").value;
    let tStat = document.getElementById("tStat").value;
    let tPrio = document.getElementById("tPrio").value;
    let tAssign = selected;
    // let tAssign = document.getElementById("tAssign").value;
    let tDue = document.getElementById("tDue").value;

    if (checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)){
    newTask = new Task(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)
    
    let MemberArray = JSON.parse(localStorage.getItem("members"))
    // adding task to member
    for (i=0; i <= MemberArray.length; i++){
      console.log(MemberArray[i])
      console.log(MemberArray[i].username)
      console.log(member.username)
      if (MemberArray[i].username == member.username){
          MemberArray[i].assignedTask.push(newTask)
          // add story point
          let sp = parseInt(MemberArray[i].totalStoryPoints) + parseInt(sPoint)
          MemberArray[i].totalStoryPoints = sp
          break
      }
    }
    TaskArray.push(newTask);

    let taskArrayStr = JSON.stringify(TaskArray);
    localStorage.removeItem("Tasks");
    localStorage.setItem("Tasks", taskArrayStr);

    let memberArrayStr = JSON.stringify(MemberArray);
    localStorage.removeItem("members");
    localStorage.setItem("members", memberArrayStr);
    }else{
      openForm();
    }
}

/**
 * Edits task
 */
function editTask() {
  let selected = [];
  let member = 0
  //console.log("ok")
  for (let option of document.getElementById('tAssign').options){
    if (option.selected){
      let tObj = option.value;
      let temp = tObj.split(",");
      member = new Members(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5]);
      console.log(member);
      selected.push(member)
    }
  }

  
  console.log("hh")
  let TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  let BoardArray = JSON.parse(localStorage.getItem("board"));
  let SprintArray = JSON.parse(localStorage.getItem("Sprints"));

  let ori_member = TaskArray[editIndex].assigned_by
  console.log(ori_member)

  let ori_task_name = TaskArray[editIndex].name

  let tName = document.getElementById("tName").value;
  let tType = document.getElementById("tType").value;
  let tTag = document.getElementById("tTag").value;
  let sPoint = document.getElementById("sPoint").value;
  let tDesc = document.getElementById("tDesc").value;
  let tStat = document.getElementById("tStat").value;
  let tPrio = document.getElementById("tPrio").value;
  let tAssign = selected;
  let tDue = document.getElementById("tDue").value;
  console.log("he")
  console.log(BoardArray)
  if ((BoardArray!="") && (BoardArray!=null)){
    for (i=0; i <= BoardArray.length; i++){
      console.log("he")
        console.log(BoardArray)
        if (TaskArray[editIndex].name == BoardArray[i].name){
          if(checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)){
            
            TaskArray[editIndex].assigned_by = selected;

            let MemberArray = JSON.parse(localStorage.getItem("members"))
            // remove task from ori member
            console.log((ori_member))
            for (i=0; i <= MemberArray.length; i++){
              console.log(MemberArray[i])
              console.log(MemberArray[i].username)
              console.log(ori_member[0].username)
              if (MemberArray[i].username == ori_member[0].username){
                  // add story point
                  let sp = parseInt(MemberArray[i].totalStoryPoints) - parseInt(sPoint)
                  MemberArray[i].totalStoryPoints = sp
                  console.log("Marks done")
                  console.log("why")
                  // remove task from old member
                  let old_mem_task = MemberArray[i].assignedTask
                  console.log(old_mem_task)
                  console.log("heelo")
                  
                  for (j=0; j <= old_mem_task.length; j++) {
                    console.log(old_mem_task[j].name)
                    console.log(TaskArray[editIndex].name)
                    if (old_mem_task[j].name == TaskArray[editIndex].name){
                      old_mem_task.splice(j,1);
                      console.log(old_mem_task)
                      MemberArray[i].assignedTask = old_mem_task;
                      console.log("slice")
                      console.log(MemberArray[i].assignedTask)
                      break
                    }
                  }
                  break
              }
            }
            // add task to new member
            for (i=0; i <= MemberArray.length; i++){
              console.log(MemberArray[i])
              console.log(MemberArray[i].username)
              console.log(member.username)
              if (MemberArray[i].username == member.username){
                  // add story point
                  let sp = parseInt(MemberArray[i].totalStoryPoints) + parseInt(sPoint)
                  MemberArray[i].totalStoryPoints = sp
                  // add task to new member
                  
                  MemberArray[i].assignedTask.push(TaskArray[editIndex])
                  console.log(MemberArray[i].assignedTask)
                  break
              }
            }
            
            TaskArray[editIndex].name = tName;
            TaskArray[editIndex].type = tType;
            TaskArray[editIndex].tag = tTag;
            TaskArray[editIndex].point = sPoint;
            TaskArray[editIndex].desc = tDesc;
            TaskArray[editIndex].stat = tStat;
            TaskArray[editIndex].priority = tPrio;
            
    
            console.log(TaskArray[editIndex].assigned_by )
            TaskArray[editIndex].due_date = tDue;
            let taskArrayStr = JSON.stringify(TaskArray);
            localStorage.removeItem("Tasks");
            localStorage.setItem("Tasks", taskArrayStr);

            let MemberArrayStr = JSON.stringify(MemberArray);
            localStorage.removeItem("members");
            localStorage.setItem("members", MemberArrayStr);

            BoardArray.splice(editIndex, 1, TaskArray[editIndex])
            if ((TaskArray[editIndex].inSprint)== true){
              SprintArray[JSON.parse(localStorage.getItem("sprint_index"))].tasks.splice(editIndex, 1, TaskArray[editIndex]);
              localStorage.removeItem("Sprints");
              localStorage.setItem("Sprints", JSON.stringify(SprintArray));
            }

            location.reload();
          }
      }
    }
  }
    else{
      console.log("he")
      if(checkFields(tName, tType, tTag, sPoint, tDesc, tStat, tPrio, tAssign, tDue)){
        
        TaskArray[editIndex].assigned_by = selected;

        // remove task from ori member
        console.log((ori_member))
        for (i=0; i <= MemberArray.length; i++){
          console.log(MemberArray[i])
          console.log(MemberArray[i].username)
          console.log(ori_member[0].username)
          if (MemberArray[i].username == ori_member[0].username){
              // add story point
              let sp = parseInt(MemberArray[i].totalStoryPoints) - parseInt(sPoint)
              MemberArray[i].totalStoryPoints = sp
              // remove task from old member
              let old_mem_task = MemberArray[i].assignedTask
              
              for (j=0; j <= old_mem_task.length; j++) {
                console.log(old_mem_task[j].name)
                console.log(TaskArray[editIndex].name)
                if (old_mem_task[j].name == TaskArray[editIndex].name){
                  old_mem_task.splice(j,1);
                  // console.log(old_mem_task)
                  MemberArray[i].assignedTask = old_mem_task;
                  // console.log("slice")
                  // console.log(MemberArray[i].assignedTask)
                  break
                }
              }
              break
          }
        }

        TaskArray[editIndex].name = tName;
        TaskArray[editIndex].type = tType;
        TaskArray[editIndex].tag = tTag;
        TaskArray[editIndex].point = sPoint;
        TaskArray[editIndex].desc = tDesc;
        TaskArray[editIndex].stat = tStat;
        TaskArray[editIndex].priority = tPrio;
        
        console.log(TaskArray[editIndex].assigned_by )
        TaskArray[editIndex].due_date = tDue;


        // add task to new member
        for (i=0; i <= MemberArray.length; i++){
          console.log(MemberArray[i])
          console.log(MemberArray[i].username)
          console.log(member.username)
          if (MemberArray[i].username == member.username){
              // add story point
              let sp = parseInt(MemberArray[i].totalStoryPoints) + parseInt(sPoint)
              MemberArray[i].totalStoryPoints = sp
              // add task to new member
              
              MemberArray[i].assignedTask.push(TaskArray[editIndex])
              console.log(MemberArray[i].assignedTask)
              break
          }
        }
        

        let taskArrayStr = JSON.stringify(TaskArray);
        localStorage.removeItem("Tasks");
        localStorage.setItem("Tasks", taskArrayStr);

        let MemberArrayStr = JSON.stringify(MemberArray);
        localStorage.removeItem("members");
        localStorage.setItem("members", MemberArrayStr);

        location.reload();
      }
    }
  }

/**
 * Deletes task from array of tasks
 * @param {number} index index of task in task array
 */
function deleteTask(index){
  let TaskArray = JSON.parse(localStorage.getItem("Tasks"));
  let boardArray = JSON.parse(localStorage.getItem("board"));
  let MemberArray = JSON.parse(localStorage.getItem("members"))
  
  let ori_member = TaskArray[editIndex].assigned_by;
  let sPoint = TaskArray[editIndex].point;
  console.log(boardArray)
  if (((boardArray!="") && (boardArray!=null))){
    for (i=0; i <= boardArray.length; i++){
      if (TaskArray[editIndex].name == boardArray[i].name){
        // remove task from ori member
        console.log((ori_member))
        for (i=0; i <= MemberArray.length; i++){
          console.log(MemberArray[i])
          console.log(MemberArray[i].username)
          console.log(ori_member[0].username)
          if (MemberArray[i].username == ori_member[0].username){
              // add story point
              let sp = parseInt(MemberArray[i].totalStoryPoints) - parseInt(sPoint)
              MemberArray[i].totalStoryPoints = sp
              // console.log("Marks done")
              // console.log("why")
              // remove task from old member
              let old_mem_task = MemberArray[i].assignedTask
              // console.log(old_mem_task)
              // console.log("heelo")
              
              for (j=0; j <= old_mem_task.length; j++) {
                console.log(old_mem_task[j].name)
                console.log(TaskArray[editIndex].name)
                if (old_mem_task[j].name == TaskArray[editIndex].name){
                  old_mem_task.splice(j,1);
                  // console.log(old_mem_task)
                  MemberArray[i].assignedTask = old_mem_task;
                  // console.log("slice")
                  // console.log(MemberArray[i].assignedTask)
                  break
                }
              }
              break
          }
        }
        TaskArray.splice(index, 1);

        let taskArrayStr = JSON.stringify(TaskArray);
        localStorage.removeItem("Tasks");
        localStorage.setItem("Tasks", taskArrayStr);

        let MemberArrayStr = JSON.stringify(MemberArray);
        localStorage.removeItem("members");
        localStorage.setItem("members", MemberArrayStr);

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
    }
  }
  else{
      {
        let ori_member = TaskArray[editIndex].assigned_by;
        console.log(ori_member)
        debugger
        let sPoint = TaskArray[editIndex].point;

        // remove task from ori member
        console.log((ori_member))
        for (i=0; i <= MemberArray.length; i++){
          console.log(MemberArray[i])
          console.log(MemberArray[i].username)
          console.log(ori_member[0].username)
          if (MemberArray[i].username == ori_member[0].username){
              // add story point
              let sp = parseInt(MemberArray[i].totalStoryPoints) - parseInt(sPoint)
              MemberArray[i].totalStoryPoints = sp
              // console.log("Marks done")
              // console.log("why")
              // remove task from old member
              let old_mem_task = MemberArray[i].assignedTask
              console.log(old_mem_task)
              // console.log("heelo")
              
              for (j=0; j <= old_mem_task.length; j++) {
                console.log(old_mem_task[j])
                console.log(old_mem_task[j].name)
                console.log(TaskArray[editIndex].name)
                if (old_mem_task[j].name == TaskArray[editIndex].name){
                  old_mem_task.splice(j,1);
                  // console.log(old_mem_task)
                  MemberArray[i].assignedTask = old_mem_task;
                  // console.log("slice")
                  // console.log(MemberArray[i].assignedTask)
                  break
                }
              }
              break
          }
        }

        //delete task in task array
        console.log(index)
        TaskArray.splice(index, 1);

        let taskArrayStr = JSON.stringify(TaskArray);
        localStorage.removeItem("Tasks");
        localStorage.setItem("Tasks", taskArrayStr);

        let MemberArrayStr = JSON.stringify(MemberArray);
        localStorage.removeItem("members");
        localStorage.setItem("members", MemberArrayStr);

        closeDeletePop();
        location.reload();
      }

  }
}

/**
 * Displays task
 * @param {Array} TaskArray the array of tasks
 */
function displayTasks(TaskArray) {
  
  //Clear display
  container = document.getElementById("cards");
  container.innerHTML = "";
  num_cards_in_row = 6
  // Get row number
  number_of_rows = Math.ceil(TaskArray.length/num_cards_in_row)

  
  
  output = "";
  
  j = 0;

  // For each row
  for(i = 1; i < number_of_rows + 1; i++)
  {
    
    // Add row start 
    output += 
        ` <div class="mdl-grid ">
            <div class="mdl-layout-spacer"></div>`

      while(j < num_cards_in_row*i && j < TaskArray.length)
      {
        output += 
        `
          <div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell--3-col">
            <h3>${TaskArray[j].name}</h3>
            <div class="content">
              <div class="Attributes">
                <p>Tag: ${TaskArray[j].tag}</p>
                <p>Priority: ${TaskArray[j].priority}</p>
                <p>Story Point: ${TaskArray[j].point}</p>
              </div>
            </div>
            <div class="buttons">
              <div class="features">
                <ul>
                  <li class="Info"><span class="material-symbols-outlined" onclick="openInfoPop(${j})">info</span></li>
                  <li class="Edit"><span class="material-symbols-outlined" onclick="openEditForm(${j})")>edit</span></li>
                  <li class="Delete"><span class="material-symbols-outlined" onclick="openDeletePop(${j})">delete</span></li>
                </ul>
              </div>
            </div>
          </div>`
        j++;
      }

    // Add row end
    output += `   <div class="mdl-layout-spacer"></div>
                </div>` 
  }  

  container.innerHTML = output;

}

/**
 * Opens task information popup
 * @param {number} index index of task
 */
function openInfoPop(index){
  popup = document.getElementById("info-popup");
  console.log(index);
  member_name_arr = [];
  member_arr = TaskArray[index].assigned_by;
  for(i=0; i <= member_arr.length-1; i++){
    let temp = member_arr[i].username;
    member_name_arr.push(temp);
  }
  output = 
    `
    <div class = "form-container">
      <h4><b>Task Details<b></h4>
      
      <p><b>Task Name:  </b>${TaskArray[index].name}</h4>
      
      <p><b>Task Type:  </b>${TaskArray[index].type}</p>
      
      <p><b>Task Tag:  </b>${TaskArray[index].tag}</p>
      
      <p><b>Story Points:  </b>${TaskArray[index].point}</p>
      
      <p><b>Task Description:  </b>${TaskArray[index].desc}</p>
      
      <p><b>Task Status:  </b>${TaskArray[index].stat}</p>
      
      <p><b>Task Priority:  </b>${TaskArray[index].priority}</p>
      
      <p><b>Task Assignee:  </b>${member_name_arr}</p>

      <p><b>Due Date:  </b>${TaskArray[index].due_date}</p>
      <div>
        <button class="popup-button" onclick="closeInfoPop()" id="close_info_btn">Close</button>
      </div>
    </div>` ;

    popup.innerHTML = output;

    popup.style.display = "block";
    document.getElementById("close_info_btn").style.opacity = 0.8;
}

/**
 * Closes task information popup
 */
function closeInfoPop(){
  document.getElementById("info-popup").style.display = "none";
  //document.getElementById("close_info_button").style.opacity = 0;
}

/**
 * Opens task delete popup
 * @param {number} index index of task
 */
function openDeletePop(index){
  popup = document.getElementById("deletePop");
  //document.getElementById("delete_btn").style.opacity = 0.8;
  //document.getElementById("cancel_btn").style.opacity = 0.8;
  output = 
  `
        <div>
          <h4 class="delete_title"><b>Delete Task?<b></h4>
        </div>
        <div>
          <p class="delete_message">
            Deleted tasks are not recoverable.
          </p>
        </div>                                          
        <div>
          <button class="popup-button" onclick="deleteTask(${index})" id="task_delete">Confirm delete</button>
          <button class="popup-button" onclick="closeDeletePop()" id="cancel_delete">Cancel</button>
        </div>
      </div>
  `
  popup.innerHTML = output;
  popup.style.display = "block";
  //document.getElementById("delete_btn").style.opacity = 0.8;
  //document.getElementById("cancel_btn").style.opacity = 0.8;

}     

/**
 * Closes task delete popup
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
  let addTaskHTML = `<button class="popup-button" onclick="addTask(TaskArray); closeForm()" id="addTaskButton">Add Task</button>
                     <button class="popup-button" onclick="closeForm()" id = "closeTaskButton">Close</button>`;
  document.getElementById("submitDetailsButton").innerHTML = addTaskHTML;
  document.getElementById("myForm").style.display = "block";
  document.getElementById("createTaskButton").style.opacity = 0;
}

/**
 * Clears add task popup
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

/**
 * Closes add task popup
 */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("createTaskButton").style.opacity = 0.8;
}

/**
 * Opens edit task popup
 * @param {number} index index of task
 */
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
  let editTaskHTML = `<button type="button" class="popup-button" onclick="editTask(); closeForm()" id="addTaskButton">Edit Task</button>
                      <button type="button" class="popup-button" onclick="closeForm()" id = "closeTaskButton">Close</button>`;
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
 * Clears tasks
 */
function clearDisplay(){
  let emptArr = [];
  displayTasks(emptArr);
}

/**
 * Filters tasks displayed
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


