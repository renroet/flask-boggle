from boggle import Boggle
from flask import Flask, redirect, session, request, render_template, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.debug = True

app.config['SECRET_KEY'] = 'not-so-secret'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


boggle_game = Boggle()

@app.route('/start')
def start():
    return render_template('start.html')

@app.route('/set-up', methods=['POST'])
def home():
    board = boggle_game.make_board()
    session['board'] = board
    board = session['board']
    return redirect('/play')

@app.route('/play')
def play():
    board = session['board']
    return render_template('home.html', board=board)

@app.route('/check')
def check():
    word = request.args['word']
    board = session['board']
    return jsonify(result = boggle_game.check_valid_word(board, word))

@app.route('/high_score', methods=['POST'])
def high_score():
    score = request.json['score']
    session['score'] = score
    num_plays = session.get('num_plays', 0)
    high_score = session.get('high_score', 0) 
    session['high_score'] = max(score, high_score)
    session['num_plays'] = num_plays + 1
    return jsonify(newHighScore=score > high_score)




