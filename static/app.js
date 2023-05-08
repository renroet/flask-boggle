const $body = $('body')

const $formSubmit = $('#guess button')
const $form = $('#guess')
const $msg = $('#result')
const $scoreText = $('#score-text')
const $game = $('#game')


class BoggleGame {
    constructor($game, secs = 60) {
        this.game = $game;
        this.secs = secs;
        this.seen = [];
        this.score = 0;
        this.countDown = setInterval(this.timer.bind(this), 1000)
        this.start = $formSubmit;
        this.msg = $msg ;
        this.start.on('click', this.handleSubmit.bind(this))
    }

    
    timer() {
        if(this.secs > 0 ) {
            this.secs -= 1 
        }
        else {   
            clearInterval(this.countDown) 
            $('#guess', this.game).hide()
            this.showFinalScore()
            
        }
    }

    async showFinalScore() {
        let score = this.score
        const $final = $('#final-score').append(`<p class="final">${this.score}
        <form action="/set-up" method="POST" class="restart"> <button>RESTART</button></form></p>`)
        
        
        const res = await axios.post('/high_score', {score: score})
        if (res.data.newHighScore) {
            $final.append('<p class="high-score">HIGH SCORE!</p>')
        }
        $final.show()
    }

    

    updateScore(word) {
        let points = word.length
        let score = parseInt($('#score-text').text())
        this.score += points
        $scoreText.text(this.score)
    }

    checkSeen(word) {
        return this.seen.includes(word)
    }

    updateSeen(word) {
        this.seen.push(word)
    }

    notifyPlayer(word, result) {
        $msg.text(`${word} ${result}`)
    }


    async handleSubmit(e) {
        e.preventDefault()
        let word = $('input:text').val()
        if(this.checkSeen(word)) {
            $msg.text(`${word} already submitted`)
            return 
        }
        else {
            const res = await axios.get('/check', {params: {word: word}})
            const result = res.data['result']
            this.notifyPlayer(word, result)
            if(result === 'ok') {
                this.updateSeen(word)
                this.updateScore(word)
            }
        }
        $('input:text').val('') 
    }
    

}

const myBoggle = new BoggleGame($game, secs = 60)

