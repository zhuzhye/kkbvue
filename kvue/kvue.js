// 1.实现响应式
// vue2:Object.defineProperty(obj,key,desc)
// vue3:new Proxy()

// 设置obj的key,拦截它,初始值val
function defineReactive(obj, key, val) {
  // 如果val本身还是对象,则需要递归处理
  // 创建一个Dep实例和key对应
  const dep=new Dep()
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      // console.log("get", val);
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(v) {
      if (v !== val) {
        val = v;
        // 如果传入v式哥对象，则仍然做响应式处理
        observe(v);
        // console.log("set", key);
        dep.notify()
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
      if (node.nodeType === 1) {
        // 元素
        // console.log("element", node.nodeName);
        this.complieElement(node);
        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        // 插值文本
        console.log("text", node.textContent);
        this.compileText(node);
      }
    });
  }
  // 统一做初始化和更新处理
  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);
    // 更新
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val);
    });
  }

  //处理插值文本
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1];
    this.update(node, RegExp.$1, "text");
  }
  textUpdater(node, val) {
    node.textContent = val;
  }
  // 编译element
  complieElement(node) {
    //  1获取当前元素所有属性，并判断是否动态
    const nodeAttrs = node.attributes;
    console.log(nodeAttrs);
    console.log(Array.from(nodeAttrs));
    Array.from(nodeAttrs).forEach((attr) => {
      const attrName = attr.name;
      const exp = attr.value;
      //  判断attrName是否式指令或者时间等动态
      if (attrName.startsWith("k-")) {
        //  指令截取k-后面部分，特殊处理
        const dir = attrName.substring(2);
        console.log(dir);
        // 判断是否存在处理指令函数，若存在调用
        console.log(exp);
        this[dir] && this[dir](node, exp);
      }
      console.log(attr);
    });
  }
  text(node, exp) {
    this.update(node, exp, "text");
  }
  html(node, exp) {
    this.update(node, exp, "html");
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}
class Watcher {
  constructor(vm, key, updaterFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updaterFn;

    // 触发依赖收集
    Dep.target=this
    vm[key]
    Dep.target=null
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
// 和data中响应式key之间是一一对应的关系
class Dep{
  constructor(){
    // 保存关联的watcher实例
    this.deps=[]
  }
  addDep(dep){
    this.deps.push(dep)
  }
  notify(){
    this.deps.forEach(dep=>dep.update())
  }
}