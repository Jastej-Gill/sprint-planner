let MembersArray = [];
temp = JSON.parse(localStorage.getItem("members"));
if (temp != null){
  for (let i = 0; i < temp.length; i++){
    MembersArray.push(temp[i]);
  }
}

/**
 * Checks for empty fields
 * @param {string} username the username
 * @param {string} password the password
 */
function checkFields(username, password) {
    if (username == "" || password == "") {
        window.alert("Empty fields found, please fill in all the fields and try again.");
        return false;
    }
    else {
        return true;
    }
}

/**
 * Checks if username and password valid
 * @param {string} username the username
 * @param {string} password the password
 */
function validDetails(username, password) {
    if (username == "admin" && password == "admin"){
        return true;
    }
    for (let i = 0; i < MembersArray.length; i++) {
        if (username == MembersArray[i].username) {
            if (password == MembersArray[i].password) {
                return true;
            }
            window.alert("Password does not match the given username, please try again");
            return false;
        }
    }
    window.alert("Username is invalid, please try again");
    return false;
}


/**
 * Logs user in
 */
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (checkFields(username, password)) {
        if (validDetails(username, password)) {
            window.location.href = "productBacklog.html";
        }
    }
}