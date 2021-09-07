let Vue;
// 我们自己的router
//声明插件VueRouer
class VueRouter {
  constructor(options) {
    // 1保存路由选项
    this.$options = options;
    // current一个初始值
    //如何使current成为一个响应式数据
    // this.current = window.location.hash.slice(1) || '/'
    //要求参数一必须是响应式对象
    // Vue.set(this,'current', window.location.hash.slice(1))
    // 此方法可以给对象指定一个响应式属性
    Vue.util.defineReactive(this,'current',window.location.hash.slice(1) || '/')
    // 2监控hash变化
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
      console.log(this.current);
    });
    // window.addEventListener("load", () => {
    //   this.current = window.location.hash.slice(1);
    //   console.log(this.current);
    // });
  }
}
//参数1：Vue构造函数
VueRouter.install = function(_Vue) {
  // 传入构造函数，是不是就能对其进行拓展呀
  Vue = _Vue;
  // 1 注册$router,让所有组件实例都可以访问它
  // 混入：Vue.mixin({})
  Vue.mixin({
    // 延迟执行：延迟到router实例和vue实例都创建完毕
    beforeCreate() {
      if (this.$options.router) {
        // 如果存在说明是根实例
        console.log(this.$options);
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  // 2 注册两个全局组件:router-link router-view
  //   render函数
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    // h是render函数调用时，框架传入的createElement
    // 等同与react中createElement，返回vdom

    render(h) {
      console.log(this);
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default
      );
    },
    // render(h) {
    //   return  <a href={"#"+this.to}>{this.$slots.default}</a>
    // },
  });
  Vue.component("router-view", {
    render(h) {
        let component=null
      // 1获取当前url的hash部分

      // 2获取hash部分从路由表中获取对应组件
      const route =this.$router.$options.routes.find(
        (route) => route.path == this.$router.current
      );
      if(route){
          component=route.component
      }
      return h(component);
    },
  });
};
export default VueRouter;
