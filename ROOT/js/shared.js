class Task {
  
  constructor(name, type, tag, point, desc, stat, priority, assigned_by, due_date) {
    this.name = name;
    this.type = type;
    this.tag = tag;
    this.point = point;
    this.desc = desc;
    this.stat = stat;
    this.priority = priority;
    this.assigned_by = assigned_by;
    this.total_time = 0;
    this.running = 0;
    this.start_time = 0;
    this.due_date = due_date;
    
  }
  get InSprint(){
    return this.inSprint;
  }

  set InSprint(newInSprint){
    this.inSprint = newInSprint
  }
  
  get Running(){
    return this.running;
  }

  set Running(new_run){
    this.running = new_run;
  }

  get Start_time(){
    return this.start_time;
  }

  set Start_time(new_start){
    this.start_time = new_start;
  }
    
  get Total_time(){
    return this.total_time;
  }
  
  set Total_time(new_total_time){
    this.total_time = new_total_time
  }

  get Name() {
    return this.name;
  }

  set Name(newName) {
    this.name = newName;
  }

  get Type() {
    return this.type;
  }

  set Type(newType) {
    this.type = newType;
  }

  get Tag() {
    return this.tag;
  }

  set Tag(newTag) {
    this.tag = newTag;
  }

  get Point() {
    return this.point;
  }

  set Point(newPoint) {
    this.point = newPoint;
  }

  get Desc() {
    return this.desc;
  }

  set Desc(newDesc) {
    this.desc = newDesc;
  }

  get Stat() {
    return this.stat;
  }

  set Stat(newStat) {
    this.stat = newStat;
  }

  get Priority() {
    return this.priority;
  }

  set Priority(newPriority) {
    this.priority = newPriority;
  }

  get AssignedBy() {
    return this.assigned_by;
  }

  set AssignedBy(newAssignedBy) {
    this.assigned_by = newAssignedBy;
  }

  get DueDate() {
    return this.due_date;
  }

  set DueDate(newDueDate) {
    this.due_date = newDueDate;
  }
}

class Members{
  constructor(username, email, password, aTasks){
      this.username = username;
      this.email = email;
      this.password = password;
      this.assignedTask = aTasks;
      this.totalStoryPoints = 0;
      this.totalTimeSpent = 0;
  }

  get Username(){
      return this.username;
  }

  get Email(){
      return this.email;
  }

  get Password(){
      return this.password;
  }

  get AssignedTask(){
      return this.assignedTask;
  }

  get TotalStoryPoints(){
      return this.totalStoryPoints;
  }

  get TotalTimeSpent(){
      return this.totalTimeSpent;
  }
}
