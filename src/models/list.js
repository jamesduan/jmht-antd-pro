import { queryFakeList, queryArticleList, saveArticle, updateArticle, uploadImage } from '../services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    addCompleteObj: {},
    confirmLoading: false
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      console.log("fetch")
      if (response.hasOwnProperty("Data")) {
        const list = response.Data.list
        yield put({
          type: 'queryList',
          payload: Array.isArray(list) ? list : [],
        });
      } else {
        yield put({
          type: 'queryList',
          payload: [],
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      console.log("appendFetch")
      if (response.hasOwnProperty("Data")) {
        const list = response.Data.list
        console.log(list)
        yield put({
          type: 'appendList',
          payload: Array.isArray(list) ? list : [],
        });
      } else {
        yield put({
          type: "appendList",
          payload: []
        })
      }
    },
    *addArticle({ payload }, { call, put }) {

      yield put({
        type: 'changeConfirmLoading',
        confirmLoading: true
      })
      console.log(payload)
      const addResponse = yield call(saveArticle, {title: payload.title, content: payload.content})
      
      console.log(addResponse)
      const postData = { file: payload.fileData, file_type: payload.fileType, article_id: addResponse.Data.article.ID }
      console.log(postData)
      const uploadRes = yield call(uploadImage, postData)
      console.log(uploadRes)

      yield put({
        type: 'saveOk',
        payload: addResponse.Data.article,
      })

      yield put({
        type: 'changeConfirmLoading',
        confirmLoading: false
      })

      // 
      const response = yield call(queryArticleList, payload);
      console.log("fetch")
      if (response.hasOwnProperty("Data")) {
        const list = response.Data.list
        yield put({
          type: 'queryList',
          payload: Array.isArray(list) ? list : [],
        });
      } else {
        yield put({
          type: 'queryList',
          payload: [],
        });
      }
    },
    *editArticle({ payload }, { call, put }) {
      // console.log("put -> ", payload)
      yield put({
        type: "preparedArticle",
        payload: payload.data
      })
    },
    *saveArticle({ payload }, { call, put }) {
      /////
      yield call(updateArticle, payload)
      /////
      const response = yield call(queryArticleList, payload);
      console.log("fetch")
      if (response.hasOwnProperty("Data")) {
        const list = response.Data.list
        yield put({
          type: 'queryList',
          payload: Array.isArray(list) ? list : [],
        });
      } else {
        yield put({
          type: 'queryList',
          payload: [],
        });
      }
      ////
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      // console.log(action)
      return {
        ...state,
        list: action.payload,
        // list: state.list.concat(action.payload),
      };
    },
    preparedArticle(state, action) {
      // console.log("action -> ", action)
      // console.log(state)
      return {
        ...state,
        list: action.payload
      }
    },
    changeConfirmLoading(state, action) {
      return {
        ...state,
        confirmLoading: action.confirmLoading
      }
    },
    saveOk(state, action) {
      console.log("saveOk action => ", action)
      return {
        ...state,
        addCompleteObj: action.payload
      }
    }
  },
};
