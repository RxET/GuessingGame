var Game = function (){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function newGame () {
  return new Game();
}

function generateWinningNumber () {
  min = Math.ceil(1);
  max = Math.floor(101);
  return Math.floor(Math.random() * (max - min)) + min;
}

Game.prototype.provideHint = function () {
  var hints = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  return shuffle(hints);
}

/* Use Durstenfeld Shuffle instead? */
//Fisher-Yates Shuffle
function shuffle (arr) {
  var count = arr.length; 
  var temp;
  var rand;

  // While there remain elements to shuffle…
  while (count) {
    // Pick a remaining element…
    rand = Math.floor(Math.random() * count--);
    // And swap it with the current element.
    temp = arr[count];
    arr[count] = arr[rand];
    arr[rand] = temp;
  }
  return arr;	
}

Game.prototype.difference = function () {
  return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
  }

Game.prototype.playersGuessSubmission = function (num) {
  if (num < 1 || num > 100 || typeof(num) !== "number" || !num ) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = num;
  // console.log("Guess is: "+num);
  // console.log("Type of guess is: "+typeof(num));
  return this.checkGuess(this.playersGuess);
}

Game.prototype.checkGuess = function (guess) {
  // console.log('Guess is: '+guess);
  // console.log(this.winningNumber);
  if (guess === this.winningNumber) {
    this.pastGuesses.push(guess);
    return 'You Win!';
  } 

  else { 
    if (this.pastGuesses.includes(guess)) {
      return 'You have already guessed that number.';
    } 

    else {      
      this.pastGuesses.push(guess);
      if (this.pastGuesses.length === 5) {
        return 'You Lose.'
      }
      else {
        if (this.difference() < 10) {
          $('.center').addClass("hot");
          return 'You\'re burning up!'; 
        }
        else if (this.difference() < 25) {
          $('.center').addClass("warm");
          return 'You\'re lukewarm.';
        }
        else if (this.difference() < 50) {
          $('.center').addClass("chilly");          
          return 'You\'re a bit chilly.';
        }
        else {
          $('.center').addClass("cold");
          return 'You\'re ice cold!';
        }
      }
    }
  return 'How did you get here?'
  }
}

function makeAGuess(currentGame) {
  var thisGuess = $('#player-input').val();
  thisGuess = (parseInt(thisGuess));
  // console.log("Guess is: "+thisGuess);
  // console.log("Type of guess is: "+typeof(thisGuess));
  // var output = currentGame.playersGuessSubmission(parseInt(thisGuess, 10))
  var output = currentGame.playersGuessSubmission(thisGuess);
  // console.log(output);
  $('#title').text(output);
  if (output !== 'You have already guessed that number.') {
    $('#player-input').val('#');
    return thisGuess;
  }
  $('#player-input').val('#');
  return output;
}

$( document ).ready(function() {

  var currentGame = new Game();

  function guessHandler (game) {
    var next = makeAGuess(currentGame);
    if (next !== 'You have already guessed that number.') {
      $('#guess-list li:nth-child('+currentGame.pastGuesses.length +')').text(next);
    }
    if (next === currentGame.winningNumber || currentGame.pastGuesses.length === 5) {
      $('#hint, #submit').prop("disabled",true);
      $('#subtitle').text("Click start over to play again!");
    }
  }

  $('#submit').on('click', function(e) {
    guessHandler(currentGame);
  });

  $('#player-input').keypress(function(event){
    if (event.which == 13 ) {
      guessHandler(currentGame);
    }
  });

  $('#reset').on('click', function(e) {
    currentGame = new Game();
    $('#hint, #submit').prop("disabled",false);
    $('#subtitle').text('What\'s in the box?');
    $('#title').text('Pick a number between 1 and 100');
    $('.guess').text('-');
  });

  $('#hint').on('click', function(e) {
    // console.log('Hint is: ');
    // console.log(currentGame.provideHint);
    // console.log(currentGame.provideHint().join(" "));
    $('#hint').prop('disabled',true);    
    $('#subtitle').text(currentGame.provideHint().join(", "));
  });
});