export const actions = {
    async load({ commit }, user ) {
        try {
            const {rows} = (await this.$axios.post('/table/loadTable', {user})).data
            if (rows) {
                commit('setTable', rows)
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
    setTable(state, table){
        state.table = table
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
    table: [],
    interval: false,
    success: true,
    date: null
})
export const getters = {
    allTable: s => s.table,
    successUpdate: s => s.success,
    updateDate: s => s.date
}
