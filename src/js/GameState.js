export default class GameState {
  constructor() {
    this.field = [];
    this.activePlayer = 'gamer';
    this.selected = null;
    this.avlAction = null;
    this.level = 1;
    this.maxScore = 0;
    this.gamePlay = true;
  }

  changeActivePlayer() {
    this.activePlayer = (this.activePlayer === 'gamer') ? 'computer' : 'gamer';
  }

  getState() {
    return {
      field: this.field,
      activePlayer: this.activePlayer,
      selected: this.selected,
      avlAction: this.avlAction,
      level: this.level,
      maxScore: this.maxScore,
      gamePlay: this.gamePlay,
    };
  }

  setState(obj) {
    this.field = obj.field; 
    this.activePlayer = obj.activePlayer;
    this.selected = obj.selected;
    this.avlAction = obj.avlAction;
    this.level = obj.level;
    this.maxScore = obj.maxScore;
    this.gamePlay = obj.gamePlay;
  }
}