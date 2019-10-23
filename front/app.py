import os
import pymysql
from flask import Flask, jsonify, request, json

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
STATIC_PATH = os.path.join(ROOT_PATH, 'dist')
app = Flask(__name__, static_folder=STATIC_PATH, static_url_path='')
conn = pymysql.connect(
    host="localhost", user="root", password="1234", db="mydb")
curs = conn.cursor()

# Set directory path for vue
@app.route("/")
def main():
    return app.send_static_file("index.html")


@app.route("/signUp", methods=['POST'])
def signUp():
    data = request.get_json()
    userName = data.get('userName')
    email = data.get('email')
    password = data.get('password')

    sql = "INSERT INTO USER (email,userName,password,Payment_grade) VALUES (%s, %s,%s,%s)"
    val = (email, userName, password, "basic")
    curs.execute(sql, val)
    conn.commit()
    return jsonify()


@app.route("/logIn", methods=['POST'])
def logIn():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    sql = "SELECT * FROM USER where email = %s AND password = %s"
    val = (email, password)
    curs.execute(sql, val)

    data = (curs.fetchall())
    print(data)

    return jsonify(data)


@app.route("/update", methods=['POST'])
def update():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    sql = "UPDATE USER SET userName = %s, password = %s where email = %s "
    val = (password, name, email)
    curs.execute(sql, val)
    conn.commit()

    return jsonify()


@app.route("/userOut", methods=['POST'])
def userOut():
    data = request.get_json()
    email = data.get('email')
    grade = data.get('grade')

    sql = "DELETE * FROM USER where email = %s"
    val = (email)

    curs.execute(sql, val)
    data = (curs.fetchall())

    return jsonify(data)


if __name__ == '__main__':
    app.run()
