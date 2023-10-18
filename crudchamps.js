// Import the file manager system
import { promises as fs } from 'node:fs';
import { get } from 'node:http';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

// set the file path
const filepath = path.resolve(process.cwd(), 'champions.json');

// function to add a new champion
export async function addChampion(newChampion) {
  const champions = await fs.readFile('champions.json', 'utf-8');
  const championsJSON = JSON.parse(champions);
  const newChampionData = {
    id: uuidv4(),
    championName: newChampion.championName,
    abilities: newChampion.abilities,
    ulitimateAbility: newChampion.ulitimateAbility,
    playStyle: newChampion.playStyle,
    region: newChampion.region,
    difficulty: newChampion.difficulty,
    role: newChampion.role,
    range: newChampion.range,
    lore: newChampion.lore,
  };
  championsJSON.push(newChampionData);
  const updatedChampions = JSON.stringify(championsJSON, null, 2);
  await fs.writeFile(filepath, updatedChampions, 'utf-8');

  return newChampionData;
}

//Function to get the list of all the champions
export async function getChampions() {
  const championsJSON = await fs.readFile('champions.json', 'utf-8');
  const champions = JSON.parse(championsJSON);
  return champions;
}

// Function to get all the champions with a particular ID
export async function getChampionByID(id) {
  const championsJSON = await fs.readFile('champions.json', 'utf-8');
  const champions = JSON.parse(championsJSON);

  //If ID matches, return the champion object
  for (const champion of champions) {
    if (champion.id === id) {
      return champion;
    }
  }
  // If no match, return null
  return null;
}

// Function to get all the champions with a particular name

export async function getChampionByName(name) {
  try {
    const championsJSON = await fs.readFile(filepath, 'utf-8');
    const champions = JSON.parse(championsJSON);

    // Search for a champion with a matching name (case-insensitive)
    const foundChampion = champions.find(
      (champion) => champion.championName === name
    );

    return foundChampion;
  } catch (error) {
    throw error;
  }
}

await getChampionByName('Briar');

export async function deleteChampion(ID) {
  const championsJSON = await fs.readFile('champions.json', 'utf-8');
  const champions = JSON.parse(championsJSON);
  let championIndex = null;
  for (let i = 0; i < champions.length; i++) {
    if (champions[i].id === ID) {
      championIndex = i;
      break;
    }
  }
  if (championIndex !== null) {
    const champions = JSON.parse(championsJSON);
    const deleteChampion = champions.splice(championIndex, 1);
    await fs.writeFile(filepath, JSON.stringify(champions, null, 2), 'utf-8');
    return deleteChampion[0];
  }
}

// export async function editChampionData(id, newName, newRegion) {
//     const championsJSON = await fs.readFile("champions.js", "utf-8");
//     const champions = JSON.parse(championsJSON);
//     // Find the champion by ID
//     const champion = champions.find(champ => champ.id === id);
//     if (!champion) {
//       console.log('Champion not found');
//     }
//     // Update champion data if new values are provided
//     if (newName !== undefined) {
//       champion.championName = newName;
//     }
//     if (newRegion !== undefined) {
//       champion.region = newRegion;
//     }
//     // Write the updated data back to the file
//     await fs.writeFile("champions.js", JSON.stringify(champions, null, 2), "utf-8");
//     return champion;
//   }
