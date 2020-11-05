export default class GameState {

  constructor() {
    this.board = [];
    this.activePlayer = '';
    this.selected = null;
  }

  changeActivePlayer() {
    this.activePlayer = (this.activePlayer === 'gamer') ? 'computer' : 'gamer';
  }
  
  
  static from(object) {
    // TODO: create object
    return null;
  }
}
