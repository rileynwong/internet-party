from flask import Flask, request, redirect, jsonify, render_template
import requests
import twilio.twiml
import os

isfile = os.path.isfile
join = os.path.join

# Helpers
def getNumFiles(path):

    # Counts the number of files in a directory
    count = 0;
    for f in os.listdir(path):
        if isfile(join(path, f)):
            count += 1

    print str(count) + ' photos inside ' + path
    return count

app = Flask(__name__)
path = 'static/photos'
fileCount = getNumFiles(path)

# Routes
@app.route("/", methods=['GET', 'POST'])
def runDef():
    return render_template('index.html')

@app.route("/internetparty", methods=['GET', 'POST'])
def runHome():
    global fileCount
    fileCount = 0
    return render_template('index.html')

@app.route("/fileCount", methods=['GET', 'POST'])
def runFileCount():
    global fileCount
    return str(fileCount)

@app.route("/happybirthdaysophie", methods=['GET', 'POST'])
def runBirthday():
    return render_template('birthday.html')

@app.route("/api", methods=['GET', 'POST'])
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
  fileName = "static/photos/photo_" + fileCountStr + '.jpg'
  with open(fileName, 'w') as f:
      f.write(image_contents)
      print 'photo written into dir'

  resp = twilio.twiml.Response()
  resp.message("thanks!! hit up http://d6a87382.ngrok.io/internetparty")
  return str(resp)

if __name__ == "__main__":
    # Bind to PORT if defined, otherwise default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
