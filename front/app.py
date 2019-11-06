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

    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    auth = data.get('auth')

    sql = "INSERT INTO USER (email,name,password,auth) VALUES (%s, %s,%s,%s)"
    val = (email, name, password,auth)

    curs.execute(sql, val)
    conn.commit()
    return jsonify()


@app.route("/logIn", methods=["POST"])
def logIn():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    sql = "SELECT * FROM USER where email = %s and password = %s"
    val = (email,password)
    curs.execute(sql, val)

    data = (curs.fetchall())

    return jsonify(data)


@app.route("/update", methods=['POST'])
def update():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    sql = "UPDATE USER SET name = %s, password = %s where email = %s "
    val = (name, password, email)
    curs.execute(sql, val)
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
            (select count(*) from user u, request r where r.request_date = %s and u.email = r.email) as todayCount,\
            (select count(*) from User_Payment) as paymentCount,\
            (select count(*) from sitelist);"

    curs.execute(sql, today_date)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/userlist", methods=["POST"])
def get_user_list():
    sql = "select u.*, count(r.email) from user u LEFT OUTER JOIN request r on r.email = u.email group by `email`;"

    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/todayRequest", methods=["POST"])
def get_today_request():
    today_date = request.form.get("today")

    sql = "select u.name, r.url from user u, request r where r.request_date = %s and u.email = r.email"

    curs.execute(sql, today_date)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/paymentList", methods=["POST"])
def get_payment_list():
    sql = "select email, grade, date_format(payment_date, '%Y-%m-%d %r'), date_format(expire_date, '%Y-%m-%d %r') from User_Payment"

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

    sql = "select r.url, date_format(r.request_date, '%%Y-%%m-%%d'),\
          case s.analysisCheck when 1 then 'Complete' else 'in progress' END,\
          case s.analysisResult when 1 then 'Phishing' else 'Safe' END \
          from Request r, SiteList s \
          where r.email = %s and r.url = s.url order by request_date desc"

    curs.execute(sql, email)
    rows = curs.fetchall()

    return jsonify(rows)


if __name__ == '__main__':
    app.run()
