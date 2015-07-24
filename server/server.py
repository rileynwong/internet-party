from flask import Flask, request, redirect
import requests
import twilio.twiml

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def run():
  sms_body = request.args.get('Body')
  image_body_url = request.args.get('MediaUrl0')
  print image_body_url
#save image
  r = requests.get(image_body_url)
  print r.status_code
  image_contents = r.content
  with open('../photos/test.jpg', 'w') as f:
      f.write(image_contents)

  resp = twilio.twiml.Response()
  resp.message("thanks!! hit up http://104.130.174.85")
  return str(resp)

if __name__ == "__main__":
    #app.run(debug=True, host='0.0.0.0')
    app.run(debug=True)
