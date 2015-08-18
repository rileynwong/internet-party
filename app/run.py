from flask import Flask, request, redirect, jsonify, render_template
import requests
import twilio.twiml
import tempfile
import os, json
import boto
from boto.s3.key import Key
from boto.s3.connection import S3Connection

isfile = os.path.isfile
join = os.path.join

app = Flask(__name__)
app.config['S3_BUCKET_NAME'] = 'party-assets'

# Helpers
def getNumFiles():

    # Counts the number of files S3 bucket
    bucket_name = 'party-assets'
    s3_bucket = S3Connection().get_bucket(bucket_name)
    count = 0

    for key in s3_bucket.list():
        count += 1

    print str(count) + ' photos inside ' + bucket_name
    return count

path = app.static_folder + '/photos'
print path
fileCount = getNumFiles()

# Routes
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

@app.route('/sign_s3')
def sign_s3():
    AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
    AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
    S3_BUCKET = os.environ.get('S3_BUCKET')

    object_name = urllib.quote_plus(request.args.get('file_name'))
    mime_type = request.args.get('file_type')

    expires = int(time.time()+60*60*24)
    amz_headers = "x-amz-acl:public-read"

    string_to_sign = "PUT\n\n%s\n%d\n%s\n/%s/%s" % (mime_type, expires, amz_headers, S3_BUCKET, object_name)

    signature = base64.encodestring(hmac.new(AWS_SECRET_KEY.encode(), string_to_sign.encode('utf8'), sha1).digest())
    signature = urllib.quote_plus(signature.strip())

    url = 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, object_name)

    content = json.dumps({
        'signed_request': '%s?AWSAccessKeyId=%s&Expires=%s&Signature=%s' % (url, AWS_ACCESS_KEY, expires, signature),
        'url': url,
        })
    return content

@app.route("/api", methods=['GET', 'POST'])
def run():
    sms_body = request.args.get('Body')
    image_body_url = request.args.get('MediaUrl0')
    print image_body_url

    # Save image
    r = requests.get(image_body_url)
    print r.status_code
    image_contents = r.content

    global fileCount
    fileCount += 1
    fileCountStr = str(fileCount).zfill(4)
    fileName = '/photos/photo_' + fileCountStr + '.jpg'

    with tempfile.NamedTemporaryFile() as f:
        # Clear buffer and write image to temporary file
        f.truncate(0);
        f.write(image_contents)
        print 'Photo written into dir'

        # Upload file to s3
        bucket_name = 'party-assets'
        s3_bucket = S3Connection().get_bucket(bucket_name)
        print 'connect to boto'
        k = Key(s3_bucket)
        print 'set bucket and key vars'

        # Use Boto to upload file to S3 bucket
        photo_file = f.read()
        print 'set photo file'
        k.key = fileName
        print 'Uploading photo into ' + bucket_name + ' with key: ' + k.key
        k.set_contents_from_string(photo_file)

    # Send SMS reply
    resp = twilio.twiml.Response()
    resp.message("thanks!! hit up https://internet-party.herokuapp.com")
    return str(resp)

if __name__ == "__main__":
    # Bind to PORT if defined, otherwise default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
