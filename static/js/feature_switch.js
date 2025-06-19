function selectFeature(feature) {
    $('#text-to-handwriting-section').hide();
    $('#photo-to-text-section').hide();
    $('#voice-to-text-section').hide();
  
    if (feature === 'text-to-handwriting') {
      $('#text-to-handwriting-section').show();
    } else if (feature === 'photo-to-text') {
      $('#photo-to-text-section').show();
    } else if (feature === 'voice-to-text') {
      $('#voice-to-text-section').show();
    }
}
  