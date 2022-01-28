

export const actions = {
    async loadChanges({commit}){
        const {changes} = (await this.$axios.post('/table/loadChanges')).data
        if (changes) commit('setChanges',changes)
    },
}
export const mutations = {
    setChanges(state, data){
        state.changes = data
    }
}

export const state = () => ({
    changes: [],
})
export const getters = {
    changes: (s) => s.changes,
}
