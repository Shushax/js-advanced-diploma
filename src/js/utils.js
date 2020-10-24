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
