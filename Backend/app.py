import os
import pymysql
import hashlib
import conn.conn as conn
from datetime import datetime
from flask_cors import CORS
from flask import Flask, jsonify, request

SALT = "SSAFY_FINAL_PJT"


# Set directory path for vue.js static file
ROOT_PATH = os.path.dirname(os.path.abspath("__file__"))
STATIC_PATH = os.path.join(ROOT_PATH, "dist")


# Flask run at STATIC_PATH
app = Flask("__name__", static_folder=STATIC_PATH, static_url_path='')

cors = CORS(app, resources={
    r"/*": {"origin": "*"}
})


def get_today():
    return datetime.today().strftime('%Y-%m-%d')


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.errorhandler(404)
def page_not_found(e):
    return app.send_static_file("index.html")


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

    # Get user data
    email = request_data.get("email")
    name = request_data.get("name")
    auth = request_data.get("auth")

    # SHA256 hashing with SALT
    password = request_data.get("password") + SALT
    password = hashlib.sha256(password.encode()).hexdigest()

    db = conn.db()
    cursor = db.cursor()

    sql = "insert into user (email, name, password, auth) values (%s, %s, %s, %s)"

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
    sql = "select * from user where email = %s and password = %s"
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

    print(request_data)
    db = conn.db()
    cursor = db.cursor()

    sql = "update user set name = %s, password = %s where email = %s"

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

    sql = "delete * from user where email = %s"

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
            FROM user_payment WHERE email= %s ORDER BY expire_date limit 1;"

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
    print(today)


    # Get user, request, payments, phishing site count
    sql = "select\
            (select count(*) from user) as userCount,\
            (select count(*) from user u, request r where r.request_date = %s and u.email = r.email) as todayCount,\
            (select count(*) from User_Payment) as paymentCount,\
            (select count(*) from sitelist) as siteCount"

    cursor.execute(sql, today)

    result = cursor.fetchall()

    return jsonify(result)


@app.route("/get/userList", methods=["GET"])
def get_user_list():
    """
    Get user list
    :return: json type user list
    """

    cursor = conn.db().cursor()

    sql = "select u.*, count(r.email) as requestCount from user u LEFT OUTER JOIN request r on r.email = u.email group by `email`"

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

    sql = "select u.name as name, r.url as url from user u, request r where r.request_date = %s and u.email = r.email"

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

    sql = "select url, case analysisCheck when 1 then 'Complete' else 'in progress' END as analysis, " \
          "case analysisResult when 1 then 'Phishing' else 'Safe' END as result from sitelist"

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

    sql = "select r.url, date_format(r.request_date, '%%Y-%%m-%%d') as request_date,\
              case s.analysisCheck when 1 then 'Complete' else 'in progress' END as analysis,\
              case s.analysisResult when 1 then 'Phishing' else 'Safe' END as result\
              from Request r, SiteList s \
              where r.email = %s and r.url = s.url order by request_date desc"

    cursor.execute(sql, email)

    result = cursor.fetchall()

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
