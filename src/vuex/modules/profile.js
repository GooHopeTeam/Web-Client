import axios from "axios";

const host = 'http://127.0.0.1:8000/api'

const state = {
    profile_friends: [],
    profile_societies: [],
    user: {},
}
const getters = {
    FRIENDS_LIST: state => {
        return state.profile_friends
        // return {
        //     'friends': state.profile_friends.map(elem => {
        //         return {
        //             'title': elem.login,
        //             // eslint-disable-next-line no-constant-condition
        //             'color': elem.status ? 'green' : 'red',
        //             // eslint-disable-next-line no-constant-condition
        //             'content': elem.status ? 'Online' : 'Последний раз в сети: 5ч 37мин назад', // TODO: change to profile.updated
        //             'user_id': elem.user_id
        //         }
        //     }),
        //     'friends_count': state.profile_friends.length
        // }
    },
    SOCIETIES_LIST: state => {
        return state.profile_societies
    },
    USER: state => {
        return state.user
    },
    PROFILE_STATUS: state => {
        return state.user.hidden
    }
}
const mutations = {
    UPDATE_FRIENDS: (state, friends_list) => {
        state.profile_friends = friends_list
    },
    UPDATE_SOCIETIES: (state, societies_list) => {
        state.profile_societies = societies_list
    },
    UPDATE_PROFILE_INFO: (state, {profile, is_hidden}) => {
        state.user = profile
        state.user.hidden = is_hidden
        state.user.status = state.user.status ? 'Online' : 'Последний раз в сети: 5ч 37мин назад' // TODO: change to profile.updated
    }
}
const actions = {
    UPDATE_PROFILE: async (context, profile_id) => {
        axios.get(`${host}/profile/${profile_id}`, {
            params: {
                user_id: localStorage.user_id,
                token: localStorage.token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    context.commit('UPDATE_FRIENDS', res.data.friends)
                    context.commit('UPDATE_PROFILE_INFO', {
                            'profile': res.data.user,
                            'is_hidden': res.data.hidden
                        })
                }
            })
            .catch(err => {
                alert(err)
            })

        axios.get(`${host}/societies`, {
            params: {
                user_id: profile_id,
                token: localStorage.token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    context.commit('UPDATE_SOCIETIES', res.data)
                }
            })
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}