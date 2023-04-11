sprint_index = JSON.parse(localStorage.getItem("sprint_index"));
sprints = JSON.parse(localStorage.getItem("Sprints"));
sprint = sprints[sprint_index];
tasks = sprint.tasks;
start_date = sprint.startdate;
end_date = sprint.enddate;
current_date = new Date().toISOString().slice(0, 10);
num_tasks = tasks.length;
team = JSON.parse(localStorage.getItem("members"));

const DATA_COUNT = team.length;

names = [];

// Pie chart
storyPoints = [];
function getColors(length) {
  let pallet = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"];
  let colors = [];

  for (let i = 0; i < length; i++) {
      colors.push(pallet[i % (pallet.length - 1)]);
  }

  return colors;
}

// Line chart
timeSpent = [];
date_tasks_completed = [];

start_date = sprint.startdate;
end_date = sprint.enddate;

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

const dates = getDates(start_date, end_date)

// Pie chart date
for(i = 0; i < DATA_COUNT; i++){
    member = team[i];

    names.push(member.username);

    storyPoints.push(member.totalStoryPoints);
}

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

"Pie chart"
const data = {
  labels: names,
  datasets: [
    {
      label: 'Completed storypoints',
      data: storyPoints,
      backgroundColor: getColors(storyPoints.length)
    }
  ]
};

const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Story points completed'
        }
      }
    },
  };

const myPieChart = new Chart(
    document.getElementById('myPieChart'),
    config
  );

"Line chart"
const labels2 = dates;

const data2 = {
  labels: labels2,
  datasets: [{
    label: 'Time spent by all team members',
    data: interpolateData(timeSpent),
    fill: false,
    backgroundColor: 'rgb(102, 0, 204)',
    borderColor: 'rgb(102, 0, 204)',
    tension: 0.1
  }]
};

const config2 = {
    type: 'line',
    data: data2,
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
    },
    
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config2
  );
