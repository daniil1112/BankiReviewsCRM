export const actions = {
    async load({ commit }, user ) {
        try {
            let {profiles} = (await this.$axios.post('profile/all')).data
            if (profiles) {
                commit('setProfiles',profiles)
                commit('setSuccess')
                commit('setDate')
            } else {
                commit('setError')
            }
        } catch (e) {
            commit('setError')
        }

    },
    async setInterval({ commit, state, dispatch}){
        if (!state.interval) {
            commit('setInterval')
            setInterval(() => {
                dispatch('load')
            }, 10000)
        }
    }

}
export const mutations = {
    setProfiles(state, profiles){
        state.profiles = profiles
    },
    setInterval(state){
        state.interval = true
    },
    setSuccess(state){
        state.success = true
    },
    setDate(state){
        state.date = new Date
    },
    setError(state){
        state.success = false
    }
}

export const state = () => ({
    profiles: [],
    success: true,
    interval: false,
    date: null
})
export const getters = {
    allProfiles: s => s.profiles,
    successUpdate: s => s.success,
    updateDate: s => s.date
}
