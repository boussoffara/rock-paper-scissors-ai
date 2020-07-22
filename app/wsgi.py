from flask_sqlalchemy import SQLAlchemy

from app import app


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test-db.sqlite3"
db = SQLAlchemy(app)

if __name__ == "main":
    app.run()
