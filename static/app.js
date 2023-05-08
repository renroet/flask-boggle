const $body = $('body')

const $formSubmit = $('#guess button')
const $form = $('#guess')
const $msg = $('#result')
const $scoreText = $('#score-text')
const $game = $('#game')
// const $restart = $('.restart')

// $restart.on('click', function() {
//     location.reload()})

// $guess = $form.value()


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

    // showFinalScore() {
    //     const $final = $('#final-score').append(`<p class="final">${this.score}</p>`)
    //     $('#final-score').show()
    // }

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
        
        // const res = await axios.get('/high_score', {params: {score: score}})
        // const hiScore = result.data
        // if(score > hiScore) {
        //     this.updateHighScore(score)
        //     $final.append('<p class="final">HIGH SCORE!</p>')
        // }
        const res = await axios.post('/high_score', {score: score})
        if (res.data.newHighScore) {
            $final.append('<p class="high-score">HIGH SCORE!</p>')
        }
        $final.show()
    }

    

    // async updateHighScore(score) {
    //     const res = await axios.post('/high_score', {score: score})
    //     if (newHighScore) {

    //     }
    // }

    // $.ajax({
    //     type: 'POST',
    //     url: '/process',
    //     data: JSON.stringify(value_data),
    //     contentType: 'application/json',
    //     success: function (response_data) {
    //         alert("success");
    //     }   
    // });

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
    
    // $formSubmit.on('click', handleSubmit)

}

const myBoggle = new BoggleGame($game, secs = 60)









// async function handleSubmit(e) {
//     e.preventDefault()
//     word = $('input:text').val()
//     if(checkSeen(word)) {
//         $msg.text('Word already submitted')
//         return 
//     }
//     else {
//         res = await axios.get('/check', {params: {word: word}})
//         result = res.data['result']
//         notifyPlayer(result)
//         if(result === 'ok') {
//             updateSeen(word)
//             updateScore(word)
//         }
//     }
// }



// $formSubmit.on('click', handleSubmit)

// probably put a timer on the event listener to disable any more clicks


