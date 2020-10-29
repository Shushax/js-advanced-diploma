import themes from './themes';
import { gamePlay } from './app';
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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    const userTeam = generateTeam([Bowman, Swordsman], 1, 2);
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2);
    const allPositionsUserOne = [0, 8, 16, 24, 32, 40, 48, 56];
    const allPositionsUserTwo = [1, 9, 17, 25, 33, 41, 49, 57];
    const allPositionsComputerOne = [6, 14, 22, 30, 38, 46, 54, 62];
    const allPositionsComputerTwo = [7, 15, 23, 31, 39, 47, 55, 63];
    const userTeamPosition = [new PositionedCharacter(userTeam[0], allPositionsUserOne[Math.floor(Math.random() * 8)]), new PositionedCharacter(userTeam[1], allPositionsUserTwo[Math.floor(Math.random() * 8)])];
    const computerTeamPosition = [new PositionedCharacter(computerTeam[0], allPositionsComputerOne[Math.floor(Math.random() * 8)]), new PositionedCharacter(computerTeam[1], allPositionsComputerTwo[Math.floor(Math.random() * 8)])];


    
    this.gamePlay.redrawPositions([...userTeamPosition, ...computerTeamPosition]);
    
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }


}
