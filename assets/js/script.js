var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    // addclass method updates an element's class attribute with new values
    .addClass("badge badge-primary badge-pill")
    // changes the element's text content 
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// event delegation using jquery 
$(".list-group").on("click", "p", function() {
  // convert "this " into a jquery object 
  // var text = $(this).text();
  var text = $(this)
  // text()method will get the inner text content of the current element, represented by $(this)
  .text()
  // works with trim() to remove any extra white space before or after
  .trim();
  // While $("textarea") tells jQuery to find all existing <textarea> elements, as we've seen before, 
  // $("<textarea>") tells jQuery to create a new <textarea> element. 
  // The former uses the element name as a selector, the latter uses the HTML syntax for an opening tag to indicate the element to be created.
  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);
  // replace exisiting <p> element with new <textarea> and append it to the old <p> node.
  $(this).replaceWith(textInput);
  // automatically highlight the input box to type in on one click
  textInput.trigger("focus");
  // can be chained together, vartext =$(this).text().trim();
  
  console.log("<p> was clicked");
  console.log(this);
});

// triggers when the user stops interacting with the textarea element 
$(".list-group").on("blur", "textarea", function() {
// get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    // .replace is a javascript operator to find and replace text in a string 
    .replace("list-", "");
    // variable names as placeholders. text = "blah", status = "toDo", index =0 . 
    // tasks is an object. task[status] returns an array i.e. toDo , 
    // tasks[status][index] returns the object at the given index in the array
    tasks[status][index].text = text;
    saveTasks();

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // recreate p element
  var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
  // .attr gets an attribute with one argument. with 2 arguement such as below. it sets an attribute
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array that is a property of an object
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


