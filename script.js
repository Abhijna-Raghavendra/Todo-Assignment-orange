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
            console.log(task);
            taskHTML += `<div class="task-item">
            <div class="task">
                ${task.task}
            </div>
            <div class="mark-status">
                <button>Completed</button>
                <button>Missed</button>
            </div>
        </div>`
        })

        document.querySelector(".task-list").innerHTML = taskHTML;
    }
getTasks();