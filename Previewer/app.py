from flask import Flask, jsonify, request
from urllib3 import PoolManager, Timeout
from flask_cors import CORS
import certifi
import ssl
import OpenSSL

app = Flask(__name__, static_url_path='')

# Set CORS
cors = CORS(app, resources={
    r"/api/*": {"origin": "*"}
})

http = PoolManager(
      cert_reqs='CERT_REQUIRED', # Force certificate check.
      ca_certs=certifi.where(),  # Path to the Certifi bundle.
)


# Get certificate info
@app.route("/api/get/ssl", methods=["POST"])
def getCertificate():
    # Get data
    parsed_uri = request.get_data().decode('utf-8')

    # replace url, need host url . ex) www.google.com
    replace_url = parsed_uri.replace("http://","").replace("https://","")
    host_url_end = replace_url.find("/")
    host_url = replace_url[:host_url_end]

    # certificate request
    cert = ssl.get_server_certificate((host_url,443))
    x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
    ssl_info = x509.get_subject().get_components()

    # HSTS check
    http = PoolManager(timeout=Timeout(read=2.0))
    check = http.request('GET', host_url, headers={'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0)'},timeout=2)
    response=check.headers

    # Make return status
    result = dict()
    result['hsts'] = True
    for ssl_data in ssl_info:
        result[ssl_data[0].decode('utf-8')] = ssl_data[1].decode('utf-8')
        print(result[ssl_data[0].decode('utf-8')])

    if 'strict-transport-security' in response:
        result['hsts'] = False
        print('hsts policy secure')

    return jsonify(result)


@app.route("/api/get/check_secure", methods=["POST"])
def check_secure():
    # Get data
    string_data = request.get_data().decode('utf-8')

    return jsonify(1)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
