import * as api from '../api';
import * as types from '../types';
import router from '../../router';

/* eslint no-param-reassign: 0 */
export default {
  state: {
    data: null,
    query: '',
    error: null,
  },

  actions: {
    findEstablishments({ commit, state }, { name, location }) {
      commit(types.ESTABLISHMENT_SEARCH, name);

      api.findEstablishments(name, location)
        .then((response) => {
          const establishments = response.data.establishments;

          if (!establishments.length) {
            return Promise.reject(204);
          }

          commit(types.ESTABLISHMENT_RECIEVE, establishments[0]);

          return router.push(`/establishment/${establishments[0].FHRSID}`);
        })
        .catch((error) => {
          commit(types.ESTABLISHMENT_ERROR, error);
        });
    },
    getEstablishment({ commit, state }, { id }) {
      commit(types.ESTABLISHMENT_RETRIEVE, id);

      api.getEstablishment(id)
        .then((response) => {
          if (!response.data) {
            return Promise.reject(204);
          }

          return commit(types.ESTABLISHMENT_RECIEVE, response.data);
        })
        .catch((error) => {
          commit(types.ESTABLISHMENT_ERROR, error);
        });
    },
    clearError({ commit }) {
      commit(types.ESTABLISHMENT_ERROR, null);
    },
  },

  mutations: {
    [types.ESTABLISHMENT_SEARCH](state, query) {
      state.error = null;
      state.query = query;
    },

    [types.ESTABLISHMENT_RETRIEVE](state, query) {
      state.error = null;
      state.query = query;
    },

    [types.ESTABLISHMENT_RECIEVE](state, establishment) {
      state.error = null;
      state.data = establishment;
    },

    [types.ESTABLISHMENT_ERROR](state, error) {
      state.error = error;
    },
  },
};
