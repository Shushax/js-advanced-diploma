export function calcTileType(index, boardSize) {
  if (index == 0) {
    return 'top-left';
  } else if (index > 0 && index < 7) {
    return 'top';
  } else if (index == 7) {
    return 'top-right';
  } else if (index == 8 || index == 16 || index == 24 || index == 32 || index == 40 || index == 48) {
    return 'left';
  } else if (index == 15 || index == 23 || index == 31 || index == 39 || index == 47 || index == 55) {
    return 'right';
  } else if (index == 56) {
    return 'bottom-left';
  } else if (index > 56 && index < 63) {
    return 'bottom';
  } else if (index == 63) {
    return 'bottom-right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function randomizeArray(arr) {
  const randomArr = arr.slice();
  for (let i = randomArr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomArr[i], randomArr[j]] = [randomArr[j], randomArr[i]];
  }

  return randomArr;
}

export function getStartPosition(fieldSize, who) {
  const positions = [];

  if (fieldSize < 4) {
    throw new Error('Fieldsize should be grater or equal 4');
  }

  for (let i = 0; i < fieldSize ** 2; i += 1) {
    if ((i % fieldSize === 0 || i % fieldSize === 1) && who === 'gamer') {
      positions.push(i);
    }

    if ((i % fieldSize === fieldSize - 1 || i % fieldSize === fieldSize - 2) && who === 'computer') {
      positions.push(i);
    }
  }

  return positions;
}

export function getCoordinatesByPosition(index, fieldSize) {
  const row = Math.floor(index / fieldSize) + 1;
  const col = Math.floor(index % fieldSize) + 1;
  return [row, col];
}

export function getPositionByCoordinates(row, col, fieldSize) {
  return fieldSize * (row - 1) + (col - 1);
}

export function getDistance(fieldSize, cell1, cell2) {
  const [row1, col1] = getCoordinatesByPosition(cell1, fieldSize);
  const [row2, col2] = getCoordinatesByPosition(cell2, fieldSize);

  let inLine = false;
  if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
    inLine = true;
  }

  const distance = Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));

  return { inLine, distance };
}

export function isGamer(personOnCell, gamerClasses) {
  const whoIsOnField = Object.getPrototypeOf(personOnCell.character).constructor;
  return gamerClasses.includes(whoIsOnField);
}

export function countDamage(attacker, target) {
  const attackerAttack = attacker.character.attack;
  return Math.max(attackerAttack - target.character.defence, attackerAttack * 0.1);
}
