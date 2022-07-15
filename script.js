const todo = document.querySelector("#todo_list");
const form = document.querySelector("#add-task-form");

function renderTodo(doc) {
  let li = document.createElement("li");
  let task = document.createElement("span");
  let day = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  task.textContent = doc.data().task;
  day.textContent = doc.data().day;
  cross.textContent = "x";

  li.appendChild(task);
  li.appendChild(day);
  li.appendChild(cross);

  todo.appendChild(li);
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("todo_app").doc(id).delete();
  });
}

// getting data

// db.collection("todo_app")
//   .orderBy("day").get().then((snapshot) => {
//     // console.log(snapshot.docs)
//     snapshot.docs.forEach((doc) => {
//       //    console.log(doc.data())
//       renderTodo(doc);
//     });
//   });

// adding data

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("todo_app").add({
    task: form.task.value,
    day: form.day.value,
  });
  form.task.value = "";
  form.day.value = "";
});

// real time listener

db.collection("todo_app").orderBy('day').onSnapshot(snapshot=>{
    let changes=snapshot.docChanges()
    // console.log(changes);
    changes.forEach((change)=>{
        // console.log(change.doc.data())
        if(change.type=="added")
        {
            renderTodo(change.doc)
        }
        else if(change.type=="removed")
        {
            let li=todo_list.querySelector('[data-id='+change.doc.id+']')
            todo_list.removeChild(li);
        }
    })
})