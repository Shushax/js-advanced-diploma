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
  getDistance,
  isGamer,
  countDamage,
} from './utils';
import Ai from './ai';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.heroesOfUser = [Bowman, Swordsman, Magician];
    this.heroesOfComputer = [Vampire, Undead, Daemon];
    this.ai = new Ai(this.heroesOfUser, this.gameState, this.gamePlay.boardSize, this.gamePlay);
  }

  init() {
    this.gamePlay.drawUi('prairie');

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.onNewGameClick();

    
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    
    
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
      GamePlay.showError('Вражеских персонажей нельзя выбирать!');
    } else if (this.gameState.avlAction === 'to far to attack') {
      GamePlay.showError('Слишком далеко для атаки');
    } else if (this.gameState.avlAction === 'to far to move') {
      GamePlay.showError('Слишком далеко для перемещения');
    }
  }


  onCellEnter(index) {
    
    const isPersOnCell = this.gameState.board.find((item) => item.position === index);

    if (isPersOnCell) {
      this.createAndShowTooltip(index, isPersOnCell);
      if (isGamer(isPersOnCell, this.heroesOfUser)) {
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

    this.gamePlay.setCursor('auto');
    this.gameState.avlAction = null;
    this.gamePlay.deselectCell(index);
    if (this.gameState.selected) {
      this.gamePlay.selectCell(this.gameState.selected.position);
    }

  }

  onNewGameClick() {

    this.gameState.board = [];
    this.gameState.activePlayer = 'gamer';
    if (this.gameState.selected) {
      this.gamePlay.deselectCell(this.gameState.selected.position);
    }
    this.gameState.selected = null;
    this.gameState.avlAction = null;


    const userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2);
    const allPositionsUserOne = [0, 8, 16, 24, 32, 40, 48, 56];
    const allPositionsUserTwo = [1, 9, 17, 25, 33, 41, 49, 57];
    const allPositionsComputerOne = [6, 14, 22, 30, 38, 46, 54, 62];
    const allPositionsComputerTwo = [7, 15, 23, 31, 39, 47, 55, 63];
    const userTeamPosition = [new PositionedCharacter(userTeam[0], allPositionsUserOne[Math.floor(Math.random() * 8)]), new PositionedCharacter(userTeam[1], allPositionsUserTwo[Math.floor(Math.random() * 8)])];
    this.gameState.board.push(userTeamPosition[0], userTeamPosition[1]);
    const computerTeamPosition = [new PositionedCharacter(computerTeam[0], allPositionsComputerOne[Math.floor(Math.random() * 8)]), new PositionedCharacter(computerTeam[1], allPositionsComputerTwo[Math.floor(Math.random() * 8)])];
    this.gameState.board.push(computerTeamPosition[0], computerTeamPosition[1]);

    
    this.gamePlay.redrawPositions(this.gameState.board);

  }

  actionMove(index) {
    this.deselectBoth(index);
    this.gameState.selected.position = index;
    this.gamePlay.redrawPositions(this.gameState.board);
    this.cleanAfterTurn();

    this.ai.makeTurn();
  }

  actionAttack(index) {
    const findedPers = this.gameState.board.find((item) => item.position === index);
    const target = findedPers.character;
    const damage = countDamage(this.gameState.selected, findedPers);

    this.gamePlay.showDamage(index, damage).finally(() => {
      target.health -= damage;
      if (target.health <= 0) {
        const indexForDelete = this.gameState.board.indexOf(findedPers);
        this.gameState.board.splice(indexForDelete, 1);
      }

      this.gamePlay.redrawPositions(this.gameState.board);
      this.deselectBoth(index);
      this.cleanAfterTurn();

      this.ai.makeTurn();
    });
  }

  actionSelect(index) {
    const characterOnCell = this.gameState.board.find((item) => item.position === index);
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

  cleanAfterTurn() {
    this.gameState.selected = null;
    this.gameState.avlAction = null;
  }

  createAndShowTooltip(index, personOnCell) {
    const pers = personOnCell.character;
    const message = `🎖${pers.level} ⚔${pers.attack} 🛡${pers.defence} ❤${pers.health}`;
    this.gamePlay.showCellTooltip(message, index);
  }


}
