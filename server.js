var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function(req, res) {

    // url to scrape from - Interstellar IMDB record
    url = 'http://www.imdb.com/title/tt0816692/';

    // Start request
    request(url, function (error, response, html) {

        if(!error) {

            // using jquery serverside ( how awesome )
            var $ = cheerio.load(html);

            var title, release, rating;

            var json = { title: "", release: "", rating: "", review: { title: "", body: "", author: "" } }

            // Find Movie Title
            $('.title_wrapper').filter(function() {

                var data = $(this);

                title = data.find('h1[itemprop="name"]').first().text();

                release = data.find('#titleYear').first().text();

                json.title = title;

                json.release = release;

            });

            // Find Rating
            $('.ratings_wrapper').filter(function() {

                var data = $(this);

                rating = data.find('span[itemprop="ratingValue"]').first().text();

                json.rating = rating;

            }); 

            // Find a Review
            $("#titleUserReviewsTeaser").filter(function() {
                var data = $(this);

                review_title = data.find('span[itemprop="review"] strong[itemprop="name"]').first().text();

                json.review.title = review_title;

                review_body = data.find('p[itemprop="reviewBody"]').first().text();

                json.review.body = review_body;

                review_author = data.find('span[itemprop="author"]').first().text();

                json.review.author = review_author;
            })

            // return json
            res.send(json);

        } else {

            res.send("There was an error");
        }


    });


}); // EO GET "/"

// server port
app.listen('8081');

console.log("Big stuff happening on port 8081");

exports = module.exports = app;