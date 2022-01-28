export const actions = {
    setAuth({ commit, state }, user) {
        commit('setAuth',user)
    },
}
export const mutations = {
    setAuth(state, user){
        state.auth = true
        state.user = user
    },
}

export const state = () => ({
    auth: false,
    user: false,
})
export const getters = {
    auth: (s) => s.auth,
    user: (s) => s.user
}
