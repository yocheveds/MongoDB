// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
app.use(express.static("public"));
// Database configuration
var databaseUrl = "nyt";
var collections = ["nytData"];


// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
res.render("index")
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the nytdData collection in the db
  db.nytdData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

app.get("/favorites", function(req, res) {
  // Find all results from the nytdData collection in the db
  db.nytdData.findall({favorites:true}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);

    }
  });
});

app.post("/favorites/:id", function(req, res) {
  // Find all results from the nytdData collection in the db
  db.nytdData.update({
    "_id": monfojs.Objectid(req.params.id)
  },{
    $set:{
      "favorites": true
    }
    // Throw any errors to the console
  }, function(err, edited) {
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(edited);

    }
  });
});

// app.get("/deleted", function(req, res) {
//   // Find all results from the nytdData collection in the db
//   db.nytdData.delete({}, function(error, found) {
//     // Throw any errors to the console
//     if (error) {
//       console.log(error);
//     }
//     // If there are no errors, send the data to the browser as json
//     else {
//       res.json(found);
//     }
//   });
// });
// nyt data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://www.nytimes.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("h1.story-heading").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");


      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the nytdData db
        db.nytdData.insert({
            title: title,
            link: link,
            favorites: false
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            } else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
      }
    });
  });

  // Send a "nyt Complete" message to the browser
  res.send("nyt Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
