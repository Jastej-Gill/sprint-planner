sprint_index = JSON.parse(localStorage.getItem("sprint_index"));
sprints = JSON.parse(localStorage.getItem("Sprints"));
sprint = sprints[sprint_index];
tasks = sprint.tasks;
start_date = sprint.startdate;
end_date = sprint.enddate;
current_date = new Date().toISOString().slice(0, 10);
num_tasks = tasks.length;

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

const dates = getDates(start_date, end_date)

ideal = []
num = 0
for(i=0; i < dates.length; i++) {
    num += num_tasks/dates.length;
    ideal.push(num);
}

ideal[dates.length - 1] = tasks.length;

date_tasks_completed = [];
remaining_tasks_by_day = [];
tasks_completed_by_day = [];

// Initialise array
for(i=0; i<dates.length; i++){
  remaining_tasks_by_day[i] = null;
  tasks_completed_by_day[i] = 0;
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

for(j = 0; j < dates.length; j++) {
  
  for(i = 0; i < date_tasks_completed.length; i++) {
    date = date_tasks_completed[i]
    if(dates[j] == date) {
      num_tasks -= 1;
      remaining_tasks_by_day[j] = num_tasks;
      tasks_completed_by_day[j] += 1;
    } 
    else {
      remaining_tasks_by_day[j] = num_tasks;
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
  uniqueValues = [data[0]];
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

  const data = {
    labels: dates,
    datasets: [{
      label: 'Ideal burndown',
      backgroundColor: 'rgb(102, 0, 204)',
      borderColor: 'rgb(102, 0, 204)',
      data: ideal.reverse(),
      order: 1, 
      type: 'line'
    },
    {
      label: 'Tasks remaining',
      backgroundColor: 'rgb(255, 188, 0)',
      borderColor: 'rgb(255, 188, 0)',
      data: remaining_tasks_by_day,
      order: 0,
      type: 'line'
    },
    {
      label: 'Estimated burndown',
      backgroundColor: 'rgb(0, 0, 0)',
      borderColor: 'rgb(0, 0, 0)',
      data: interpolateData(remaining_tasks_by_day),
      order: 2,
      type: 'line'
    },  
    {
      label: 'Tasks completed',
      data: tasks_completed_by_day,
      backgroundColor: 'rgb(192, 192, 192)',
      borderColor: 'rgb(192, 192, 192)',
      order: 3
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    
    options: {
      responsive: true,
      
      scales: {x: { title: { display: true, text: 'Dates' }},
                 y: { title: { display: true, text: 'Number of tasks', position: 'left' }}
                 
            },
        layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 5,
                  bottom: 5
                }
          },
      spanGaps: true,
      },
      

  };

  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
