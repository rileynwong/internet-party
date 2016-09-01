import requests
import twilio.twiml
import tempfile
import os

from flask import Flask, request, render_template
from boto.s3.key import Key
from boto.s3.connection import S3Connection


### S3
# Counts the number of files S3 bucket
def getNumFiles():
    # bucket_name = 'party-assets'
    # s3_bucket = S3Connection().get_bucket(bucket_name)
    # count = 0

    # for key in s3_bucket.list():
    #     count += 1

    # print str(count) + ' photos inside ' + bucket_name
    count = 55  # AWS Trial ran out, just use static assets
    return count

def upload_photo_to_s3(fileName, image_contents):
    with tempfile.NamedTemporaryFile() as f:
        # Clear buffer and write image to temporary file
        print 'Writing photo into temporary file...'
        f.truncate(0);
        f.write(image_contents)

        # Upload file to s3
        print 'Connecting to s3...'
        bucket_name = 'party-assets'
        s3_bucket = S3Connection().get_bucket(bucket_name)
        k = Key(s3_bucket)

        # Use Boto to upload file to S3 bucket
        print 'Uploading ' + fileName + ' into ' + bucket_name + '...'
        k.key = fileName
        k.set_contents_from_string(image_contents)
    print 'File uploaded :^)'


### Main
app = Flask(__name__)
app.config['S3_BUCKET_NAME'] = 'party-assets'

fileCount = getNumFiles()


### Routes
@app.route("/", methods=['GET', 'POST'])
def runDefault():
    return render_template('index.html')

@app.route("/party", methods=['GET', 'POST'])
def runHome():
    return render_template('index.html')

@app.route("/fileCount", methods=['GET', 'POST'])
def runFileCount():
    fileCount = getNumFiles()
    return str(fileCount)

@app.route("/happybirthdaysophie", methods=['GET', 'POST'])
def runBirthday():
    return render_template('birthday.html')

@app.route("/api", methods=['GET', 'POST'])
def run():
    # Parse request for image
    sms_body = request.args.get('Body')
    image_body_url = request.args.get('MediaUrl0')
    print image_body_url

    r = requests.get(image_body_url)
    print r.status_code

    image_contents = r.content

    # Save and upload image to s3
    global fileCount
    fileCount += 1
    fileCountStr = str(fileCount).zfill(4)
    fileName = 'photos/photo_' + fileCountStr + '.jpg'

    upload_photo_to_s3(fileName, image_contents)

    # Send SMS reply
    resp = twilio.twiml.Response()
    resp.message("thanks!! come join the party :^) hit up https://internet-party.herokuapp.com")
    return str(resp)


if __name__ == "__main__":
    # Bind to PORT if defined, otherwise default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
