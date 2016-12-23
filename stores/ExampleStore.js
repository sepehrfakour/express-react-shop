import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class CharacterStore extends EventEmitter {
  constructor() {
    super();
    this.characters = [
      {
        id: '57189265er',
        name: 'Bob',
        type: 'main',
        race: 'human',
        gender: 'male',
        age: 33,
        location: new SquareCoordinate(2,2),
        health: 100,
        currentHealth: 92,
        experience: 10,
        mood: 64,
        hunger: 42,
        sleep: 88,
        social: 12,
        speed: 20,
        skills: {
          construction: 5,
          farming: 7,
          mining: 2,
          education: 7,
          social: 5,
          shooting: 9,
          melee: 8,
          cooking: 6,
          medicine: 3,
          art: 4
        }
      },
      {
        id: '12147933tq',
        name: 'Sue',
        type: 'main',
        race: 'human',
        gender: 'female',
        age: 47,
        location: new SquareCoordinate(-2,-2),
        health: 100,
        currentHealth: 100,
        experience: 20,
        mood: 54,
        hunger: 72,
        sleep: 48,
        social: 42,
        speed: 10,
        skills: {
          construction: 7,
          farming: 5,
          mining: 4,
          education: 2,
          social: 2,
          shooting: 9,
          melee: 2,
          cooking: 9,
          medicine: 9,
          art: 7
        }
      }
    ];
  }
  getCharacters() {
    console.log("Characters:", this.characters);
    return this.characters;
  }
  addCharacter(data) {
    let character = {
      id:            data.id,
      name:          data.name,
      type:          data.type,
      race:          data.race,
      gender:        data.gender,
      age:           data.age,
      location:      data.location,
      health:        data.health,
      currentHealth: data.currentHealth,
      experience:    data.experience,
      mood:          data.mood,
      hunger:        data.hunger,
      sleep:         data.sleep,
      social:        data.social,
      skills:        data.skills
    }
    this.characters.push(character);
    this.emit("change");
  }
  deleteCharacter(id) {
    let characters = this.characters;
    // If character exists, delete it
    for (var i = 0; i < characters.length; i++) {
      if (characters[i].id === id) {
        characters.splice(i,1);
      }
    }
    this.characters = characters;
    this.emit("change");
  }
  updateCharacterLocation(id,location) {
    // If character exists, update its location
    for (var i = 0; i < this.characters.length; i++) {
      if (this.characters[i].id === id) {
        this.characters[i].location = location;
      }
    }
    this.emit("change");
  }
  handleActions(action) {
    console.log("CharacterStore received an action:", action);
    switch(action.type) {
      case "GET_CHARACTERS": {
        this.getCharacters();
        break;
      }
      case "ADD_CHARACTER": {
        this.addCharacter(action.character);
        break;
      }
      case "DELETE_CHARACTER": {
        this.deleteCharacter(action.id);
        break;
      }
      case "UPDATE_CHARACTER_LOCATION": {
        this.updateCharacterLocation(action.id,action.location);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const characterStore = new CharacterStore;
dispatcher.register(characterStore.handleActions.bind(characterStore));
window.dispatcher = dispatcher;
window.characterStore = characterStore;

export default characterStore;
