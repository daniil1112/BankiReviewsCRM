export const actions = {
    async loadAll({ commit, state }) {
        try {
            const {ips} = (await this.$axios.post('/ip/loadAll')).data
            if (ips) {
                commit('setIps',ips)
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
            setInterval(() => {
                dispatch('loadAll')
            }, 10000)
            commit('setInterval')
        }
    }
}
export const mutations = {
    setIps(state, ips){
        state.ips = ips
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
    ips: [],
    interval: false,
    success: true,
    date: null
})
export const getters = {
    allIps : s => s.ips,
    successUpdate: s => s.success,
    updateDate: s => s.date
}
