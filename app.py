import os
import random
from PIL import Image, ImageDraw, ImageFont
import docx
from flask import Flask, render_template, request, jsonify
from fpdf import FPDF
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
import speech_recognition as sr

app = Flask(__name__)

# Set up the paths for fonts and output folder
FONTS_FOLDER = 'static/fonts'  # Path to the fonts folder
OUTPUT_FOLDER = 'static/generated_images'  # Path to store generated images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    font_names = [f for f in os.listdir(FONTS_FOLDER) if f.endswith('.ttf')]
    return render_template('index.html', font_names=font_names)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        text = request.form['text']
        font_size = int(request.form['font_size'])
        font_color = request.form['font_color']
        font_name = request.form['font']
        file_format = request.form['file_format']

        font_path = os.path.join(FONTS_FOLDER, font_name)
        font = ImageFont.truetype(font_path, font_size)

        # Create an image with a white background
        img = Image.new('RGB', (800, 400), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        # Apply the font color
        draw.text((50, 150), text, font=font, fill=font_color)

        base_filename = f"generated_note_{random.randint(100000, 999999)}"
        output_path = os.path.join(OUTPUT_FOLDER, base_filename)

        # Save the preview image (PNG)
        preview_image_path = f"{output_path}.png"
        img.save(preview_image_path)

        # Handle the requested file format for download
        if file_format == 'png':
            file_path = preview_image_path  # Use the same PNG file
        elif file_format == 'jpg':
            file_path = f"{output_path}.jpg"
            img.convert('RGB').save(file_path)
        elif file_format == 'pdf':
            temp_image_path = f"{output_path}_temp.png"
            img.save(temp_image_path)

            file_path = f"{output_path}.pdf"
            pdf = FPDF()
            pdf.add_page()
            pdf.image(temp_image_path, x=10, y=10, w=190)
            pdf.output(file_path)

            os.remove(temp_image_path)
        elif file_format == 'txt':
            file_path = f"{output_path}.txt"
            with open(file_path, 'w') as file:
                file.write(text)
        elif file_format == 'docx':
            file_path = f"{output_path}.docx"
            doc = docx.Document()
            doc.add_paragraph(text)
            doc.save(file_path)

        return jsonify({
            'file_url': f"/static/generated_images/{os.path.basename(file_path)}",
            'preview_image_url': f"/static/generated_images/{os.path.basename(preview_image_path)}",
            'file_name': os.path.basename(file_path)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo uploaded.'})
    photo = request.files['photo']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], photo.filename)
    photo.save(filepath)

    try:
        text = pytesseract.image_to_string(Image.open(filepath))
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/voice-to-text', methods=['POST'])
def voice_to_text():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio uploaded.'})
    audio = request.files['audio']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], audio.filename)
    audio.save(filepath)

    recognizer = sr.Recognizer()
    with sr.AudioFile(filepath) as source:
        try:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return jsonify({'text': text})
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
