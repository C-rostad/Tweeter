$(document).ready(function() {
  const chars = 140
  $("textarea").on("input", function () {

    const inputLength = $(this).val().length;
    const remaining = chars - inputLength

    const $counter = $(this).closest("form").find('[name="counter"]');
    $counter.text(remaining);

    // Add/remove the 'negative' class based on the value
    if (remaining < 0) {
      $counter.addClass("negative");
    } else {
      $counter.removeClass("negative");
    }
  })
});
