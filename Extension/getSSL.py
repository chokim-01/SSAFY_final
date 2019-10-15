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

    url = request.form.get("data")

    cert = ssl.get_server_certificate(url,443)
    x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
    ssl_info = x509.get_subject().get_components()

    for i in ssl_info:
        print(i)

    return jsonify(ssl_info)

def main():
    app.run(debug=True)

if __name__ == '__main__':
    main()
