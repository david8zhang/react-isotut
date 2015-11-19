// Require JSX
var JSX = require('node-jsx').install();
var React = require('react');
var TweetsApp = require('./components/TweetApp.react');
var Tweet = require('./models/Tweet');

// Pass in a mapping of functions to exports
module.exports = {
    index: function(req, res) {
        Tweet.getTweets(0, 0, function(tweets, pages) {
            // Render React to a string, passing it between our fetched tweets
            var markup = React.renderComponentToString(
                TweetsApp({
                    tweets:tweet
                })
            );

            // Render our 'home' templates
            res.render('home', {
                markup: markup, // Pass rendered react markup
                state: JSON.stringify(tweets) // Pass current states to the client side
            });
        });
    };

    page: function(req, res) {
        // Fetch tweets by page via param
        Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
            // Render as JSON
            res.send(tweets);
        });
    }
};
