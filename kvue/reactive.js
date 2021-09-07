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
const obj = {
  foo: "foo",
  bar: "bar",
  baz: {
    a: "a",
  },
};

// defineReactive(obj,'foo','fooooo')
observe(obj);
// obj.foo;
// obj.foo = "22";
// obj.bar;
// obj.bar = "222222";
// obj.baz.a;
// obj.baz={
//     b:2
// }
set(obj,'dong','dong')
obj.dong

//数组：覆盖数组中7个更变方法。push pop shift unshift。。。。
//

