from boggle import Boggle
from flask import Flask, redirect, session, request, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.debug = True

app.config['SECRET_KEY'] = 'not-so-secret'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)


boggle_game = Boggle()

@app.route('/')
def home():
    return render_template('home.html')
