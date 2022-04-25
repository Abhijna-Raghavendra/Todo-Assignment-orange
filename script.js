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
            taskHTML += `<div class="task-item">
            <div class="task">
                ${task.task+' scheduled for '+task.date}
            </div>
            <div class="mark-status">
                <button data-id="${task.id}" class="completed">Completed</button>
                <button data-id="${task.id}" class="missed">Missed</button>
            </div>
        </div>`
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
getTasks();