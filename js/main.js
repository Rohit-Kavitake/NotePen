
function signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

const signOut = () =>{
    firebase.auth().signOut();
}
function getProfilePicUrl() {
    // TODO 4: Return the user's profile pic URL.
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
  
}

function getUserName() {
    // TODO 5: Return the user's display name.
    return firebase.auth().currentUser.displayName;
}
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
}

const checksign = () => {
    return !!firebase.auth().currentUser;
}

function authStateObserver(user) {
    if (user) { // User is signed in!
        console.log("User Logged in");
        // Get the signed-in user's profile pic and name.
        var profilePicUrl = getProfilePicUrl() || "https://img.icons8.com/dusk/52/000000/cat-profile.png";
        var userName = getUserName();
        // console.log(firebase.auth().currentUser.email);
        // console.log(firebase.auth().currentUser.providerId);
        // Set the user's profile pic and name.
        document.querySelector('.profile').src = addSizeToGoogleProfilePic(profilePicUrl);  
        document.querySelector('.profile').removeAttribute('hidden');
        document.querySelector('#name').textContent = userName;
        document.querySelector('#signInbtn').setAttribute('hidden','true');
        document.querySelector('#landing').setAttribute('hidden','true');
        document.querySelector("#signout").removeAttribute('hidden');
        document.querySelector("#signout").addEventListener('click',signOut);
        document.querySelector('#createbtn').removeAttribute('hidden');
        document.querySelector('#ShowData').removeAttribute('hidden');
        document.querySelector("#sticky-footer").setAttribute('hidden','true');
        RetrieveData()

    } 
    else { // User is signed out!
        console.log("User Logged Out")
        document.querySelector('#name').textContent = "";
        document.querySelector('.profile').src = "https://img.icons8.com/dusk/52/000000/cat-profile.png";  
        document.querySelector('#signout').setAttribute('hidden','true');
        document.querySelector('.profile').setAttribute('hidden','true');
        document.querySelector("#signInbtn").removeAttribute('hidden');
        document.querySelector("#landing").removeAttribute('hidden');
        document.querySelector("#sticky-footer").removeAttribute('hidden');
        // document.querySelector("#sticky-footer").style.position = "absolute";
        document.querySelector('#createbtn').setAttribute('hidden','true');
        document.querySelector('#ShowData').setAttribute('hidden','true');
    }
  }

function initFirebaseAuth() {
    // TODO 3: Initialize Firebase.
    firebase.auth().onAuthStateChanged(authStateObserver);
  
}

const addTask = () =>{
    let titlevalue = document.querySelector('#title').value;
    let taskvalue = document.querySelector('#task').value;
    let feedback = document.querySelector("#feedback");
    if(titlevalue == "" || taskvalue == ""){
        alert("Please Fill All Fields")
    }
    else{
        firebase.firestore().collection(firebase.auth().currentUser.email).add({
            title : titlevalue,
            note : taskvalue,
            time : firebase.firestore.FieldValue.serverTimestamp()
        }).then(fun =>{
            feedback.textContent = "Blog Successfully Saved";
            document.querySelector('#reset').click();
        setTimeout(function(){ feedback.textContent = "";document.querySelector('.close').click()},1000)
        }).catch( err => {
            console.log("Firestore Database adding data error")
            feedback.textContent = "Blog Saving Error";
            
        });
        RetrieveData()
    }
}

const bgColorChange = () => {
    let red = Math.floor(Math.random() * 256) + 64; 
    let green = Math.floor(Math.random() * 256) + 64; 
    let blue = Math.floor(Math.random() * 256) + 64; 
    let backColor = "rgb(" + red + ", " + green + ", " + blue + ")";
    return backColor;
}

const RetrieveData = () =>{
    document.querySelector('#ShowData').innerHTML = ""
    firebase.firestore().collection(firebase.auth().currentUser.email).orderBy("time", "desc").get()
    .then(snap => {
        snap.forEach(doc =>{
            console.log(doc.id);
            document.querySelector('#ShowData').innerHTML += template(doc.get('title'),getStringWithNewLine(doc.get('note')), doc.get('time'),doc.id)

            // document.querySelector('#DataNote').style.background = bgColorChange() 
            /*TODO 1 apr : 
            add event listener to open modal on click of note for update and delete
            add contact develeoper for queries btn at end of logged in page
            dont cry :( */
        })
    })
}

const template = (title,note,time,Id) =>{
    return '<div id="DataNote" style="color : bgcolor()" class="col-md-4 col-sm-4"><h3>'+ title +'</h3><p>'+ note +'</p><br><small>'+ time +'</small><label id="docId" hidden>' + Id +'</label></div>'
}

const getStringWithNewLine = (str="") => {
    if(str){
        return str.split('\n').join("<br/>")
        // return str.replace('\n', "<BR>");
        console.log(str)
    }
    return str
}


initFirebaseAuth();
// RetrieveData()

document.querySelector("#signInbtn").addEventListener('click',signIn);

