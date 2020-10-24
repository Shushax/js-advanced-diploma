export default class Character {
  constructor(level, type = 'generic') {

    if (new.target === Character) {
      throw new Error('Нельзя создать класс Character!');
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    
  }
}




  export class Bowman extends Character {
    constructor(level) {
      super(level, 'bowman');
      this.attack = 25;
      this.defence = 25;
      this.moveRange = 2;
      this.attackRange = 10;
    }
  }
  
  export class Swordsman extends Character {
    constructor(level) {
      super(level, 'swordsman');
      this.attack = 40;
      this.defence = 10;
      this.moveRange = 4;
      this.attackRange = 1;
    }
  }
  
  export class Magician extends Character {
    constructor(level) {
      super(level, 'magician');
      this.attack = 10;
      this.defence = 40;
      this.moveRange = 1;
      this.attackRange = 4;
    }
  }
  
  export class Vampire extends Character {
    constructor(level) {
      super(level, 'vampire');
      this.attack = 25;
      this.defence = 25;
      this.moveRange = 2;
      this.attackRange = 2;
    }
  }
  
  export class Undead extends Character {
    constructor(level) {
      super(level, 'undead');
      this.attack = 40;
      this.defence = 10;
      this.moveRange = 4;
      this.attackRange = 1;
    }
  }
  
  export class Daemon extends Character {
    constructor(level) {
      super(level, 'daemon');
      this.attack = 10;
      this.defence = 40;
      this.moveRange = 1;
      this.attackRange = 4;
    }
  } 

