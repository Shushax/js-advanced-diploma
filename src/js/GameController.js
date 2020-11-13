import themes from './themes';
import { gamePlay } from './app';
import GamePlay from './GamePlay';
import positionedCharacter from './PositionedCharacter';
import {
  Bowman,
  Swordsman,
  Magician,
  Vampire,
  Undead,
  Daemon,
} from './Character';
import PositionedCharacter from './PositionedCharacter';
import { characterGenerator, generateTeam } from './generators';
import GameState from './GameState';
import {
  randomizeArray,
  getStartPosition,
  getDistance,
  isGamer,
  countDamage,
} from './utils';
import Ai from './ai';
import GameStateService from './GameStateService';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.gameStateService = new GameStateService(window.localStorage);
    this.GAMER_CLASSES = [Bowman, Swordsman, Magician];
    this.COMPUTER_CLASSES = [Vampire, Undead, Daemon];
    this.ai = new Ai(this.GAMER_CLASSES, this.gameState, this.gamePlay.boardSize, this.gamePlay);
    this.rules = {
      1: {
        newPlayers: 2,
        maxNewPlersLevel: 1,
        maxComputerPersLevel: 1,
        theme: 'prairie',
      },
      2: {
        newPlayers: 1,
        maxNewPlersLevel: 1,
        maxComputerPersLevel: 2,
        theme: 'desert',
      },
      3: {
        newPlayers: 2,
        maxNewPlersLevel: 2,
        maxComputerPersLevel: 3,
        theme: 'arctic',
      },
      4: {
        newPlayers: 2,
        maxNewPlersLevel: 3,
        maxComputerPersLevel: 4,
        theme: 'mountain',
      },
    };
  }

  init() {
  
    this.gamePlay.drawUi('prairie');

    
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadClick.bind(this));

    this.ai.nextTurn = this.nextTurn.bind(this);
    this.onNewGameClick();
  }

  onSaveClick() {
    this.gameStateService.save(this.gameState);
  }

  onLoadClick() {
    
    this.gameState.setState(this.gameStateService.load());
    this.gamePlay.drawUi(this.rules[this.gameState.level].theme);
    this.gamePlay.redrawPositions(this.gameState.field);
  }

  onCellClick(index) {
    if (!this.gameState.gamePlay) {
      return;
    }

    if (this.gameState.activePlayer === 'computer') {
      return false;
    }

    if (this.gameState.avlAction === 'select') {
      this.actionSelect(index);
    } else if (this.gameState.avlAction === 'move') {
      this.actionMove(index);
    } else if (this.gameState.avlAction === 'attack') {
      this.actionAttack(index);
    } else if (this.gameState.avlAction === 'not allowed to choose') {
      GamePlay.showError('Выбрать можно только своих');
    } else if (this.gameState.avlAction === 'to far to attack') {
      GamePlay.showError('Слишком далеко для атаки');
    } else if (this.gameState.avlAction === 'to far to move') {
      GamePlay.showError('Слишком далеко для перемещения');
    }
  }

  onCellEnter(index) {
    if (!this.gameState.gamePlay) {
      return;
    }

    const personOnCell = this.gameState.field.find((item) => item.position === index);

    if (personOnCell) {
      this.createAndShowTooltip(index, personOnCell);

      if (isGamer(personOnCell, this.GAMER_CLASSES)) {
        this.setAvaliableAction('select');
      } else {
        this.setAvaliableAction('not allowed to choose');

        if (this.gameState.selected) {
          this.setAvaliableAction('to far to attack');

          if (this.isActionInRange('attackRange', index)) {
            this.setAvaliableAction('attack', index);
          }
        }
      }
      return;
    }

    if (this.gameState.selected) {
      if (this.isActionInRange('moveRange', index)) {
        this.setAvaliableAction('move', index);
      } else {
        this.setAvaliableAction('to far to move');
      }
    }
  }

  isActionInRange(range, index) {
    const actionRange = this.gameState.selected.character[range];
    const { position } = this.gameState.selected;
    return getDistance(this.gamePlay.boardSize, position, index).distance <= actionRange;
  }

  setAvaliableAction(status, index = null) {
    this.gameState.avlAction = status;

    switch (status) {
      case 'select':
        this.gamePlay.setCursor('pointer');
        break;
      case 'move':
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
        break;
      case 'attack':
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor('crosshair');
        break;
      default:
        this.gamePlay.setCursor('not-allowed');
        break;
    }
  }

  onCellLeave(index) {
    if (!this.gameState.gamePlay) {
      return;
    }

    this.gamePlay.setCursor('auto');
    this.gameState.avlAction = null;
    this.gamePlay.deselectCell(index);
    if (this.gameState.selected) {
      this.gamePlay.selectCell(this.gameState.selected.position);
    }
  }

  levelUp() {
    this.gameState.activePlayer = 'gamer';
    if (this.gameState.selected) {
      this.gamePlay.deselectCell(this.gameState.selected.position);
    }
    this.gameState.selected = null;
    this.gameState.avlAction = null;

    this.gameState.level += 1;

    const gamerPositions = randomizeArray(getStartPosition(this.gamePlay.boardSize, 'gamer'));
    this.gameState.field.forEach((pers) => {
      pers.character.level += 1;
      pers.character.health = 100;
      pers.position = gamerPositions.pop();
    });

    const rules = this.rules[this.gameState.level];
    for (let i = 0; i < rules.newPlayers; i += 1) {
      const gamerPers = characterGenerator(this.GAMER_CLASSES, rules.maxNewPlersLevel);
      this.gameState.field.push(new PositionedCharacter(gamerPers, gamerPositions.pop()));
    }

    const numOfComputers = this.gameState.field.length;
    const computerPositions = randomizeArray(getStartPosition(this.gamePlay.boardSize, 'computer'));
    for (let i = 0; i < numOfComputers; i += 1) {
      const gamerPers = characterGenerator(this.COMPUTER_CLASSES, rules.maxComputerPersLevel);
      this.gameState.field.push(new PositionedCharacter(gamerPers, computerPositions.pop()));
    }

    this.gamePlay.drawUi(rules.theme);
    this.gamePlay.redrawPositions(this.gameState.field);
  }

  onNewGameClick() {
    this.gameState.field = [];
    this.gameState.level = 0;
    this.gameState.gamePlay = true;
    this.levelUp();
  }

  actionMove(index) {
    this.deselectBoth(index);
    this.gameState.selected.position = index;
    this.gamePlay.redrawPositions(this.gameState.field);
    this.cleanAfterPlayersTurn();
    this.nextTurn();
  }

  actionAttack(index) {
    const findedPers = this.gameState.field.find((item) => item.position === index);
    const target = findedPers.character;
    const damage = countDamage(this.gameState.selected, findedPers);

    this.gamePlay.showDamage(index, damage).finally(() => {
      target.health -= damage;
      if (target.health <= 0) {
        const indexForDelete = this.gameState.field.indexOf(findedPers);
        this.gameState.field.splice(indexForDelete, 1);
      }

      this.gamePlay.redrawPositions(this.gameState.field);
      this.deselectBoth(index);
      this.cleanAfterPlayersTurn();
      this.nextTurn();
    });
  }

  actionSelect(index) {
    const characterOnCell = this.gameState.field.find((item) => item.position === index);
    const selectedPosition = this.gameState.selected ? this.gameState.selected.position : null;

    if (selectedPosition === index) {
      this.gamePlay.deselectCell(index);
      this.gameState.selected = null;
    } else if (selectedPosition === null) {
      this.gamePlay.selectCell(index);
      this.gameState.selected = characterOnCell;
    } else {
      this.gamePlay.deselectCell(selectedPosition);
      this.gamePlay.selectCell(index);
      this.gameState.selected = characterOnCell;
    }
  }

  deselectBoth(index) {
    this.gamePlay.deselectCell(this.gameState.selected.position);
    this.gamePlay.deselectCell(index);
  }

  cleanAfterPlayersTurn() {
    this.gameState.selected = null;
    this.gameState.avlAction = null;
  }

  createAndShowTooltip(index, personOnCell) {
    const pers = personOnCell.character;
    const message = `🎖${pers.level} ⚔${pers.attack} 🛡${pers.defence} ❤${pers.health}`;
    this.gamePlay.showCellTooltip(message, index);
  }



  setHealthToOne(forGamer) {
    const who = forGamer ? 'GAMER_CLASSES' : 'COMPUTER_CLASSES';
    this.gameState.field.forEach((pers) => {
      if (isGamer(pers, this[who])) {
        pers.character.health = 1;
      }
    });
    this.gamePlay.redrawPositions(this.gameState.field);
  }

  checkWinner() {
    let numOfGamerPerses = 0;
    let numOfCcomputerPerses = 0;

    this.gameState.field.forEach((pers) => {
      if (isGamer(pers, this.GAMER_CLASSES)) {
        numOfGamerPerses += 1;
      } else {
        numOfCcomputerPerses += 1;
      }
    });

    if (numOfGamerPerses === 0) {
      setTimeout(alert('Вы проиграли'), 0);
      return true;
    }
    if (numOfCcomputerPerses === 0) {
      if (this.gameState.level < 4) {
        this.levelUp();
        setTimeout(alert('Победа на уровне! Продолжаем'), 0);
      } else {
        this.gamePlay.setCursor('auto');
        this.gameState.gamePlay = false;
        this.saveScore();
        setTimeout(alert('Конец игры. Победа'), 0);
      }
      return true;
    }

    return false;
  }

  saveScore() {
    const score = this.gameState.field.reduce((sum, item) => sum + item.character.health, 0);
    this.gameState.maxScore = (score > this.gameState.maxScore) ? score : this.gameState.maxScore;
    console.log(this.gameState.maxScore);
  }

  nextTurn() {
    if (this.checkWinner()) {
      return;
    }

    this.gameState.changeActivePlayer();
    if (this.gameState.activePlayer === 'computer') {
      this.ai.makeTurn();
    }
  }
}