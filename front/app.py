import os
import pymysql
from flask import Flask, request, jsonify
from flask_cors import CORS

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
STATIC_PATH = os.path.join(ROOT_PATH, 'dist')
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


@app.route("/countList", methods=['POST'])
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


@app.route("/userlist", methods=['POST'])
def get_user_list():
    sql = "select u.*, count(r.user_email) from user u LEFT OUTER JOIN request r on r.user_email = u.email group by `email`;"

    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/todayRequest", methods=['POST'])
def get_today_request():
    today_date = request.form.get("today")

    sql = "select u.userName, r.url from user u, request r where r.requestDate = %s and u.email = r.User_email"
    curs.execute(sql, today_date)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/paymentList", methods=['POST'])
def get_payment_list():
    sql = "select User_email, Payment_grade, date_format(pay_date, '%Y-%m-%d %r'), date_format(expire_date, '%Y-%m-%d %r') from User_Payment"
    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/phishingList", methods=['POST'])
def get_phishing_list():
    sql = "select url, case analysisCheck when 1 then 'Complete' else 'in progress' END, case analysisResult when 1 then 'Phishing' else 'Safe' END from sitelist"
    curs.execute(sql)
    rows = curs.fetchall()

    return jsonify(rows)


@app.route("/userRequest", methods=['POST'])
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
