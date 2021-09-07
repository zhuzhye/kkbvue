//我们自己的vuex实现
let Vue;
class Store {
  constructor(options) {
    console.log(options);
    // 1保存选项
    this.$options = options;
    this._mutations=options.mutations
    this._actions=options.actions
    // 2暴露一个state属性,并对传入state选项做响应式处理
    // Vue.util.defineReactive(this,'state',this.$options.state)
    this._vm = new Vue({
      data() {
        return {
            // 加上$$不免vue对改属性做代理
            // this._vm.counter是不行的
          $$state: options.state,
        };
      },
    });
    // 绑定上下文，确保是store实例
    this.commit=this.commit.bind(this)
    this.dispatch=this.dispatch.bind(this)
  }
  get state() {
    return this._vm._data.$$state;
  }
  set state(v) {
    console.error("please use replaceState ro reset state");
  }
  commit(type,payload){
      const entry= this._mutations[type]
      if(!entry){
          console.error('unknow mutation');
          return
      }
      entry(this.state,payload)
  }
  dispatch(type,payload){
    const entry= this._actions[type]
      if(!entry){
          console.error('unknow actions');
          return
      }
      entry(this,payload)
  }
}
function install(_Vue) {
  Vue = _Vue;
  //注册$store
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}
export default { Store, install };
