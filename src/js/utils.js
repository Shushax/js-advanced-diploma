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

export function getDistance(fieldSize, cell1, cell2) {
  const row1 = Math.floor(cell1 / fieldSize) + 1;
  const col1 = Math.floor(cell1 % fieldSize) + 1;

  const row2 = Math.floor(cell2 / fieldSize) + 1;
  const col2 = Math.floor(cell2 % fieldSize) + 1;

  let inLine = false;
  if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
    inLine = true;
  }

  const distance = Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));

  return { inLine, distance };
}
