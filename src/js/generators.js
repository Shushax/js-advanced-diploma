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
export function characterGenerator(allowedTypes, maxLevel) {

  const typeIndex = Math.floor(Math.random() * allowedTypes.length);
  const Type = allowedTypes[typeIndex];
  const level = Math.floor(Math.random() * maxLevel) + 1;

  return new Type(level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  for (let i = 0; i < characterCount; i += 1) {
    result.push(characterGenerator(allowedTypes, maxLevel));
  }
  return result;
}
