from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):
    def test_start(self):
        with app.test_client() as client:
            resp = client.get('/start')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Let's play Boggle!</h1>", html)

    def test_redirect_to_home(self):
        with app.test_client() as client:
            resp = client.post('/set-up', follow_redirects=True)
            html=resp.get_data(as_text=True)

            self.assertEqual(len(session['board']), 5)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("</tr>", html)

    def test_check(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [['A','B','C','D','E'],['A','A','C','D','E'],['A','B','C','D','E'],['A','B','C','D','E'],['A','B','C','D','E']]

            resp = client.get('/check', query_string={'word': 'CAB'})

                

            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.json['result'])

    def test_high_score(self):
        with app.test_client() as client:
            # with client.session_transaction() as session:


            resp = client.post('high_score', json={"score":15})
            

            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.json['newHighScore'])

    # TODO -- write tests for every view function / feature!

