import os
import ssl
import socket
import pymysql
import hashlib
import certifi
import OpenSSL
import requests
import conn.conn as conn
from urllib3 import PoolManager, Timeout
from datetime import datetime
from flask_cors import CORS
from flask import Flask, jsonify, request

# User password salt
SALT = "SSAFY_FINAL_PJT"

# Certificate check
http = PoolManager(
    cert_reqs="CERT_REQUIRED",
    ca_certs=certifi.where(),
)

# Set directory path for vue.js static file
ROOT_PATH = os.path.dirname(os.path.abspath("__file__"))
STATIC_PATH = os.path.join(ROOT_PATH, "dist")

# Flask run at STATIC_PATH
app = Flask("__name__", static_folder=STATIC_PATH, static_url_path='')

cors = CORS(app, resources={
    r"/*": {"origin": "*"}
})


def get_today():
    """
    Get today
    :return: YYYYMMDD
    """
    return datetime.today().strftime('%Y-%m-%d')


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.errorhandler(404)
def page_not_found(e):
    return app.send_static_file("index.html")


################################################
#                  Chrome section
################################################

@app.route("/post/chrome/signIn", methods=["POST"])
def chrome_sign_in():
    # Get user information
    request_data = request.form

    email = request_data.get("email")
    password = request_data.get("password") + SALT
    password = hashlib.sha256(password.encode()).hexdigest()

    cursor = conn.db().cursor()
    sql = "select * from User where email = %s and password = %s"
    cursor.execute(sql, (email, password))

    # Get one user
    result = cursor.fetchone()

    # If email or password does not match
    if isinstance(result, type(None)):
        return jsonify({"status":"failed","message": "회원정보를 다시 확인해주세요."})

    # Get user's grade
    cursor = conn.db().cursor()
    sql = "select grade from User_Payment where email = %s";
    cursor.execute(sql, result['email'])

    user_grade = cursor.fetchone()

    result['status'] = "success"
    result['grade'] = user_grade

    return jsonify(result)


@app.route("/post/chrome/siteRequest", methods=["POST"])
def chrome_user_site_request():

    request_data = request.form
    current_date = get_today()
    url = request_data.get("url")
    url = url.replace("http://", "").replace("https://", "")
    email = request_data.get("email")

    if '.' not in url:
        return jsonify({"message": "해당 사이트가 이미 전달되었거나 올바르지 않은 url입니다."})

    db = conn.db()
    cursor = db.cursor()

    sql = "insert into RequestList (url, request_date, email, analysis_check) values(%s, %s, %s, 0)"

    try:
        cursor.execute(sql, (url, current_date, email))
        db.commit()
    except pymysql.err.IntegrityError as e:
        return jsonify({"message": "해당 사이트가 이미 전달되었거나 올바르지 않은 url입니다."})

    return jsonify({"message": "사이트를 전달하였습니다."})


@app.route("/post/chrome/xssCheck", methods=["POST"])
def chrome_xss_check():

    page_data = request.get_data().decode("UTF-8")

    cursor = conn.db().cursor()
    sql = "select * from XssList"
    cursor.execute(sql)

    result = cursor.fetchall()

    xss_flag = False

    for xss in result:
        if xss["gadget"] in page_data:
            xss_flag = True
            break

    return jsonify({"xssFlag": xss_flag})


@app.route("/post/chrome/phishingCheck", methods=["POST"])
def chrome_phishing_check():

    url = request.get_data().decode("UTF-8")

    url = url.replace("http://", "").replace("https://", "")

    cursor = conn.db().cursor()
    sql = "select * from RequestList where url = %s and analysis_check = 1"
    cursor.execute(sql, url)

    result = cursor.fetchone()

    if result == None:
        return jsonify({"phishingFlag": False})

    return jsonify({"phishingFlag": True})


################################################
#                  HSTS section
################################################

@app.route("/post/hsts", methods=["POST"])
def hsts_check():
    """
    HSTS check API
    url
    :return: json type message
    """

    # Get URL
    url = request.get_data().decode("UTF-8")

    # Get host of URL
    url = url.replace("https://", "").replace("http://", "")
    host = url[:url.find("/")]

    site_data = dict()
    ssl_info = ''

    # Get certificate data
    try:
        certificate = ssl.get_server_certificate((host, 443))
        x_dot_509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, certificate)
        ssl_info = x_dot_509.get_subject().get_components()
    except ssl.SSLError as e:
        site_data["sslfail"] = str(e)
    except socket.gaierror as e:
        site_data["sslfail"] = "인증서를 사용하지 않는 사이트입니다."

    # HSTS check
    http = PoolManager(timeout=Timeout(read=2.0))
    request_of_host = http.request("GET", host, headers={"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0)"}, timeout=2)
    response_of_host = request_of_host.headers

    # HSTS check
    if ssl_info:
        for ssl_data in ssl_info:
            site_data[ssl_data[0].decode("UTF-8")] = ssl_data[1].decode("UTF-8")

    if "strict-transport-security" in response_of_host:
        site_data["hsts"] = True

    return jsonify(site_data)


################################################
#                  User Section
################################################


@app.route("/post/signUp", methods=["POST"])
def sign_up():
    """
    User signUp API
    email, name, password, auth
    :return: json type message
    """

    request_data = request.get_json()
    print("here")
    # Get user data
    email = request_data.get("email")
    name = request_data.get("name")
    auth = request_data.get("auth")

    # SHA256 hashing with SALT
    password = request_data.get("password") + SALT
    password = hashlib.sha256(password.encode()).hexdigest()

    db = conn.db()
    cursor = db.cursor()

    sql = "insert into User (email, name, password, auth) values (%s, %s, %s, %s)"

    # User email existed check
    try:
        cursor.execute(sql, (email, name, password, auth))
    except pymysql.err.IntegrityError as e:
        return jsonify({"message": "중복된 계정입니다."})

    db.commit()

    return jsonify({"message": "가입완료."})


@app.route("/post/signIn", methods=["POST"])
def sign_in():
    """
    User Login API
    emain, password
    :return: json type message
    """

    request_data = request.get_json()

    # Get user data
    email = request_data.get("email")

    # SHA256 hashing with SALT
    password = request_data.get("password") + SALT
    password = hashlib.sha256(password.encode()).hexdigest()

    cursor = conn.db().cursor()
    sql = "select * from User where email = %s and password = %s"
    cursor.execute(sql, (email, password))

    # Get one user
    result = cursor.fetchone()

    # If email or password does not match
    if isinstance(result, type(None)):
        return jsonify({"result":"false","message": "회원정보를 다시 확인해주세요."})
    result["result"] = "true"

    return jsonify(result)


@app.route("/post/editUser", methods=["POST"])
def edit_user():
    """
    User update API
    email, name, password
    :return: json type message
    """

    request_data = request.get_json()

    # Get user data
    email = request_data.get("email")
    name = request_data.get("name")

    # SHA256 hashing with SALT
    password = request_data.get("password") + SALT
    password = hashlib.sha256(password.encode()).hexdigest()

    db = conn.db()
    cursor = db.cursor()

    sql = "update User set name = %s, password = %s where email = %s"

    cursor.execute(sql, (name, password, email))

    db.commit()

    return jsonify({"message": "수정이 완료되었습니다."})


@app.route("/post/deleteUser", methods=["POST"])
def delete_user():
    """
    Delete User API
    :return: json type message
    """

    request_data = request.get_json()

    # Get user data
    email = request_data.get("email")

    db = conn.db()
    cursor = db.cursor()

    sql = "delete from User where email = %s"

    cursor.execute(sql, email)

    db.commit()

    return jsonify({"message": "탈퇴가 완료되었습니다."})


@app.route("/post/getPayment", methods=["POST"])
def get_user_payment():
    email = request.form.get("email")

    db = conn.db()
    cursor = db.cursor()

    sql = "SELECT (CASE WHEN expire_date > now() THEN grade ELSE 'basic' END) as grade, \
            date_format(payment_date, '%%Y-%%m-%%d') as payment_date,  date_format(expire_date, '%%Y-%%m-%%d') as expire_date \
            FROM User_Payment WHERE email= %s ORDER BY expire_date limit 1"

    cursor.execute(sql, email)
    data = (cursor.fetchall())

    return jsonify(data)

@app.route("/post/getPaymentGrade", methods=["POST"])
def get_payment_grade():
    db = conn.db()
    cursor = db.cursor()
    sql = "SELECT * FROM Payment"
    cursor.execute(sql)
    data = (cursor.fetchall())
    return jsonify(data)

@app.route("/post/getPaymentHistory", methods=["POST"])
def get_user_payment_history():
    email = request.form.get("email")
    db = conn.db()
    cursor = db.cursor()
    sql = "SELECT grade, date_format(payment_date, '%%Y-%%m-%%d') as payment_date, date_format(expire_date, '%%Y-%%m-%%d') as expire_date FROM user_payment WHERE email=%s ORDER BY expire_date DESC"
    cursor.execute(sql, email)
    data = (cursor.fetchall())
    return jsonify(data)

################################################
#                  Admin Section
################################################


@app.route("/get/allCount", methods=["GET"])
def get_all_count():
    """
    Get user, request, payments, phishing site count API
    :return: Json type each count
    """

    # Calculate today YYYY-MM-DD
    today = get_today()

    cursor = conn.db().cursor()

    # Get user, request, payments, phishing site count
    sql = "select\
            (select count(*) from User) as userCount,\
            (select count(*) from User u, RequestList r where r.request_date = %s and u.email = r.email) as todayCount,\
            (select count(*) from User_Payment) as paymentCount,\
            (select count(*) from RequestList where analysis_check=1) as siteCount"

    cursor.execute(sql, today)

    result = cursor.fetchall()

    print("#############################")
    print(result)

    return jsonify(result)


@app.route("/get/userList", methods=["GET"])
def get_user_list():
    """
    Get user list
    :return: json type user list
    """

    cursor = conn.db().cursor()

    sql = "select u.*, count(r.email) as requestCount from User u LEFT OUTER JOIN RequestList r on r.email = u.email group by email"

    cursor.execute(sql)

    result = cursor.fetchall()

    return jsonify(result)


@app.route("/get/todayRequest", methods=["GET"])
def get_today_request():
    """
    Get today request list API
    :return: json type request list
    """

    # Calculate today YYYY-MM-DD
    today = get_today()

    cursor = conn.db().cursor()

    sql = "select email, url, analysis_check as analysisResult from RequestList where request_date = %s"

    cursor.execute(sql, today)

    result = cursor.fetchall()

    return jsonify(result)


@app.route("/get/paymentList", methods=["GET"])
def get_payment_list():
    """
    Get payments list API
    :return: json type payments list
    """
    cursor = conn.db().cursor()

    sql = "select email, grade, date_format(payment_date, '%Y-%m-%d %r') as payment_date," \
          "date_format(expire_date, '%Y-%m-%d %r') as expire_date from User_Payment"

    cursor.execute(sql)

    result = cursor.fetchall()

    return jsonify(result)


@app.route("/get/phishingList", methods=["GET"])
def get_phishing_list():
    """
    Get phishing site list API
    :return: json type phishing site list
    """

    cursor = conn.db().cursor()

    sql = "select url from RequestList where analysis_check=1"

    cursor.execute(sql)

    result = cursor.fetchall()

    return jsonify(result)


@app.route("/post/oneUserRequest", methods=["POST"])
def get_one_user_request():
    """
    Get one user request API
    :return: json type one user requests
    """

    email = request.form.get("email")

    cursor = conn.db().cursor()

    sql = "select url, date_format(request_date, '%%Y-%%m-%%d') as request_date, analysis_check as result\
            from RequestList \
            where email = %s order by request_date desc"

    cursor.execute(sql, email)

    result = cursor.fetchall()

    return jsonify(result)

@app.route("/post/changeAnalysisResult", methods=["POST"])
def post_change_Analysis_Result():
    """
    Post change analysisResult
    :return: json type change analysisResult
    """
    db = conn.db()
    url = request.form.get("url")

    cursor = db.cursor()

    sql = "update RequestList set analysis_check=NOT analysis_check where url=%s"
    cursor.execute(sql, url)
    db.commit()

    return jsonify()

################################################
#                  Pay Section
################################################
@app.route("/post/pay",methods=["POST"])
def post_pay():
    """
    Post pay info
    :return: tid, next_redirect_pc_url
    """
    amount=request.form.get("amount")
    grade=request.form.get("grade")
    print(amount)
    url = "https://kapi.kakao.com"
    headers = {
        'Authorization': "KakaoAK " + "d3b28bf93c1e44abe14dcce6278f42ba",
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
    params = {
        'cid': "TC0ONETIME",
        'partner_order_id': '1001',
        'partner_user_id': 'test',
        'item_name': grade,
        'quantity': 1,
        'total_amount': amount,
        'vat_amount': 0,
        'tax_free_amount': 0,
        'approval_url': 'http://localhost:8080/payComplete',
        'fail_url': 'http://localhost:8080',
        'cancel_url': 'http://localhost:8080',
    }
    response = requests.post(url + "/v1/payment/ready", params=params, headers=headers)
    result=response.json()
    print(result)
    return jsonify(result)

@app.route("/post/payComplete",methods=["POST"])
def post_pay_complete():
    """
    post pg_token, tid, total_amount
    :return: payment info
    """
    pg_token=request.form.get("pg_token")
    tid=request.form.get("tid")
    total_amount=request.form.get("total_amount")
    url = "https://kapi.kakao.com"
    headers ={
        'Authorization': "KakaoAK " + "d3b28bf93c1e44abe14dcce6278f42ba",
        'Content-type': 'application / x - www - form - urlencoded;charset = utf - 8'
    }
    params = {
        'cid': 'TC0ONETIME',
        'tid': tid,
        'partner_order_id': '1001',
        'partner_user_id': 'test',
        'pg_token': pg_token,
        'total_amount' : total_amount
    }
    response=requests.post(url+"/v1/payment/approve",params=params,headers=headers)
    return jsonify(response.json())

@app.route("/post/price",methods=["POST"])
def post_price():
    """
    post grade
    :return: price of grade
    """
    grade=request.form.get("grade")
    cursor = conn.db().cursor()
    print(grade)
    sql = "select price from payment where grade= %s"
    cursor.execute(sql,grade)
    res=cursor.fetchall()

    return jsonify(res)

@app.route("/post/addPay",methods=["POST"])
def add_pay():
    """
    post pay history
    :return:
    """
    approved_time=request.form.get("approved_time")
    approved_time=approved_time.split("T")
    time=approved_time[0]+" "+approved_time[1]
    grade=request.form.get("grade")
    email=request.form.get("email")
    db = conn.db()
    cursor = db.cursor()

    sql= "insert into user_payment values(%s,%s,%s,date_add(%s, interval 1 month));"
    cursor.execute(sql,(email,grade,time,time))

    db.commit()

    return jsonify()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
