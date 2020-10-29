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
    const level = Math.floor(Math.random() * maxLevel);
    
    yield new allowedTypes[i](level);

  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  const generator = characterGenerator(allowedTypes, maxLevel);


  for (let i = 0; i < characterCount; i++ ) {
    const character = generator.next();
    result.push(character.value);
  }
  
  return result;
}
