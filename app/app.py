
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from flask import send_from_directory

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test-db.sqlite3'
db = SQLAlchemy(app)

@app.route('/')
def hello():
  return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)
