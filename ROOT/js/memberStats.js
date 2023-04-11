tasks = JSON.parse(localStorage.getItem("Tasks"));
current_date = new Date().toISOString().slice(0, 10);
num_tasks = tasks.length;
team = JSON.parse(localStorage.getItem("members"));
member_index = JSON.parse(localStorage.getItem("memberIndex"));
member = team[member_index];
const DATA_COUNT = team.length;

// Custom header
header = document.getElementById("pageTitle");
header.innerHTML = `<h2>${member.username + "'s statistics"}</h2>`;


// Line chart
timeSpent = [];
date_tasks_completed = [];

earliestDate = "";
latestDate = "";
for(i = 0; i < num_tasks; i++){
  task = tasks[i]

  taskStartDate = task.start_time.substring(0, 10);

  if(earliestDate == ""){
    earliestDate = taskStartDate;
  }
  
  if(latestDate == ""){
    latestDate = task.due_date;
  }
  
  else if(Date.parse(taskStartDate) < Date.parse(earliestDate)){
    earliestDate = taskStartDate;
  }

  else if(Date.parse(task.due_date) > Date.parse(latestDate)){
    latestDate = task.due_date;
  }
}

// Convert miliseconds to time string
function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

start_date = earliestDate;
end_date = latestDate;

/**
 * Creates an array of dates from start date to stop date
 * @param {date} startDate the start date
 * @param {date} stopDate the stop date
 */
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

/**
 * Gets task with matching name
 * @param {string} name task name
 */
function getTaskByName(name) {
  for(i=0; i < tasks.length; i++){
    task = tasks[i];

    if(task.name == name){
      return task;
    }
  }
}

const dates = getDates(start_date, end_date)

// Line chart date
// For each date get total time if date == task deadline

// Initialise array
for(i=0; i < dates.length; i++){
  timeSpent[i] = 0;
}

// Getting dates tasks were completed
for(i =0; i < num_tasks; i++){
  task = tasks[i];
  if(task.stat == 'Completed'){
    date_tasks_completed.push(task.due_date);
  }
}

// Sort dates
date_tasks_completed.sort(function(a, b) { 
  a = new Date(a);
  b = new Date(b);
  return a > b ? -1 : a < b ? 1 : 0;
 })
date_tasks_completed = date_tasks_completed.reverse();

function getTaskByDate(date){
  for(k = 0; k < tasks.length; k++){
    if(tasks[k].stat == 'Completed' && tasks[k].due_date == date){
      return tasks[k];
    }
  }
}

// Loop through each date
// Check if date equals date_task_completed
// Get time spent on task with the same due date
// Add time spent to timeSpent array
cumulativeTimeSpent = 0;
for(i = 0; i < dates.length; i++) {

  for(j = 0; j < date_tasks_completed.length; j++){

    if(dates[i] == date_tasks_completed[j]) {
      completedTask = getTaskByDate(dates[i]);
      console.log(timeSpent);
      cumulativeTimeSpent += parseInt(completedTask.total_time);
      timeSpent[i] = cumulativeTimeSpent/1000; // Convert to seconds
    }
    else {
      timeSpent[i] = cumulativeTimeSpent/1000;
    }
  }
}

/**
 * Calculates average hours spent on task on a day
 */
function calculateAverage(){
  startDate = document.getElementById("startDate").value
  endDate = document.getElementById("endDate").value

  totalTime = 0;

  memberTasks = member.assignedTask;
  if(Date.parse(startDate) > Date.parse(endDate)){
    alert("Invalid date input");
  }
  // No input
  else if(!startDate || !endDate){
    alert("No date input provided");
  }

  else{
    datesOutput =  getDates(startDate, endDate);

    console.log(datesOutput);

    numberOfDays = datesOutput.length;

    for(i = 0; i < memberTasks.length; i++){
      task = memberTasks[i];
      console.log(task);
      console.log(i);
      if(task.stat == 'Completed' || task.stat == 'In Progress'){
        taskRet = getTaskByName(task.name);
        console.log(taskRet);
        if(Date.parse(taskRet.due_date) >= Date.parse(startDate) && Date.parse(taskRet.due_date) <= Date.parse(endDate)){
          totalTime += taskRet.total_time;
          console.log(totalTime);
        }
      }
    }

    averageHours = Math.floor(totalTime/dates.length);
    document.getElementById("averageHours").innerHTML = ` <h5>Average hours: ${msToTime(averageHours)}</h5>`;
  }
}

/**
 * Creates data points in between solitary data points
 * @param {Array} data array of data (tasks remaining)
 */
function interpolateData(data){
  uniqueVal = 0;
  uniqueValIndex = 0;
  uniqueValues = [0];
  valueTracker = [];

  for(i = 1; i < data.length; i++){
    if(data[i] != uniqueVal){
      uniqueVal = data[i];
      uniqueValues.push(uniqueVal);
      valueTracker.push(uniqueVal);
    }
    else{
      uniqueValues.push(NaN);
    }
  }

  // Check for NaN towards the end of dataSet
  for(i = uniqueValues.length - 1; i >= 0; i--){
    console.log(i);
    if(Number.isNaN(uniqueValues[i]) && valueTracker.length > 0){
      console.log("In");
      uniqueValues[i] = valueTracker[valueTracker.length - 1];
    }
    else{
      break;
    }
  }

  return uniqueValues;

}

"Line chart"
const labels = dates;
label1 = "Time spent by " + member.username;

const data = {
  labels: labels,
  datasets: [{
    label: label1,
    data: interpolateData(timeSpent),
    fill: false,
    backgroundColor: 'rgb(255, 188, 0)',
    borderColor: 'rgb(255, 188, 0)',
    tension: 0.1,
  }]
};

const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Total time'
        }
      },
      spanGaps: true,
      scales: {x: { title: { display: true, text: 'Dates' }},
        y: { title: { display: true, text: 'Time spent(s)', position: 'left' }}
        
        },
    }
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
