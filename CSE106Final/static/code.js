// Hashing function, used to obfuscate passwords so they cannot be easily retreived from the database
function hash(str) {
    // Custom seed/"Salt" for hash function
    let seed = 69420727;

    // I'm gonna be honest idk what the rest of this function is I stole it off stack overflow
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
        
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// Login function, called when you press Log In
async function readLogin() {
    // Reads username and password and assigns them to a value
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    // Hashes password
    password = hash(password);
    
    // Calls the PASS function in /student as seen in index.py, assigns reply to variable data
    const response = await fetch('http://127.0.0.1:5000/userdata', {
        method: 'PASS', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})});
    const data = await response.text();

    // Sets message on the login page to display result of log-in attempt
    document.getElementById("message").innerHTML = data;

    

    // If the log-in was successful, the message will begin with 'S' and you will be redirected to the page for your user (rest seen in /student/username in index.py)
    if (data.charAt(0) == 'S') {
        studentName = data.substring(data.indexOf("Hello")+1, data.indexOf("!")) 
        location.href = "userdata/" + username;
    }
}

// Log out function, called when you press Log Out
async function logOut() {
    // Calls LOGOUT function in /student as seen in index.py, redirects to log-in page
    const response = await fetch('http://127.0.0.1:5000/student', {method: 'LOGOUT'});
    location.href = "http://127.0.0.1:5000/";
}

async function initialize() {
    //fillTableCurrClasses(table);
    getName();
    getProfilePicture();
    fillPosts();
}

async function fillPosts() {
    // Calls CLASSES function in /student as seen in index.py, resultant information is saved in data
    const response = await fetch('http://127.0.0.1:5000/userdata', { method: 'GETFEED',});
    var postData = await response.text();
    console.log(postData);

    var postingUserData = "{";

    var datac = postData;
    var userlist = "";
    datac = datac.substring(2);
    var counter = 0;
    while(true) {
        userlist += datac.substring(0, datac.indexOf(',')) + ", ";
        if (datac.indexOf("(") == -1) break;
        datac = datac.substring(datac.indexOf("(")+1);
        counter++;
        if (counter > 50) {
            console.log("L")
            break;
        }
    }

    var user;
    while (true) {
        counter++;
        if (counter > 50) {
            console.log("L")
            break;
        }
        user = userlist.substring(0, userlist.indexOf(","));
        userlist = userlist.substring(userlist.indexOf(",")+2);

        const response = await fetch('http://127.0.0.1:5000/userdata/' + user, { method: 'PULLINFO',});
        var userinfo = await response.text();

        postingUserData += "(" + user + ", ";
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf("'")+1);
        postingUserData += userinfo.substring(0, userinfo.indexOf("'")) + ", ";
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf(",")+1);
        userinfo = userinfo.substring(userinfo.indexOf("'")+1);
        postingUserData += userinfo.substring(0, userinfo.indexOf("'")) + "), ";

        if (userlist.indexOf(",") == -1) break;
    }
    console.log(postingUserData);

    document.getElementById("postList").innerHTML = "";
    postList = document.getElementById("postList");

    //<h3 class="user"><img src="../static/images/profilePicture.png" class="postAvatar"></img>John</h3>
    //        <h3><img src="../static/images/profilePicture.png" class="postImage"></img></h3>
    //        <h3>Description</h3>

    var currentUser = -1;
    var currentUsername = "Null";
    var currentProfile = "404";
    var postingUserDatac = postingUserData;
    var currentpostedImage = "Null";
    var currentpostedMessage = "";
    
    while(true) {
        counter++;
        if (counter > 50) {
            console.log("L")
            break;
        }
        postData = postData.substring(postData.indexOf("(")+1);
        currentUser = postData.substring(0, postData.indexOf(","));
        console.log("Current User: " + currentUser)
        while(true) {
            postingUserDatac = postingUserDatac.substring(postingUserDatac.indexOf("(")+1);
            if (currentUser == postingUserDatac.substring(0, postingUserDatac.indexOf(","))) break;
            if (postingUserDatac.indexOf("(") == -1) return "WTF";
            console.log(postingUserDatac);
            counter++;
            if (counter > 50) {
                console.log("L")
                break;
            }
        }
        console.log("Current User: " + currentUser)
        postingUserDatac = postingUserDatac.substring(postingUserDatac.indexOf(",")+1);
        currentUsername = postingUserDatac.substring(0, postingUserDatac.indexOf(","));
        postingUserDatac = postingUserDatac.substring(postingUserDatac.indexOf(",")+2);
        currentProfile = postingUserDatac.substring(0, postingUserDatac.indexOf(")"));
        postingUserDatac = postingUserData;

        postData = postData.substring(postData.indexOf(",")+3);
        currentpostedMessage = postData.substring(0, postData.indexOf(",")-1);
        postData = postData.substring(postData.indexOf(",")+3);
        currentpostedImage = postData.substring(0, postData.indexOf(")")-1);
        if (currentUser == '') break;
        
        postList.innerHTML += '<h3 class="user"><img src="../static/images/userdata/' + currentUser +"/profile/" + currentProfile +  '" class="postAvatar"></img>' + currentUsername + '</h3>';
        postList.innerHTML += '<h3><img src="../static/images/userdata/' + currentUser +"/posts/" + currentpostedImage +  '" class="postImage"></img></h3>'
        postList.innerHTML += '<h3>' + currentpostedMessage + '</h3>'



        
        if (postData.indexOf("(") == -1) break;
    }
    return;
}

async function openPost() {
    document.getElementById("postList").innerHTML =  '<label>Please select your chosen image along with anything you want to say:</label>'
    document.getElementById("postList").innerHTML += '<form enctype = "multipart/form-data" action = "save_file.py" method = "post">'
    document.getElementById("postList").innerHTML += '<p>File: <input type = "file" name = "filename" /></p>'
    document.getElementById("postList").innerHTML += '<p><input type = "text" name = "textwindow" /></p>'
    document.getElementById("postList").innerHTML += '<p><input type = "submit" value = "Upload" /></p>'
    document.getElementById("postList").innerHTML += '</form>'
}

async function post() {
    var file = document.getElementById("postImage").value;
    console.log(file);
}

async function openFollowing() {
    const response = await fetch('http://127.0.0.1:5000/userdata', { method: 'USERS',});
    var data = await response.text();

    document.getElementById("postList").innerHTML = '<table id="myTable" class = "center"></table>'
    var table = document.getElementById("myTable");

    table.innerHTML = "";

    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(table.length);
    var cell2 = newRow.insertCell(table.length);

    cell1.innerHTML = "Users";
    cell2.innerHTML = "";

    console.log(data)

    // Cuts data to begin at the start of the relevant information
    data = data.substring(data.indexOf("(") + 1);
    // Loops through each class until the information is emptied
    while(true) {
        // Creates a new row with the cells necessary, appending them to the current table
        var newRow = table.insertRow(table.length);
        var cell1 = newRow.insertCell(table.length);
        var cell2 = newRow.insertCell(table.length);

        var user = data.substring(0, data.indexOf(","));
        data = data.substring(data.indexOf("'")+1);
        var username = data.substring(0, data.indexOf("'"));
        data = data.substring(data.indexOf("'")+1);
        data = data.substring(data.indexOf("'")+1);
        var image = data.substring(0, data.indexOf("'"));
        data = data.substring(data.indexOf(")")+1);

        cell1.innerHTML = '<h3 class="user"><img src="../static/images/userdata/' + user +"/profile/" + image +  '" class="postAvatar"></img>';
        cell2.innerHTML = username;


        if (data.indexOf("(") == -1) break;
        // Tab to next relevant information
        data = data.substring(data.indexOf("(") + 1);
    }


}

async function getName() {
    const response = await fetch('http://127.0.0.1:5000/userdata', { method: 'GETNAME',});
    var data = await response.text();
    console.log(data)
    document.getElementById("name").innerHTML = "Welcome, " + data;
    return data;
}

async function getProfilePicture() {
    const response = await fetch('http://127.0.0.1:5000/userdata', { method: 'GETPROFILEPICTURE',});
    var data = await response.text();
    console.log(data)
    document.getElementById("avatar").src = data;
    return data;
}