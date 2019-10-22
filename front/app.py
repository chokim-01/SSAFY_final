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


@app.route("/userlist", methods=['POST'])
def get_user_list():
    sql = "select u.*, count(r.user_email) from user u LEFT OUTER JOIN request r on r.user_email = u.email group by `email`;"

    curs.execute(sql)
    rows = curs.fetchall()
    print(rows)
    return jsonify(rows)


@app.route("/today_request", methods=['POST'])
def get_today_request():
    today_date = request.form.get("today")

    sql = "select u.userName, r.url from user u, request r where r.requestDate = %s and u.email = r.User_email"
    curs.execute(sql, today_date)
    rows = curs.fetchall()
    print(rows)
    return jsonify(rows)


if __name__ == '__main__':
    app.run()
