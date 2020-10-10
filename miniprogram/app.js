"use strict";
var util_req = require('./utils/request.js');
var api = require('./utils/api.js');
var rule = require('./utils/rule.js');
let token_val = ''
//   wx.getStorageSync({
//     key: 'userToken',
//     success (res) {
//       console.log(res.data)
//     }
//   })
App({
    onLaunch: function () {
        var _this = this;
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);
        wx.login({
            success: function (res) {
                // console.log(res.code);
                // util_req.getReq('/wechat/amp',{code:res.code},function(){

                // })
                
            },
        });
        // wx.getSetting({
        //     success: function (res) {
        //         if (res.authSetting['scope.userInfo']) {
        //             wx.getUserInfo({
        //                 success: function (res) {
        //                     _this.globalData.userInfo = res.userInfo;
        //                     if (_this.userInfoReadyCallback) {
        //                         _this.userInfoReadyCallback(res);
        //                     }
        //                 },
        //             });
        //         }
        //     },
        // });
    },
    setUserInfo:function(data){   //将用户信息缓存保存
        this.globalData.userInfo = data;
        wx.setStorage({
            key:"userInfo",
            data:data
        })
    },
    setWatcher:function(page) {
        let data = page.data || '';
        let watch = page.watch || '';
        Object.keys(watch).forEach(v => {
            let key = v.split('.'); // 将watch中的属性以'.'切分成数组
            let nowData = data; // 将data赋值给nowData
            for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
                nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
            }
            let lastKey = key[key.length - 1];
            // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
            let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
            let deep = watch[v].deep; // 若未设置deep,则为undefine
            this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
        })
    },
    /**
    * 监听属性 并执行监听函数
    */
    observe:function(obj, key, watchFun, deep, page) {
        var val = obj[key];
        // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
        if (deep && val != null && typeof val === 'object') { 
            Object.keys(val).forEach(childKey=>{ // 遍历val对象下的每一个key
                this.observe(val,childKey,watchFun,deep,page); // 递归调用监听函数
            })
        }
        var that = this;
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function(value) {
                // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
                watchFun.call(page,value,val); // value是新值，val是旧值
                val = value;
                if(deep){ // 若是深度监听,重新监听该对象，以便监听其属性。
                    that.observe(obj, key, watchFun, deep, page); 
                }
            },
            get: function() {
                return val;
            }
        })
    },
    globalData:{
        userInfo:null,
        sk:null,
        rule: rule.rule,
        reqFun: util_req,
        apilist : api,
        // baseURL : 'http://120.25.24.20:81/api',
        baseURL : 'https://beijingzxj.com/api',
        // wsurl : 'wss://test.beijingzxj.com/api/market/websocket',
        // wsurl : 'wss://beijingzxj.com',
        wsurl : 'wss://beijingzxj.com/api/market/websocket'
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxHQUFHLENBQWE7SUFDZCxVQUFVLEVBQUUsRUFBRTtJQUNkLFFBQVE7UUFBUixpQkFpQ0M7UUEvQkMsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUN4QixFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUcvQixFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ1AsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUV2QixDQUFDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNaLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7b0JBRXJDLEVBQUUsQ0FBQyxXQUFXLENBQUM7d0JBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRzs0QkFFVixLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFBOzRCQUl2QyxJQUFJLEtBQUksQ0FBQyxxQkFBcUIsRUFBRTtnQ0FDOUIsS0FBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFBOzZCQUNoQzt3QkFDSCxDQUFDO3FCQUNGLENBQUMsQ0FBQTtpQkFDSDtZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwLnRzXG5BcHA8SUFwcE9wdGlvbj4oe1xuICBnbG9iYWxEYXRhOiB7fSxcbiAgb25MYXVuY2goKSB7XG4gICAgLy8g5bGV56S65pys5Zyw5a2Y5YKo6IO95YqbXG4gICAgY29uc3QgbG9ncyA9IHd4LmdldFN0b3JhZ2VTeW5jKCdsb2dzJykgfHwgW11cbiAgICBsb2dzLnVuc2hpZnQoRGF0ZS5ub3coKSlcbiAgICB3eC5zZXRTdG9yYWdlU3luYygnbG9ncycsIGxvZ3MpXG5cbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuY29kZSlcbiAgICAgICAgLy8g5Y+R6YCBIHJlcy5jb2RlIOWIsOWQjuWPsOaNouWPliBvcGVuSWQsIHNlc3Npb25LZXksIHVuaW9uSWRcbiAgICAgIH0sXG4gICAgfSlcbiAgICAvLyDojrflj5bnlKjmiLfkv6Hmga9cbiAgICB3eC5nZXRTZXR0aW5nKHtcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcbiAgICAgICAgICAvLyDlt7Lnu4/mjojmnYPvvIzlj6/ku6Xnm7TmjqXosIPnlKggZ2V0VXNlckluZm8g6I635Y+W5aS05YOP5pi156ew77yM5LiN5Lya5by55qGGXG4gICAgICAgICAgd3guZ2V0VXNlckluZm8oe1xuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgLy8g5Y+v5Lul5bCGIHJlcyDlj5HpgIHnu5nlkI7lj7Dop6PnoIHlh7ogdW5pb25JZFxuICAgICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEudXNlckluZm8gPSByZXMudXNlckluZm9cblxuICAgICAgICAgICAgICAvLyDnlLHkuo4gZ2V0VXNlckluZm8g5piv572R57uc6K+35rGC77yM5Y+v6IO95Lya5ZyoIFBhZ2Uub25Mb2FkIOS5i+WQjuaJjei/lOWbnlxuICAgICAgICAgICAgICAvLyDmiYDku6XmraTlpITliqDlhaUgY2FsbGJhY2sg5Lul6Ziy5q2i6L+Z56eN5oOF5Ya1XG4gICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJbmZvUmVhZHlDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKHJlcylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pXG4gIH0sXG59KSJdfQ==