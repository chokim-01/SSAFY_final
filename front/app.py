import os
import pymysql
from flask import Flask, request, jsonify
from flask_cors import CORS

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
STATIC_PATH = os.path.join(ROOT_PATH, "dist")
app = Flask(__name__, static_folder=STATIC_PATH, static_url_path='')
conn = pymysql.connect(
    host="localhost", user="root", password="toor", db="mydb")
curs = conn.cursor()

# Set CORS
cors = CORS(app, resources={
    r"/*": {"origin": "*"}
})


# Set directory path for vue
@app.route("/")
def main():
    return app.send_static_file("index.html")


###################################################
#   Member section
###################################################
@app.route("/signUp", methods=["POST"])
def signUp():
    data = request.get_json()
    userName = data.get("userName")
    email = data.get("email")
    password = data.get("password")

    print(userName)

    sql = "INSERT INTO USER (email,userName,password) VALUES (%s, %s,%s)"
    val = (email, userName, password)
    curs.execute(sql, val)
    conn.commit()
    return jsonify()


@app.route("/logIn", methods=["POST"])
def logIn():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    sql = "SELECT u.*, IFNULL(( \
                select (CASE WHEN expire_date > now() THEN payment_grade ELSE 'basic' END) \
                from user_payment \
                where User_email = %s order by expire_date limit 1 ), 'basic') as grade \
            FROM USER u, user_payment up  \
            WHERE u.email = %s AND u.password = %s limit 1"

    curs.execute(sql, (email, email, password))

    data = (curs.fetchall())
    print(data)

    return jsonify(data)


@app.route("/update", methods=["POST"])
def update():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    sql = "UPDATE USER SET userName = %s, password = %s where email = %s "

    curs.execute(sql, (password, name, email))
    conn.commit()

    return jsonify()


@app.route("/userOut", methods=["POST"])
def userOut():
    data = request.get_json()
    email = data.get("email")

    sql = "DELETE * FROM USER where email = %s"

    curs.execute(sql, email)
    data = (curs.fetchall())

    return jsonify(data)


###################################################
#   Admin section
###################################################
@app.route("/countList", methods=["POST"])
def get_count_list():
    today_date = request.form.get("today")

    sql = "select\
            (select count(*) from user) as userCount,\
            (select count(*) from user u, request r where r.requestDate = %s and u.email = r.User_email) as todayCount,\
            (select count(*) from User_Payment) as paymentCount,\
            (select count(*) from sitelist);"

    curs.execute(sql, today_date)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/userlist", methods=["POST"])
def get_user_list():
    sql = "select u.*, count(r.user_email) from user u LEFT OUTER JOIN request r on r.user_email = u.email group by `email`;"

    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/todayRequest", methods=["POST"])
def get_today_request():
    today_date = request.form.get("today")

    sql = "select u.userName, r.url from user u, request r where r.requestDate = %s and u.email = r.User_email"

    curs.execute(sql, today_date)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/paymentList", methods=["POST"])
def get_payment_list():
    sql = "select User_email, Payment_grade, date_format(pay_date, '%Y-%m-%d %r'), date_format(expire_date, '%Y-%m-%d %r') from User_Payment"

    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/phishingList", methods=["POST"])
def get_phishing_list():
    sql = "select url, case analysisCheck when 1 then 'Complete' else 'in progress' END, case analysisResult when 1 then 'Phishing' else 'Safe' END from sitelist"

    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/userRequest", methods=["POST"])
def get_user_request():
    email = request.form.get("email")

    sql = "select r.url, date_format(r.requestDate, '%%Y-%%m-%%d'),\
          case s.analysisCheck when 1 then 'Complete' else 'in progress' END,\
          case s.analysisResult when 1 then 'Phishing' else 'Safe' END \
          from Request r, SiteList s \
          where r.User_email = %s and r.url = s.url order by requestDate desc"

    curs.execute(sql, email)
    rows = curs.fetchall()

    return jsonify(rows)


if __name__ == '__main__':
    app.run()
