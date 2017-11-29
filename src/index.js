define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    "dojo/dom-style",
    "dojo/_base/window"
], function(declare, domConstruct, domStyle, win) {
    return declare([], {
        _view: null,
        _mapPoint: null,
        _content: null,
        _style: null,
        _tempPopupDom: null,
        /**
         * 构造函数
         * @param view {MapView| SceneView} 地图视图
         */
        constructor: function (view){
            this._view =  view;
            this._createSiglePopup();
        },
        /**
         * 创建pop dom
         */
        _createSiglePopup: function(){
            this._tempPopupDom = domConstruct.create("div", {id:"tempPopupId"}, win.body(), "last");
        },
        /**
         * 显示pop
         * @description 弹出框的位置为鼠标点右下角5px
         * @param mapPoint {Point} 鼠标经过的点
         * @param content {string} 要在弹窗框中显示的内容
         * @param style{CSS | style Object} 弹出框的样式，默认样式为"width": "300px", "z-index": "888", "position": "absolute"
         */
        show: function(mapPoint, content, style){
            this._content = content;
            let tempPosition = this._view.toScreen(mapPoint);
            this._style= Object.assign(style, {"background-color":"#fff","top": tempPosition.y + 5+"px", "left":  tempPosition.x + 5+"px", "width": "300px", "z-index": "888", "position": "absolute", "word-wrap":"break-word"});
            domStyle.set(this._tempPopupDom,this._style);
            domConstruct.empty(this._tempPopupDom);
            domConstruct.place(this._content, this._tempPopupDom);
        },
        /**
         * 销毁pop
         */
        destroy: function(){
            this._tempPopupDom && domConstruct.destroy(this._tempPopupDom);
            this._createSiglePopup();
        }
    })
    
});
