(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{864:function(t,e,o){"use strict";o.r(e);var n={name:"Login",data:function(){return{auth:"",code:""}},methods:{setAuth:function(t){localStorage.auth=t,this.auth=t},setAuthCode:function(){"5334"===this.code&&this.setAuth(1),"7891"===this.code&&this.setAuth(2),"17823"===this.code&&this.setAuth(3),"89012"===this.code&&this.setAuth(4),"09342"===this.code&&this.setAuth(5)}},mounted:function(){localStorage.auth&&(this.auth=localStorage.auth)}},h=o(9),component=Object(h.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[t.auth?o("div",[t._v("\n    Вход произведен!\n\n  ")]):o("div",[o("mdb-input",{attrs:{label:"Введите код для входа"},model:{value:t.code,callback:function(e){t.code=e},expression:"code"}}),t._v(" "),o("mdb-btn",{on:{click:t.setAuthCode}},[t._v("Войти")])],1)])}),[],!1,null,"1288e65e",null);e.default=component.exports}}]);