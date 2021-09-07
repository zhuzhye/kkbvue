// 1.实现响应式
// vue2:Object.defineProperty(obj,key,desc)
// vue3:new Proxy()
// 设置obj的key,拦截它,初始值val
function defineReactive(obj, key, val) {
  // 如果val本身还是对象,则需要递归处理
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", val);
      return val;
    },
    set(v) {
      if (v !== val) {
        val = v;
        // 如果传入v式哥对象，则仍然做响应式处理
        observe(v);
        console.log("set", key);
      }
    },
  });
}
function set(obj, key, val) {
  defineReactive(obj, key, val);
}
// 对obj做响应式处理
function observe(obj) {
  // 判断obj值,必须式object
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v){
          vm.$data[key]=v
      }
    });
  });
}
class KVue {
  constructor(options) {
    // 1保存选项
    console.log(options);
    this.$options = options;
    this.$data = options.data;
    // 2对data选项做响应式处理
    observe(this.$data);
    // 2.5d大力
    proxy(this)
    // 3编译
  }
}
