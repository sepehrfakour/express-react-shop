import dispatcher from '../dispatcher.js';

export function getCharacters() {
  dispatcher.dispatch({
    type: "GET_CHARACTERS"
  })
}

export function addCharacter(data) {
  dispatcher.dispatch({
    type: "ADD_CHARACTER",
    character: {
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
  })
}

export function deleteCharacter(id) {
  dispatcher.dispatch({
    type: "DELETE_CHARACTER",
    id: id
  })
}

export function updateCharacterLocation(id,location) {
  dispatcher.dispatch({
    type: "UPDATE_CHARACTER_LOCATION",
    id: id,
    location: location
  })
}
