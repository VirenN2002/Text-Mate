$(document).ready(function () {
    $('#text-form').on('submit', function (e) {
      e.preventDefault();
  
      const formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/generate',
        data: formData,
        success: function (response) {
          $('#generated-image').attr('src', response.preview_image_url);
          $('#output-container').fadeIn();
          $('#download-link').attr('href', response.file_url).attr('download', response.file_name);
        },
        error: function () {
          alert('Error generating handwritten note.');
        },
      });
    });
  
    $('#clear-text').on('click', function () {
      $('#text').val('');
    });
});
  
document.getElementById('font-color').addEventListener('input', function() {
    const color = this.value;  // Get the selected color value
    document.getElementById('color-preview').style.backgroundColor = color;  // Update preview box
  });
  