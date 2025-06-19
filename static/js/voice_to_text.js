$(document).ready(function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  
    let transcriptText = '';
  
    $('#start-voice').on('click', function () {
      recognition.start();
    });
  
    
    $('#stop-voice').on('click', function () {
      recognition.stop();
    });
  
    $('#clear-voice-text').on('click', function () {
      transcriptText = '';
      $('#voice-text').val('');
      $('#preview-container').hide();  
      $('#download-voice-text').hide();  
    });
  
   
    recognition.onresult = function (event) {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcriptText += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      $('#voice-text').val(transcriptText + interimTranscript);
    };
  
    
    $('#generate-preview').on('click', function () {
      const fontSize = $('#voice-font-size').val();
      const fontColor = $('#voice-font-color').val();
      const text = $('#voice-text').val();
  
      
      $('#preview-text').css({
        'font-size': fontSize + 'px',
        'color': fontColor,
      }).text(text);
  
      $('#preview-container').show();  
      $('#download-voice-text').show();  
    });
  
    
    $('#download-voice-text').on('click', function () {
      const fileType = $('#voice-file-format').val();
      const text = $('#voice-text').val();
      const fileName = `voice_text.${fileType}`;
  
     
      if (fileType === 'txt') {
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
      
      else if (fileType === 'pdf') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text(text, 10, 10);
        pdf.save(fileName);
      }
      
      else if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const fontSize = $('#voice-font-size').val();
        const fontColor = $('#voice-font-color').val();
        const textToRender = text;
  
        canvas.width = 600;
        canvas.height = 400;
        context.font = `${fontSize}px Arial`;
        context.fillStyle = fontColor;
        context.fillText(textToRender, 10, 50);
  
        canvas.toBlob(function (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        });
      }
    });
});
  


  