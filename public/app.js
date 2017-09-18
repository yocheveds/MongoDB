// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table body
function displayResults(nytData) {
  // First, empty the table
  $("tbody").empty();

  // Then, for each entry of that json...
  nytData.forEach(function(nytData) {
    // Append each of the animal's properties to the table
    console.log(nytData.id, 'ID');
    $("tbody").append("<div id = " + nytData.id + ">" + nytData.title + nytData.link + "<button data-url='"+nytData.link+"' data-title='"+nytData.title+"' data-id='"+nytData.id+"' class='save'>Save Article</button>" + "<div>");
  });
  addSaveHandlers()
};

// Bonus function to change "active" header
function setActive(selector) {
  // remove and apply 'active' class to distinguish which column we sorted by
  $("th").removeClass("active");
  $(selector).addClass("active");
}

// 1: On Load
// ==========

// First thing: ask the back end for json with all animals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

// 2: Button Interactions
// ======================

// When user clicks the weight sort button, display table sorted by weight
$("#title-sort").on("click", function() {
  // Set new column as currently-sorted (active)
  setActive("#nyt-title");

  // Do an api call to the back end for json with all animals sorted by weight
  $.getJSON("/title", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
});

// When user clicks the name sort button, display the table sorted by name
$("#link-sort").on("click", function() {
  // Set new column as currently-sorted (active)
  setActive("#nyt-link");

  // Do an api call to the back end for json with all animals sorted by name
  $.getJSON("/link", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
});

console.log('assigning click handlers')

document.querySelectorAll('.save').forEach( button => {
  button.addEventListener('click', function(event) {
    console.log(target.event)
  })
})

function addSaveHandlers() {
  $(".save").on("click", function(event) {
  console.log(event.target);
  console.log(event.target.dataset.title)
  console.log(event.target.dataset.id)
  var article = {title: event.target.dataset.title, link: event.target.dataset.url, id: event.target.dataset.id}
  var save = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "favorites/"+ event.target.dataset.id,
    body: article
  })
});
}
