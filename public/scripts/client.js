/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// Function to prevent XSS by escaping user input
const escape = function(str) {
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
      $('#tweets-container').prepend($tweetElement.hide().slideDown('fast')); // Newest first
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

    
    const $textarea = $('#tweet-text');
    const tweetContent = $textarea.val().trim();

    // Clear previous error
    $('.error').slideUp().text('');

    // Validation: empty tweet
    if (!tweetContent) {
      $('.error')
        .text('⚠️ Tweet cannot be empty!')
        .slideDown();
      return; // Stop submission
    }

    // Validation: tweet too long
    if (tweetContent.length > 140) {
      $('.error')
        .text('⚠️ Tweet exceeds 140 characters!')
        .slideDown();
      return; // Stop submission
    }

    const serializedData = $(this).serialize();

    $.post('/api/tweets', serializedData)
      .then(() => {
      // Clear the tweet input
        $('#tweet-text').val('');

        // Reset character counter
        $('.counter').text(140);

        // Reload tweets
        loadTweets();
        $('#tweets-container').slideDown('fast');
      })
      .catch((err) => {
        console.error('Failed to submit tweet:', err);
      });
  });

  // Initial page load
  loadTweets();
});
