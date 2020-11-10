import {
    getDistance,
    isGamer,
    countDamage,
    getCoordinatesByPosition,
    getPositionByCoordinates,
  } from './utils';
  
  export default class Ai {
    constructor(heroesOfUser, gameState, fieldSize, gamePlay) {
      this.heroesOfUser = heroesOfUser;
      this.gameState = gameState;
      this.gamePlay = gamePlay;
      this.fieldSize = fieldSize;
      this.computerPerses = [];
      this.playerPerses = [];
      this.variants = [];
      this.allAvlCells = [];
    }
  
    makeTurn() {
      this.splitPerses();
      this.createVariants();
      this.doAction(this.selectAction());
    }
  
    splitPerses() {
      this.computerPerses = [];
      this.playerPerses = [];
      this.gameState.board.forEach((pers) => {
        if (isGamer(pers, this.heroesOfUser)) {
          this.playerPerses.push(pers);
        } else {
          this.computerPerses.push(pers);
        }
      });
    }
  
    createVariants() {
      this.variants = [];
      this.computerPerses.forEach((computerPers) => {
        this.playerPerses.forEach((playerPers) => {
          const fullDist = getDistance(this.fieldSize, computerPers.position, playerPers.position);
          const { distance } = fullDist;
          const variant = {
            active: computerPers,
            target: playerPers,
            distance,
            attackAvl: distance <= computerPers.character.attackRange,
            possibleDamage: countDamage(computerPers, playerPers),
          };
          this.variants.push(variant);
        });
      });
    }
  
    selectAction() {
      const toAttack = this.variants
        .slice()
        .filter((item) => item.attackAvl === true)
        .sort((a, b) => b.possibleDamage - a.possibleDamage);
  
      if (toAttack.length) {
        return toAttack[0];
      }
  
      const toMove = this.variants
        .slice()
        .sort((a, b) => b.possibleDamage - a.possibleDamage);
  
      return toMove[0];
    }
  
    doAction(variant) {
      if (variant.attackAvl) {
        this.doAttack(variant);
      } else {
        this.doMove(variant);
      }
    }
  
    doAttack(variant) {
      const targetPers = variant.target;
      const target = variant.target.character;
      const index = variant.target.position;
      const damage = variant.possibleDamage;
  
      this.gamePlay.showDamage(index, damage).finally(() => {
        target.health -= damage;
        if (target.health <= 0) {
          const indexForDelete = this.gameState.board.indexOf(targetPers);
          this.gameState.board.splice(indexForDelete, 1);
        }
        this.gamePlay.redrawPositions(this.gameState.board);

      });
    }
  
    doMove(variant) {
      this.moveGetAvlPoints(variant);
      this.allAvlCells.sort(Ai.sortVariants);
      const active = this.gameState.board.find((item) => item === variant.active);
      active.position = this.allAvlCells[0].index;
      this.gamePlay.redrawPositions(this.gameState.board);
    }
  
    moveGetAvlPoints(variant) {
      this.allAvlCells = [];
  
      const busyCells = [];
      this.gameState.board.forEach((pers) => {
        busyCells.push(pers.position);
      });
  
      const pers = variant.active.character;
      const [row, col] = getCoordinatesByPosition(variant.active.position, this.fieldSize);
  
      for (let i = row - pers.moveRange; i <= row + pers.moveRange; i += 1) {
        for (let j = col - pers.moveRange; j <= col + pers.moveRange; j += 1) {
          if (i >= 1 && i <= this.fieldSize && j >= 1 && j <= this.fieldSize) {
            const index = getPositionByCoordinates(i, j, this.fieldSize);
            if (!busyCells.includes(index)) {
              this.allAvlCells.push(this.getPointParametrs(index, variant));
            }
          }
        }
      }
    }
  
    getPointParametrs(index, variant) {
      const { distance } = getDistance(this.fieldSize, index, variant.target.position);
      const pointParam = {
        index,
        toTargetDist: distance,
        attackAvl: distance <= variant.active.character.attackRange,
        moveDist: getDistance(this.fieldSize, index, variant.active.position).distance,
        danger: this.countDanger(index, variant),
      };
      return pointParam;
    }
  
    countDanger(index, variant) {
      let danger = 0;
      this.gameState.board.forEach((pers) => {
        if (isGamer(pers, this.heroesOfUser)) {
          const { distance } = getDistance(this.fieldSize, index, pers.position);
          if (distance <= pers.character.attackRange) {
            danger += countDamage(pers, variant.active);
          }
        }
      });
      return danger;
    }
  
    static sortVariants(a, b) {
  
      if (a.attackAvl === true && b.attackAvl === false) {
        return -1;
      }
  
      if (a.attackAvl === false && b.attackAvl === true) {
        return 1;
      }
  
      if (a.danger !== b.danger) {
        return a.danger - b.danger;
      }
  
      if (a.attack === true) {
        return a.moveDist - b.moveDist;
      }
  
      return a.toTargetDist - b.toTargetDist;
    }
  }