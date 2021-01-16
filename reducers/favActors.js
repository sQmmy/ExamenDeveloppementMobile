const initialState = { favoriteActorsIds: [] };

function favActors(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case "SAVE_ACTOR":
      nextState = {
        ...state,
        favoriteActorsIds: [...state.favoriteActorsIds, action.value],
      };
      return nextState || state;
    case "POP_ACTOR":
      nextState = {
        ...state,
        favoriteActorsIds: state.favoriteActorsIds.filter(
          (id) => id !== action.value
        ),
      };
      return nextState || state;
    default:
      return state;
  }
}

export default favActors;
