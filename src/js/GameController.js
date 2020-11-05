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
import { getDistance } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi('prairie');

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    
    
    const findedPers = this.gameState.board.find((item) => item.position === index);
    if (!findedPers || this.gameState.activePlayer === 'computer') {
      return false;
    }

    if (findedPers.character instanceof Daemon || findedPers.character instanceof Undead || findedPers.character instanceof Vampire) {
      GamePlay.showError('Ошибка! Нельзя выбрать персонажей компьютера!');
      return false;
    }

    const selectedPosition = this.gameState.selected ? this.gameState.selected.position : null;
    if (selectedPosition === index) {
      this.gamePlay.deselectCell(index);
      this.gameState.selected = null;
    } else if (selectedPosition === null) {
      this.gamePlay.selectCell(index);
      this.gameState.selected = findedPers;
    } else {
      this.gamePlay.deselectCell(selectedPosition);
      this.gamePlay.selectCell(index);
      this.gameState.selected = findedPers;
    }

  }


  onCellEnter(index) {
    
    const isPersOnCell = this.gameState.board.find((item) => item.position === index);

    if (isPersOnCell) {
      const pers = isPersOnCell.character;

      const message = `🎖${pers.level} ⚔${pers.attack} 🛡${pers.defence} ❤${pers.health}`;
      this.gamePlay.showCellTooltip(message, index);

      if (pers instanceof Bowman || pers instanceof Swordsman || pers instanceof Magician) {
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('not-allowed');

        if (this.gameState.selected) {
          const { attackRange } = this.gameState.selected.character;
          const { position } = this.gameState.selected;
          if (getDistance(this.gamePlay.boardSize, position, index).distance <= attackRange) {
            this.gamePlay.setCursor('crosshair');
            this.gamePlay.selectCell(index, 'red');
          }
        }
      }
    } else if (this.gameState.selected) {
      const { moveRange } = this.gameState.selected.character;
      const { position } = this.gameState.selected;
      if (getDistance(this.gamePlay.boardSize, position, index).distance <= moveRange) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }  
  }

  onCellLeave(index) {

    this.gamePlay.setCursor('auto');
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

    
    this.gamePlay.redrawPositions([...userTeamPosition, ...computerTeamPosition]);

  }


}
