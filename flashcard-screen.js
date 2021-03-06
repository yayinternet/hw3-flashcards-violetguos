// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Rewriting some of the existing methods, such as changing code in `show()`
// - Adding methods
// - Adding additional fields

class FlashcardScreen {
  constructor(containerElement, topic) {
    this.containerElement = containerElement;
    this.topic = topic;
    this.currentCard = 0;
    this._onOneCardFinish = this._onOneCardFinish.bind(this);
    this._onContinue = this._onContinue.bind(this);
    this._onRestart = this._onRestart.bind(this);

    document.addEventListener('one-card-finish', this._onOneCardFinish);
    document.addEventListener('continue-wrong-cards', this._onContinue);
    document.addEventListener('restart', this._onRestart);

    // keep track of wrong cards and scores
    this.numRight = 0;
    this.numWrong = 0;
    this._onCardRight = this._onCardRight.bind(this);
    this._onCardWrong = this._onCardWrong.bind(this);
    
    document.addEventListener('card-right', this._onCardRight);
    document.addEventListener('card-wrong', this._onCardWrong);


    this.wrongCards = []; 
    this.totalCards =  Object.keys( FLASHCARD_DECKS[this.topic]['words']).length;
    this.review = false;
  }

  show() {
    let cardIndex;
    if(this.review){
      // redo the cards we got wrong
      cardIndex = this.wrongCards.pop();
      // todo, check if the array empty
      console.log("cardIndex", cardIndex);
      console.log("wrong cards", this.wrongCards);
    }
    else{
      cardIndex = this.currentCard;
    }
    this.containerElement.classList.remove('inactive');
    const flashcardContainer = document.querySelector('#flashcard-container');
    flashcardContainer.innerHTML = '';
    // all the keys
    const keys = Object.keys(FLASHCARD_DECKS[this.topic]['words']);

    const card = new Flashcard(flashcardContainer, 
      keys[cardIndex],
      FLASHCARD_DECKS[this.topic]['words'][keys[cardIndex]]
    );

    
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
  
  _onOneCardFinish(event){
    this.currentCard++;

    if (this.review){
      if( this.wrongCards.length === 0)
        document.dispatchEvent(new CustomEvent('all-cards-finish'));
      else
        this.show();

    }
    else{
      console.log("current card", this.currentCard);

      if (this.currentCard === this.totalCards-1){
        document.dispatchEvent(new CustomEvent('all-cards-finish'));
      }
      else
        this.show();
    }

  }

  _onContinue(){
    // review the wrong cards
    this.numWrong = 0;
    this.currentCard = 0;
    this.review = true
    this.totalCards = this.wrongCards.length;

    this.show();
  }


  _onRestart(){
    // restart the same deck
    this.numWrong = 0;
    this.numRight = 0;
    this.currentCard = 0;
    this.wrongCards = [];
    this.review = false;
    this.totalCards =  Object.keys( FLASHCARD_DECKS[this.topic]['words']).length;

    this.show();
  }

  _onCardRight(event){
    this.numRight = this.numRight+1;
  }

  _onCardWrong(event){
    this.numWrong = this.numWrong + 1;
    this.wrongCards.push(this.currentCard);

  }
}
