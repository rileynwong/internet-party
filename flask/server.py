from flask import Flask, request, redirect, jsonify, render_template
import requests
import twilio.twiml
import os

app = Flask(__name__)
fileCount = 0

@app.route("/", methods=['GET', 'POST'])
def run():
  sms_body = request.args.get('Body')
  image_body_url = request.args.get('MediaUrl0')
  print image_body_url
#save image
  r = requests.get(image_body_url)
  print r.status_code
  image_contents = r.content

  global fileCount
  fileCount += 1
  fileCountStr = str(fileCount).zfill(4)
  fileName = "../photos/photo_" + fileCountStr + '.jpg'
  with open(fileName, 'w') as f:
      f.write(image_contents)

  resp = twilio.twiml.Response()
  resp.message("thanks!! hit up http://104.130.174.85")
  render_template('index.html', fileCount=fileCount);
  return str(resp)

if __name__ == "__main__":
    #app.run(debug=True, host='0.0.0.0')
    app.run(debug=True)

isfile = os.path.isfile
join = os.path.join

def getNumFiles():
    directory = '../photos'
    number_of_files = sum(1 for item in os.listdir(directory) if isfile(join(directory, item)))
    return number_of_files
