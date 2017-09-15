// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table body
function displayResults(nytData) {
  // First, empty the table
  $("tbody").empty();

  // Then, for each entry of that json...
  nytData.forEach(function(nytData) {
    // Append each of the animal's properties to the table
    $("tbody").append("<div id = "+nytData.id+">"+nytData.title +nytData.link+"<button id=`save`>Save Article</button>"+"<div>");
  });
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

$("#save").on("click", function() {
  console.log("hyg");
  var save = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "/favorites/" + save,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      link: $("#linkinput").val()
    }});
  });
