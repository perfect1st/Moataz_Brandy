const initialState = {
    User: null
}

export default (state = initialState, action) => {
    switch (action.type) {

        case 'SAVE_USER':
            return {
                ...state,
                User: action.payload.User
            }

        case 'LOGOUT':
            return { ...state, User: null, }

        default:
            return state
    }
};