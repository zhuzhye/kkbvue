// 1.实现响应式
// vue2:Object.defineProperty(obj,key,desc)
// vue3:new Proxy()


// 设置obj的key,拦截它,初始值val
function defineReactive(obj, key, val) {
  // 如果val本身还是对象,则需要递归处理
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      // console.log("get", val);
      return val;
    },
    set(v) {
      if (v !== val) {
        val = v;
        // 如果传入v式哥对象，则仍然做响应式处理
        observe(v);
        // console.log("set", key);
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
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}

class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    // 对data选项做响应式处理
    observe(this.$data);

    // 代理data到vm上
    proxy(this);

    // 执行编译
    new Compile(options.el, this);
  }
}


class Compile {
  constructor(el, vm) {
    // 保存kvue实例
    this.$vm = vm;
    // 编译模板树
    this.compile(document.querySelector(el));
  }
  compile(el) {
    // 遍历el
    // 获取所有子阶段
    el.childNodes.forEach((node) => {
      // 判断node类型
      console.log(node);
      if (node.nodeType === 1) {
        // 元素
        console.log("element", node.nodeName);
        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        // 插值文本
        console.log("text", node.textContent);
        this.compileText(node)
      }
    });
  }
  //处理插值文本
  compileText(node){
    node.textContent=this.$vm[RegExp.$1 ]
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}
