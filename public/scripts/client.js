/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

// Function to prevent XSS by escaping user input
const escape = function (str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Creates a tweet HTML element
const createTweetElement = function(tweet) {
  const timeAgo = timeago.format(tweet.created_at);

  const $tweet = $(`
    <article class="tweet">
      <header>
        <div class="user-info">
          <img src="${tweet.user.avatars}" alt="Avatar">
          <span class="name">${escape(tweet.user.name)}</span>
        </div>
        <span class="handle">${escape(tweet.user.handle)}</span>
      </header>
      <div class="tweet-content">
        <p>${escape(tweet.content.text)}</p>
      </div>
      <footer>
        <span class="time">${timeAgo}</span>
        <div class="icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

  return $tweet;
};

$(document).ready(function() {
  // Renders all tweets in the array to the #tweets-container
  const renderTweets = function(tweets) {
    $('#tweets-container').empty(); // Clear old tweets

    for (const tweet of tweets) {
      const $tweetElement = createTweetElement(tweet);
      $('#tweets-container').prepend($tweetElement); // Newest first
    }
  };

  // Define the function to fetch and render tweets
  const loadTweets = function() {
    $.get('/api/tweets')
      .then((tweets) => {
        renderTweets(tweets);
      })
      .catch((err) => {
        console.error('Error loading tweets:', err);
      });
  };

  // Handle tweet form submission
  $('#tweet-form').on('submit', function(event) {
    event.preventDefault();

    const serializedData = $(this).serialize();

    $.post('/api/tweets', serializedData)
      .then(() => {
        $('#tweet-text').val('');
        $('.counter').text(140);
        loadTweets(); // Reload tweets after successful post
      })
      .catch((err) => {
        console.error('Failed to submit tweet:', err);
      });
  });

  // Initial page load
  loadTweets();
});
