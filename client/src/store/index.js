//store.js
//store : vuex가 관리하는 저장소를 의미함.
//store이라는 작명은 관례적임 라이브러리를 받으면 main.js에 임포트돼있음
//store를 만드려면 vuex에서 함수를 불러와야 함
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    state() { //vuex에서 관리하는 모든 데이터를 정의하는 부분(이 프로젝트 내 모든 컴포넌트에서 공유하는 데이터들을 모음)
        return {
            //객체 스타일로 등록해야됨.
            empInfo: []
        }
    },
    getters : { //vuex에 저장된 변수 값을 조회하는 경우
        cartCount : (state) => {
            return state.empInfo.length;
        }
    },
    mutations : { //실제 state에 등록돼있는 값을 변경(단 동기식으로 진행함)
        //state에 정의되어있는 데이터를 변경가능
        //여기에서 선언하는 이유는 정해진 방식으로만 가능하게 만들기 위해서임(접근을 막기 위해)
        addInfo(state, info) {   //state를 받음, info는 매개변수, 두번째, 세번째...도 가능
          state.empInfo.push(info);
        },
        getInfo(state) {
          return state.empInfo;
        },
        removeInfo(state) {
          state.empInfo = [];
        }
    },
    actions : { //동기식으로 진행하는 mutations를 여러개 실행하거나 필요에 따라서 비동기로 진행하게 함.
      addInfo(context, info) { //mutation이랑은 다르게 가져옴 context: 저장소 전체를 의미함
        //mutation에 등록된 함수를 호출할 때 commit을 사용함
        context.commit('addInfo', info);
      },
      removeInfo(context) {
        context.commit('removeInfo');
      }
    },
    plugins : [
        //중앙에 저장되는 모든 데이터를 로컬에 저장하려면 createPersistedState();
        createPersistedState({
            paths : ['empInfo']
        })
    ]
});
export default store;