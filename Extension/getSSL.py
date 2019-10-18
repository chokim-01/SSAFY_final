from flask import Flask, jsonify, request
from flask_cors import CORS
import ssl
import OpenSSL

app = Flask(__name__, static_url_path='')

# Set CORS
cors = CORS(app, resources={
    r"/api/*": {"origin": "*"}
})

# Get certificate info
@app.route("/api/get/ssl", methods=["POST"])
def getCertificate():
    parsed_uri = request.get_data().decode('utf-8')

    # replace url, need host url . ex) www.google.com
    replace_url = parsed_uri.replace("http://","").replace("https://","")
    host_url_end = replace_url.find("/")
    host_url = replace_url[:host_url_end]

    # certificate request
    cert = ssl.get_server_certificate((host_url,443))
    x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
    ssl_info = x509.get_subject().get_components()
    s = x509.get_subject()
    print(s)

    print("=========== section end ============")

    result = dict()
    for i in ssl_info:
        result[i[0].decode('utf-8')] = i[1].decode('utf-8')
        print(result[i[0].decode('utf-8')])
    return jsonify(ssl_info)

def main():
    app.run(debug=True)

if __name__ == '__main__':
    main()
