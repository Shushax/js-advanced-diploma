import {
  Bowman,
  Swordsman,
  Magician,
  Vampire,
  Undead,
  Daemon,
} from './Character';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  for (let i = 0; i < allowedTypes.length; i++) {
    yield allowedTypes[i];
  } 
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  for (let i = 0; i < characterCount; i++) {
    result.push(characterGenerator(allowedTypes, maxLevel));
  }
  return result;
}
