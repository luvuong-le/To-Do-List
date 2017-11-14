// Task Input Elements
let taskInput = document.getElementById("taskInput");
let taskSubmit = document.getElementById("taskSubmit");

// Search Input Elements
let searchInput = document.getElementById("searchInput");

// Task Card Elements
let taskList = document.getElementById("task-list");

// Remove All Button
let removeAll = document.getElementById("removeAllBtn");

// Delete Button and taskItems elements 
let deleteButtons, taskItems, editButtons;

removeAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to remove all tasks?")) {
        // Remove all from local storage
        localStorage.clear();
        
            // Remove from screen
            while (taskList.hasChildNodes()) {
                taskList.removeChild(taskList.lastChild);
            }
    }
});

searchInput.addEventListener("keyup", () => {
    let searchValue = searchInput.value.toUpperCase();

    let task_items = taskList.querySelectorAll(".task-item");

    // Loop through each task item
    for (let i = 0; i < task_items.length; i++) {
        let tagName = task_items[i].getElementsByTagName("span")[0];

        //  Check if matches and none if it doesnt
        if (tagName.innerHTML.toUpperCase().indexOf(searchValue) > - 1) {
            task_items[i].style.display = "";
        } else {
            task_items[i].style.display = "none";
        }
    }
});

taskSubmit.addEventListener("click", (e) => {
    if (taskInput.value !== "") {

        e.preventDefault();
        // Save to local storage 
        let key = localStorage.length + 1;
        let value = taskInput.value;
        localStorage.setItem(key.toString(), value);

        // Clear all in task list before removing.
        while (taskList.hasChildNodes()) {
            taskList.removeChild(taskList.lastChild);
        }
    }

    deleteButtons = document.querySelectorAll(".closeBtn");
    editButtons = document.querySelectorAll(".editBtn");
    taskItems = document.querySelectorAll(".task-item");
    addListeners();
    display();

    // Clear input 
    taskInput.value = "";
});;

function display() {
    while (taskList.hasChildNodes()) {
        taskList.removeChild(taskList.lastChild);
    }

    // Loop through local storage and for each one create a new card.
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);

        // Create the new list element. 
        let li = document.createElement("li");
        let div = document.createElement("div");
        let span = document.createElement("span");
        let itag = document.createElement("i");
        let editIcon = document.createElement("i");

        //Set div class name
        div.className = "card-panel blue";

        // Add span class name and text
        span.className = "white-text";
        let spanText = document.createTextNode(value);
        span.appendChild(spanText);

        // Add class to i 
        itag.className = "closeBtn small material-icons right";
        let iText = document.createTextNode("delete_sweep");
        itag.appendChild(iText);

        editIcon.className = "editBtn small material-icons right";
        let editText = document.createTextNode("edit");
        editIcon.appendChild(editText);


        //Append the span to the div
        div.appendChild(span);
        div.appendChild(itag);
        div.appendChild(editIcon);

        //Append the div to the li
        if (key.includes("checked")) {
            li.className = "task-item checked";
        } else{
            li.className = "task-item";
        }
        li.appendChild(div);

        //Append the li to the list
        taskList.appendChild(li);
    }

    deleteButtons = document.querySelectorAll(".closeBtn");
    editButtons = document.querySelectorAll(".editBtn");
    taskItems = document.querySelectorAll(".task-item");

    // Loop through each taskItem and add a tick 
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].className.includes("checked")) {
            // Add a tick element // 
            let tick = document.createElement("i");
            tick.className = "small material-icons right";
            let tickName = document.createTextNode("check_circle");
            tick.appendChild(tickName);
            taskItems[i].children[0].appendChild(tick);
        }
    }
    addListeners();
};

function addListeners() {
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", (e) => {
            if (e.target === deleteButtons[i]) {
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteCardFromDOM(deleteButtons[i]);
                }
            }
        });
    }

    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", (e) => {
            if (e.target === editButtons[i]) {
                let newText = prompt("Edit Task: ", editButtons[i].previousElementSibling.previousElementSibling.innerHTML);
                if (newText !== "" && newText !== null) {
                    taskItems[i].childNodes[0].childNodes[0].innerHTML = newText;
                    editCardLocalStorage(editButtons[i], newText);
                }
            }
        });
    }

    for (let j = 0; j < taskItems.length; j++) {
        taskItems[j].addEventListener("click", (e) => {
            if (e.target !== deleteButtons[j] && e.target !== editButtons[j]) {
                if (!taskItems[j].classList.contains("checked")) {
                    taskItems[j].className += (" checked");
                    
                    // Add a tick element // 
                    let tick = document.createElement("i");
                    tick.className = "small material-icons right";
                    let tickName = document.createTextNode("check_circle");
                    tick.appendChild(tickName);
                    taskItems[j].children[0].appendChild(tick);

                    // Save to local storage with "checked" value
                    deleteFromLocalStorage(taskItems[j].childNodes[0].childNodes[0].innerHTML);

                    let key = (j + 1) + " checked";
                    let value = taskItems[j].childNodes[0].childNodes[0].innerHTML;

                    // Can change colour of card when checked here with taskItems[j].childNodes[0] class name.

                    localStorage.setItem(key.toString(), value);
    
                } else {
                    taskItems[j].className -= (" checked");

                    deleteFromLocalStorage(taskItems[j].childNodes[0].childNodes[0].innerHTML);

                    let key = j + 1;
                    let value = taskItems[j].childNodes[0].childNodes[0].innerHTML;

                    localStorage.setItem(key.toString(), value);
                        
                    // Remove Check Circle
                    taskItems[j].childNodes[0].removeChild(taskItems[j].childNodes[0].childNodes[3]);
                }
            }
        });
    }
};

function deleteCardFromDOM(deleteButton) {
    // Remove from display and local storage
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].childNodes[0].childNodes[1] == deleteButton) {
            taskList.removeChild(taskItems[i]);
            deleteFromLocalStorage(taskItems[i].childNodes[0].childNodes[0].innerHTML);
        }
    }
};

function editCardLocalStorage(editButton, editText) {
    // Remove from display and local storage
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].childNodes[0].childNodes[2] === editButton) {
            // Save to local storage 
            let key = localStorage.key(i);

            if (key.includes("checked")) {
                let keyToAdd = (i + 1) + " checked";
                let value = editText;
    
                localStorage.setItem(keyToAdd.toString(), value);
            } else {
                let keyToAdd = i + 1;
                let value = editText;
    
                localStorage.setItem(keyToAdd.toString(), value);
            }

        }
    }
};


function deleteFromLocalStorage(valueString) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);

        if (value === valueString) {
            localStorage.removeItem(key);
        }
    }
};

display();
