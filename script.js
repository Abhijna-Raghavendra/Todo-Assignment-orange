const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBA74hmjAqw0qj8AOBMg_Ief1Plb7IKG-s",
    authDomain: "to-do-project-dc1ff.firebaseapp.com",
    projectId: "to-do-project-dc1ff",
    storageBucket: "to-do-project-dc1ff.appspot.com",
    messagingSenderId: "666899252095",
    appId: "1:666899252095:web:5d15ce4ce998878e78904a"
  });

  const db = firebaseApp.firestore();

  function addTodo(event){
    event.preventDefault();
    let task = document.getElementById("new-task");
    let date = document.getElementById("task-date");
    alert("A new task has been added:\n"+task.value+" scheduled for "+date.value);
    db.collection("todo-tasklist").add({
        task: task.value,
        date: date.value,
        status: "active" 
    });
    document.getElementById("task-form").reset();
}
    function getTasks(){
        db.collection("todo-tasklist").onSnapshot((snapshot) => {
            let task = [];
            snapshot.docs.forEach((doc) => {
                task.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            generateTask(task);
        })
    }
    
    function generateTask(task){
        let taskHTML = "";
        task.forEach((task) => {
            if(task.status=="active")
            {
                taskHTML += `<div class="task-item" id="active">
                <div class="task">
                    ${task.task+' scheduled for '+task.date}
                </div>
                <div class="mark-status">
                    <button data-id="${task.id}" class="completed">Completed</button>
                    <button data-id="${task.id}" class="missed">Missed</button>
                </div>
            </div>`
            }
            else if(task.status=="completed")
            {
                taskHTML += `<div class="task-item" id="completed">
                <div class="task">
                    ${task.task+' scheduled for '+task.date}
                </div>
            </div>`
            }
            else if(task.status=="missed")
            {
                taskHTML +=`<div class="task-item" id="missed">
                <div class="task">
                    ${task.task+' scheduled for '+task.date}
                </div>
                <div class="mark-status">
                    <input data-id="${task.id}" type="date" id="reschedule-date">
                    <button data-id="${task.id}" class="reschedule">Reschedule</button>
                </div>
            </div>` 
            }
            
        })

        document.querySelector(".task-list").innerHTML = taskHTML;
        statusEventListener();
    }

    function statusEventListener(){
        let completedStatus = document.querySelectorAll(".mark-status .completed");
        let missedStatus = document.querySelectorAll(".mark-status .missed");
        
        completedStatus.forEach((complete) =>{
            complete.addEventListener("click", function(){
                markCompleted(complete.dataset.id);
            })
        })
        missedStatus.forEach((missed) =>{
            missed.addEventListener("click", function(){
                markMissed(missed.dataset.id);
            })
        }) 
        let rescheduleStatus = document.querySelectorAll(".mark-status .reschedule");
        let date = document.getElementById("reschedule-date");
        rescheduleStatus.forEach((reschedule) =>{
            reschedule.addEventListener("click", function(){
                markReschedule(reschedule.dataset.id,date.value);
            })
        })
    }
    function markCompleted(id){
        let task = db.collection("todo-tasklist").doc(id);
        task.get().then(function(doc){
            if(doc.exists){
                task.update({
                    status: "completed" 
                }
                )
                alert("Task status is updated");
            }
        })
    }
    function markMissed(id){
        let task = db.collection("todo-tasklist").doc(id);
        task.get().then(function(doc){
            if(doc.exists){
                task.update({
                    status: "missed" 
                }
                )
                alert("Task status is updated");
            }
        })
    }
    function markReschedule(id,date){
        let task = db.collection("todo-tasklist").doc(id);
        task.get().then(function(doc){
            if(doc.exists){
                task.update({
                    date: date,
                    status: "active" 
                }
                )
                alert("Task is rescheduled");
            }
        })
    }

    function openTab(event, status) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("task-item");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tab-buttons");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(status).style.display = "block";
        event.currentTarget.className += " active";
      }
document.getElementById("default").click();
getTasks();
