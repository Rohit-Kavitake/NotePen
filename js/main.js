
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
        // document.querySelector("#sticky-footer").setAttribute('hidden','true');
        RetrievePen()

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

const addPen = () =>{
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
            feedback.textContent = " Successfully Saved";
            document.querySelector('#reset').click();
        setTimeout(function(){ feedback.textContent = "";document.querySelector('.close').click()},1000)
        }).catch( err => {
            console.log("Firestore Database adding data error")
            feedback.textContent = "Blog Saving Error";
            
        });
        RetrievePen()
    }
}

// const bgColorChange = () => {
//     let red = Math.floor(Math.random() * 256) + 64; 
//     let green = Math.floor(Math.random() * 256) + 64; 
//     let blue = Math.floor(Math.random() * 256) + 64; 
//     let backColor = "rgb(" + red + ", " + green + ", " + blue + ")";
//     return backColor;
// }

const RetrievePen = () =>{
    document.querySelector('#ShowData').innerHTML = ""
    firebase.firestore().collection(firebase.auth().currentUser.email).orderBy("time", "desc").get()
    .then(snap => {
        snap.forEach(doc =>{
            let time =doc.get('time')
            let title =doc.get('title')
            let note =doc.get('note')
            let ide =doc.id
            console.log(doc.id);
            if(time != null) time = time.toDate();
            if(time == null) time = "Just now"
            // return '<div id="DataNote" class="col-md-4 col-sm-4"><h3>'+ title +'</h3><p>'+ note +'</p><br><small>'+ time +'</small><label id="docId" hidden>' + Id +'</label></div>'
            let outerDiv = document.createElement("div");
            outerDiv.className = "col-md-4 col-sm-4"
            // outerDiv.id = ide;
            let titlehead = document.createElement('h3');
            titlehead.appendChild(document.createTextNode(title));
            let pen = document.createElement('p');
            pen.appendChild(document.createTextNode(note));
            outerDiv.appendChild(titlehead);
            outerDiv.appendChild(pen);
            // outerDiv.innerHTML += "<br/>";
            let timelbl = document.createElement('small');
            timelbl.appendChild(document.createTextNode(time));
            outerDiv.appendChild(timelbl)
            let  container = document.querySelector('#ShowData');
            container.appendChild(outerDiv);
            outerDiv.addEventListener('click',fun =>{
                changePen(ide)
            })
            // document.querySelector('#DataNote').style.background = bgColorChange() 
            /*TODO 1 apr : 
            add event listener to open modal on click of note for update and delete
            add contact develeoper for queries btn at end of logged in page
            dont cry :( */
        })
    })
}

const changePen = async  (id) =>{
    console.log(id)
    const doc =  await firebase.firestore().collection(firebase.auth().currentUser.email).doc(id).get()
    $('#updatetitle').val(doc.get('title'))   
    $('#updatetask').val(doc.get('note'))   
    $("#updateData").modal()
    document.querySelector('#updatebtn').addEventListener('click',updatePen(id))
    $('#deletebtn').onclick = deletePen(id)
    // $('#deletebtn').addEventListener('click',deletePen(id))
}

const updatePen = (id) => {
    console.log(id)
    let titleData = document.querySelector('#updatetitle').value;
    let noteData  = document.querySelector('#updatetask').value;
    let data = {
        'title': titleData,
        'note' : noteData,
        // 'time' : firebase.firestore.FieldValue.serverTimestamp()
    }
    firebase.firestore().collection(firebase.auth().currentUser.email).doc(id).update(data).then(() => {
        console.log("Document successfully updated!");
        // $('#closeModal').click()
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    RetrievePen()
}

const deletePen = (id) =>{
    return firebase.firestore().collection(firebase.auth().currentUser.email).doc(id).delete()
}

// const template = (title,note,time,Id) =>{
//     if(time != null) time = time.toDate();
//     if(time == null) time = "Just now"
//     // return '<div id="DataNote" class="col-md-4 col-sm-4"><h3>'+ title +'</h3><p>'+ note +'</p><br><small>'+ time +'</small><label id="docId" hidden>' + Id +'</label></div>'
//     let outerDiv = document.createElement("div");
//     outerDiv.id = id;
//     let titlehead = document.createElement('h3');
//     titlehead.appendChild(document.createTextNode(title));
//     let pen = document.createElement('p');
//     pen.appendChild(document.createTextNode(note));
//     outerDiv.appendChild(titlehead);
//     outerDiv.appendChild(pen);
//     outerDiv.innerHTML += "<br/>";
//     let timelbl = document.createElement('small');
//     timelbl.appendChild(document.createTextNode(time));
//     outerDiv.appendChild(timelbl)
// }

// const getStringWithNewLine = (str="") => {
//     if(str){
//         return str.split('\n').join("<br/>")
//         // return str.replace('\n', "<BR>");
//         console.log(str)
//     }
//     return str
// }


initFirebaseAuth();
// RetrieveData()

document.querySelector("#signInbtn").addEventListener('click',signIn);

