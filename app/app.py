
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
from flask import send_from_directory
from . import *

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test-db.sqlite3'
db = SQLAlchemy(app)





@app.route('/')
def hello():
  return render_template('index.html')

@app.route('/play',methods=['POST'])
def play():
    global  output
    if output=="":
        first=random.choice("RPS")
        output=player(request.form['me'].upper(),first,history,memory,level,ensemble_min_score,models_inp,models_out,models_ens,models)
        return jsonify({'him': first.lower()})
    else:
        ret=output
        output=player(request.form['me'].upper(),output,history,memory,level,ensemble_min_score,models_inp,models_out,models_ens,models)
        return jsonify({'him': ret.lower()})


    print(history.history)
    return jsonify({'him': output.lower()})

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)
