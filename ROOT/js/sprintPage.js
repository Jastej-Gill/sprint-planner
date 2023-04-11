class Sprint {
  
  constructor(name,start_date,end_date,tasks) {
    this.name = name;
    this.stat = 0;
    this.startdate = start_date;
    this.enddate = end_date;
    this.tasks = tasks
    this.total_time = 0

    let curr_date = new Date();
    console.log(curr_date);
    let start = new Date(this.startdate).getTime();
    let end = new Date(this.enddate).getTime();

    if (start > curr_date.getTime()){
      this.stat = "Not Started";
    }
    else if ((start < curr_date.getTime()) && (end > curr_date.getTime())){
      this.stat = "In Progress";
    }
    else{
      this.stat = "Completed";
    }
   
  }

  get Name() {
    return this.name;
  }

  set Name(newName) {
    this.name = newName;
  }

  get StartDate() {
      return this.startdate;
  }
  
  set StartDate(new_start_date) {
      this.startdate = new_start_date;
  }

  get EndDate() {
      return this.Enddate;
  }
  
  set EndDate(new_start_date) {
      this.enddate = new_start_date;
  }


  get Stat() {
    return this.stat;
  }

  set Stat(newStat) {
    this.stat = newStat;
  }

  get TotalTime() {
      return this.total_time;
    }
  
    set TotalTime(newTime) {
      this.total_time = newTime;
    }


}

let editIndex = 0;

/**
 * Checks for empty fields
 * @param {string} tName task name
 * @param {string} tStart task start
 * @param {string} tEnd task end
 */
function checkFields(tName, tStart, tEnd ){
  if(tName == "" || tStart =="" || tEnd ==""){
    window.alert("Empty fields found, please fill in all the fields and try again.");
    return false;
  }else{
    return true;
  }
}

/**
 * Adds sprint to array of sprints
 * @param {Array} SprintArray the array of sprints
 */
function addSprint(SprintArray){
    let selected = [];
    for (let option of document.getElementById('tTask').options){
      if (option.selected){
        let tObj = option.value;
        let temp = tObj.split(",");
        let task = new Task(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7], temp[11]);
        console.log(temp);
        selected.push(task)
      }
    }
    let tName = document.getElementById("tName").value;
    let tStart = document.getElementById("tStart").value;
    let tTasks = selected;
    let tEnd = document.getElementById("tEnd").value;
    
    if (checkFields(tName,tStart,tEnd)){
    newSprint = new Sprint(tName,tStart,tEnd,tTasks)

    SprintArray.push(newSprint);

    let SprintArrayStr = JSON.stringify(SprintArray);
    localStorage.removeItem("Sprints");
    localStorage.setItem("Sprints", SprintArrayStr);
    displaySprints(SprintArray);
    }else{
      openForm();
    }
}

/**
 * Edits sprint
 */
function editSprint() {
    let selected = [];
    for (let option of document.getElementById('tTask').options){
      if (option.selected){
        let tObj = option.value;
        let temp = tObj.split(",");
        let task = new Task(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7]);
        selected.push(task)
      }
    }
    let tName = document.getElementById("tName").value;
    let tStart = document.getElementById("tStart").value;
    let tEnd = document.getElementById("tEnd").value;

    if(checkFields(tName,tStart,tEnd)){
      SprintArray[editIndex].name = tName;
      SprintArray[editIndex].startdate = tStart;
      SprintArray[editIndex].enddate = tEnd;
      SprintArray[editIndex].tasks = selected;
  
      let SprintArrayStr = JSON.stringify(SprintArray);
      localStorage.clear;
      localStorage.setItem("Sprints", SprintArrayStr);
      displaySprints(SprintArray);
    }
}    

/**
 * Deletes sprint from array of sprints
 * @param {number} index index of sprint in sprint array
 */
function deleteSprint(index){
  SprintArray.splice(index, 1);
  let SprintArrayStr = JSON.stringify(SprintArray);
  localStorage.removeItem("Sprints");
  localStorage.setItem("Sprints", SprintArrayStr);
  localStorage.removeItem("board")
  displaySprints(SprintArray);
  closeDeletePop();
}

/**
 * Displays sprints
 * @param {Array} SprintArray the array of sprints
 */
function displaySprints(SprintArray) {
  
  //Clear display
  container = document.getElementById("cards");
  container.innerHTML = "";
  
  // Number of cards in each row
  num_cards_in_row = 4
  // Get row number
  number_of_rows = Math.ceil(SprintArray.length/num_cards_in_row)
  

  output = "";
  
  j = 0;

  // For each row
  for(i = 1; i < number_of_rows + 1; i++)
  {
    
    // Add row start 
    output += 
        ` <div class="mdl-grid ">
            <div class="mdl-layout-spacer"></div>`

      while(j < num_cards_in_row*i && j < SprintArray.length)
      {
        // check status
        let status = 0;
        let curr_date = new Date();
        let start = new Date(SprintArray[j].startdate);
        let end = new Date(SprintArray[j].enddate)
        if (start.getTime() > curr_date.getTime()){
          status = "Not Started";
        }
        else if ((start.getTime() < curr_date.getTime()) && (end.getTime() > curr_date.getTime())){
          status = "In Progress";
        }
        else{
          status = "Completed";
        }
        SprintArray[j].stat = status;
        let SprintArrayStr = JSON.stringify(SprintArray);
        localStorage.clear;
        localStorage.setItem("Sprints", SprintArrayStr);

        // change time from ms to hours
        let time = new Date(SprintArray[j].total_time).toISOString().slice(11, 19);
        if (SprintArray[j].stat == "Not Started"){
          output += 
          `
            <div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell--4-col">
              <h3>${SprintArray[j].name}</h3>
              <div class="content">
                <div class="Attributes">
                <p>Start Date: ${SprintArray[j].startdate}</p>
                <p>End date: ${SprintArray[j].enddate}</p>
                <p>Total time spent: ${time} hours</p>
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
        }else{
          output += 
        `
          <div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell--4-col">
            <h3>${SprintArray[j].name}</h3>
            <div class="content">
              <div class="Attributes">
              <p>Start Date: ${SprintArray[j].startdate}</p>
              <p>End date: ${SprintArray[j].enddate}</p>
              <p>Total time spent: ${time} hours</p>
              </div>
            </div>
            <div class="buttons">
              <div class="features">
                <ul>
                  <li class="Info"><span class="material-symbols-outlined" onclick="openInfoPop(${j})">info</span></li>
                  <li class="Delete"><span class="material-symbols-outlined" onclick="openDeletePop(${j})">delete</span></li>
                </ul>
              </div>
            </div>
          </div>`
        j++;
        }
      }

    // Add row end
    output += `   <div class="mdl-layout-spacer"></div>
                </div>` 
  }  

  container.innerHTML = output;

}

/**
 * Opens sprint information popup
 * @param {number} index index of sprint in sprint array
 */
function openInfoPop(index){
  popup = document.getElementById("info-popup");
  task_name_arr = [];
  task_arr = SprintArray[index].tasks;
  for(i=0; i <= task_arr.length-1; i++){
    let temp = task_arr[i].name;
    task_name_arr.push(temp);
  }
  let status = 0;
  // check status
  let curr_date = new Date();
  let start = new Date(SprintArray[index].startdate);
  let end = new Date(SprintArray[index].enddate)
  if (start.getTime() > curr_date.getTime()){
    status = "Not Started";
  }
  else if ((start.getTime() < curr_date.getTime()) && (end.getTime() > curr_date.getTime())){
    status = "In Progress";
  }
  else{
    status = "Completed";
  }
  SprintArray[index].stat = status;
  let SprintArrayStr = JSON.stringify(SprintArray);
  localStorage.clear;
  localStorage.setItem("Sprints", SprintArrayStr);
  output = 
    `
    <div class = "form-container">
      <h4><b>Sprint Details<b></h4>
      
      <p>Sprint name: ${SprintArray[index].name}</p>
      
      <p>Sprint Status: ${SprintArray[index].stat}</p>

      <p>Sprint Tasks: ${task_name_arr}</p>

      <div>
        <button class="cancel_btn" onclick="closeInfoPop()" id="close_info_btn">Close</button>
        <button class="cancel_btn" onclick="goSprintBoard(${index})" id="go_sBoard_btn">Sprint Board</button>
      </div>
    </div>` ;

    popup.innerHTML = output;

    popup.style.display = "block";
    document.getElementById("close_info_btn").style.opacity = 0.8;
}

/**
 * Closes sprint information popup
 */
function closeInfoPop(){
  document.getElementById("info-popup").style.display = "none";
  //document.getElementById("close_info_button").style.opacity = 0;
}

/**
 * Goes to sprint board of sprint
 * @param {number} index index of sprint in sprint array
 */
function goSprintBoard(index){
  board_task = SprintArray[index].tasks;
  localStorage.setItem("board", JSON.stringify(board_task));
  localStorage.setItem("sprint_index", JSON.stringify(index))
  window.location.href = "sprintBoard.html"
}

/**
 * Opens delete sprint popup
 * @param {number} index index of sprint in sprint array
 */
function openDeletePop(index){
  popup = document.getElementById("deletePop");
  //document.getElementById("delete_btn").style.opacity = 0.8;
  //document.getElementById("cancel_btn").style.opacity = 0.8;
  output = 
  `
        <div>
          <p class="delete_title"> DeleteSprint</p>
        </div>
        <div>
          <p class="delete_message">
            Deleted Sprint is not removable.
          </p>
        </div>                                          
        <div>
          <button class="delete_btn" onclick="deleteSprint(${index})" id="Sprint_delete">Confirm delete</button>
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
 * Opens delete sprint popup
 */
function closeDeletePop(){
  document.getElementById("deletePop").style.display = "none";
  //document.getElementById("delete_btn").style.opacity = 0;
  //document.getElementById("cancel_btn").style.opacity = 0;

}

/**
 * Opens add sprint popup
 */
function openForm() {
  clearForm();
document.getElementById("formTitle").innerText = "Add Sprint";
let addTaskHTML = `<button type="button" class="button" onclick="addSprint(SprintArray); closeForm()" id="addSprintButton">Add Sprint</button>
                   <button type="button" class="btn cancel" onclick="closeForm()" id = "closeSprintButton">Close</button>`;
document.getElementById("submitDetailsButton").innerHTML = addTaskHTML;
document.getElementById("myForm").style.display = "block";
document.getElementById("createSprintButton").style.opacity = 0;
}

/**
 * Clears add sprint popup
 */
function clearForm() {
  document.getElementById("tName").value = "";
  document.getElementById("tStart").value = "";
  document.getElementById("tEnd").value = "";
}

/**
 * Closes add sprint popup
 */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("createSprintButton").style.opacity = 0.8;
}

/**
 * Opens edit sprint popup
 * @param {number} index index of sprint in sprint array
 */
function openEditForm(index) {
  editIndex = index;

  document.getElementById("tName").value = SprintArray[index].name;
  document.getElementById("tStart").value = SprintArray[index].startdate;
  document.getElementById("tEnd").value = SprintArray[index].enddate;
  


  document.getElementById("formTitle").innerText = "Edit Sprint";
  let editSprintHTML = `<button type="button" class="button" onclick="editSprint(); closeForm()" id="addSprintButton">Edit Sprint</button>
                      <button type="button" class="btn cancel" onclick="closeForm()" id = "closeSprintButton">Close</button>`;
  document.getElementById("submitDetailsButton").innerHTML = editSprintHTML;
  document.getElementById("myForm").style.display = "block";
}

/**
 * Closes edit sprint popup
 */
function closeEditForm() {
  document.getElementById("myForm").style.display = "none";
}

/**
 * Clears sprints
 */
function clearDisplay(){
  let emptArr = [];
  displaySprints(emptArr);
}


