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

// jquery selector to find all list group elelemtns and call a new JQ ui method on them
// sortable()turns every element with the class list-group into a sortable list
$(".card .list-group").sortable({
  // connectwith links these sortable lists with any other lists that have the same class
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  
  // tells jquery to create a copy of the dragged element and moev the copy instead of the original
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
    $(this).children().each(function() {
      console.log($(this));
    // compare the above jq this to js this below
    // console.log("update", this);
      var text = $(this)
      .find("p")
      .text()
      .trim();

      var date = $(this)
      .find("span")
      .text()
      .trim();

      console.log(text, date);
      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });
    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    console.log("drop");
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});

// date picker 
$("#modalDueDate").datepicker({
  // set the min. date to be one day from the current date. 
  minDate: 1,
  // close when an user clicks anywhere on the page outside the date picker 
  onClose: function() {
    // when calendar is closed, force a "change" event on the `dateInput`
    $(this).trigger("change");
  }
});

// create date picker every time an user clicks on the dute date for a task
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this).text().trim();

  // create new input element
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);

  $(this).replaceWith(dateInput);

  // enable jquery ui datepicker
  dateInput.datepicker({
    minDate: 1
  });

  // automatically bring up the calendar
  dateInput.trigger("focus");
});

// add two days to the current time with moments
var twoDaysFromNow = moment().add(2, "days");

// add two days in js
// get current date
var currentDate = new Date();

// set how many days from now we want
var daysFromNow = 2;

// get date two days from now
var twoDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + daysFromNow));

// create color coded warning , due soon and overdue 
//  first , need to use jquery to retrieve the date stored in span element 
// second, use momment function to cover that date value into a moment object
var auditTask = function(taskEl) {
  // get date from task element
  var date = $(taskEl).find("span").text().trim();
  // ensure it worked
  console.log(date); 

  // convert to moment object at 5:00pm
  // configured for the user's local time
  // moment object will default to 12am +17 hours to covert to 5 pm
  // so we can compare when a task is due 
  var time = moment(date, "L").set("hour", 17);
  // this should print out an object for the value of the date variable, but at 5:00pm of that date
  console.log(time);

};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");

  var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);

  var taskP = $("<p>").addClass("m-1").text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  // check due date
  auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

// check if a date is in the past or imminent
var auditTask = function(taskEl) {
  // get date from task element
  var date = $(taskEl).find("span").text().trim();

  // convert to moment object at 5:00pm
  var time = moment(date, "L").set("hour", 17);

  // remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  // apply new class if task is near/over due date
  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  }
  // check if a date if imminent 
  // moment will return a negative number today =0 - 2 days from now = -2
  // math.abs makes the number an absolute value 
  else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }
};

// update due date change event handler function. add one more line of code to the very bottom
$(".list-group").on("change", "input[type='text']", function() {
  var date = $(this).val();

  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();

  tasks[status][index].date = date;
  saveTasks();

  var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
  $(this).replaceWith(taskSpan);

  // Pass task's <li> element into auditTask() to check new due date
  auditTask($(taskSpan).closest(".list-group-item"));
});

// check time to past due every 5 secs 
setInterval(function () {
  $(".card .list-group-item").each(function(index, el) {
    auditTask(el);
  });
}, (1000 * 60) * 30);
