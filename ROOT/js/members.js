
/**
 * Opens form for adding members
 */
function openForm() {
document.getElementById("formTitle").innerText = "Add Member";
let addTaskHTML = `<button type="button" class="button" onclick="addMember(MemberArray); closeForm()" id="addMemberButton">Add Member</button>
                   <button type="button" class="btn cancel" onclick="closeForm()" id = "closeMemberButton">Close</button>`;
document.getElementById("submitDetailsButton").innerHTML = addTaskHTML;
document.getElementById("myForm").style.display = "block";
document.getElementById("createSprintButton").style.opacity = 0;
}

/**
 * Clears form
 */
function clearForm() {
  document.getElementById("tName").value = "";
  document.getElementById("tStart").value = "";
  document.getElementById("tEnd").value = "";
}

/**
 * Closes form
 */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("createSprintButton").style.opacity = 0.8;
}

/**
 * Adds member to array of members
 * @param {Array} MemberArray the array of members
 */
function addMember(MemberArray){
  let empt_arr = [];
  let username = document.getElementById("mName").value;
  let email = document.getElementById("mMail").value;
  let password = document.getElementById("mPass").value;
  if(checkFields(username, email, password) && checkEmail(email)){
    let member = new Members(username, email, password, empt_arr);
    MemberArray.push(member);
    localStorage.removeItem("members");
    localStorage.setItem("members", JSON.stringify(MemberArray));
    displayMembers(MemberArray);
  }
}

/**
 * Displays members in members page
 * @param {Array} MemberArray the array of members
 */
function displayMembers(MemberArray) {

  //Clear display
  container = document.getElementById("cards");
  container.innerHTML = "";
  num_cards_in_row = 4
  // Get row number
  number_of_rows = Math.ceil(MemberArray.length/num_cards_in_row)

  
  
  output = "";
  
  j = 0;

  // For each row
  for(i = 1; i < number_of_rows + 1; i++)
  {
    
    
    // Add row start 
    output += 
        ` <div class="mdl-grid ">
            <div class="mdl-layout-spacer"></div>`
      while(j < num_cards_in_row*i && j < MemberArray.length)
      {
        let time = new Date(Math.floor(MemberArray[j].totalTimeSpent)).toISOString().slice(11, 19);

        task_name_arr = [];
        task_arr = MemberArray[j].assignedTask;
        for(i=0; i <= task_arr.length-1; i++){
          let temp = task_arr[i].name;
          task_name_arr.push(temp);
        }
        output += 
        `
          <div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell--3-col">
            <h3>${MemberArray[j].username}</h3>
            <div class="content">
              <div class="Attributes">
                <p>Email: ${MemberArray[j].email}</p>
                <p>Password: ${MemberArray[j].password}</p>
                <p>Story Point: ${MemberArray[j].totalStoryPoints}</p>
                <p>Total Time Spent: ${time}</p>
                <p>Assigned Tasks: ${task_name_arr}</p>
              </div>
            </div>
            <div class="buttons">
              <div class="features">
                <ul>
                  <li class="Info"><span class="material-symbols-outlined" onclick="openInfo(${j})">info</span></li>
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
 * Shows member info
 * @param {number} index index of member in MemberArray
 */
function openInfo(index){
  localStorage.setItem('memberIndex', index);
  window.location.href = "memberStats.html";
}

/**
 * Opens delete member popup
 * @param {number} index index of member in MemberArray
 */
function openDeletePop(index){
  popup = document.getElementById("deletePop");
 
  output = 
  `
        <div>
          <p class="delete_title"> Delete this Member</p>
        </div>
        <div>
          <p class="delete_message">
            Deleted Members are not recoverable.
          </p>
        </div>                                          
        <div>
          <button class="delete_btn" onclick="deleteMember(${index})" id="member_delete">Confirm delete</button>
          <button class="cancel_btn" onclick="closeDeletePop()" id="cancel_delete">Cancel</button>
        </div>
      </div>
  `
  popup.innerHTML = output;
  popup.style.display = "block";

}

/**
 * Closes delete popup
 */
function closeDeletePop(){
  document.getElementById("deletePop").style.display = "none";

}

/**
 * Deletes member
 * @param {number} index index of member in MemberArray
 */
function deleteMember(index){
  MemberArray.splice(index, 1);
  let MemberArrayStr = JSON.stringify(MemberArray);
  localStorage.removeItem("members");
  localStorage.setItem("members", MemberArrayStr);
  displayMembers(MemberArray);
  closeDeletePop();
}

/**
 * Opens edit member popup
 * @param {number} index index of member in MemberArray
 */
function openEditForm(index) {
  editIndex = index;

  document.getElementById("mName").value = MemberArray[index].username;
  document.getElementById("mMail").value = MemberArray[index].email;
  document.getElementById("mPass").value = MemberArray[index].password;
  


  document.getElementById("formTitle").innerText = "Edit Member Details";
  let editSprintHTML = `<button type="button" class="button" onclick="editMember(); closeForm()" id="editmemberButton">Edit Member</button>
                      <button type="button" class="btn cancel" onclick="closeForm()" id = "closememberButton">Close</button>`;
  document.getElementById("submitDetailsButton").innerHTML = editSprintHTML;
  document.getElementById("myForm").style.display = "block";
}

function closeEditForm() {
  document.getElementById("myForm").style.display = "none";
}

function clearDisplay(){
  let emptArr = [];
  displayMembers(emptArr);
}

/**
 * Edits member details
 */
function editMember() {
  let username = document.getElementById("mName").value
  let email = document.getElementById("mMail").value;
  let password = document.getElementById("mPass").value;

  if(checkFields(username, email, password)){
    MemberArray[editIndex].username = username;
    MemberArray[editIndex].email = email;
    MemberArray[editIndex].password = password;

    let MemberArrayStr = JSON.stringify(MemberArray);
    localStorage.removeItem("members");
    localStorage.setItem("members", MemberArrayStr);
    displayMembers(MemberArray);
  }
}

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
 * Checks for valid email
 * @param {string} email 
 */
function checkEmail(email){
  let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(email.match(mailFormat)){
    return true;
  }else{
    window.alert("Invalid Email address detected")
    return false;
  }
}