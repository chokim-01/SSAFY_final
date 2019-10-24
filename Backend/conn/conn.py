import pymysql


def db():
    return pymysql.connect(host="localhost", port=3306, user="root", passwd="toor", db="mydb", charset="utf8", cursorclass=pymysql.cursors.DictCursor)


def cursor():
    return db.cursor()

