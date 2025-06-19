$(document).ready(function () {
    $('#photo-form').on('submit', function (e) {
      e.preventDefault();
  
      const formData = new FormData($(this)[0]);
      $.ajax({
        type: 'POST',
        url: '/upload-photo',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          $('#photo-text').text(response.text || 'No text detected.');
          $('#photo-output').fadeIn();
        },
        error: function () {
          alert('Error extracting text from photo.');
        },
      });
    });
  });
  