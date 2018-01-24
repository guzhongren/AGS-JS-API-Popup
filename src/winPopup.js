define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    "dojo/dom-style",
    'dojo/dom',
    "dojo/_base/window",
    'dojo/on'
], function (declare, domConstruct, domStyle, dom, win, on) {
    return declare([], {
        _view: null,
        _mapPoint: null,
        _style: null,
        _winPopupDom: null, // 弹出框实例
        _currentScreenPoint: null, // 弹出框当前屏幕位置
        /**
         * 构造函数
         * @param view {MapView| SceneView} 地图视图
         */
        constructor: function (view) {
            let _self = this;
            _self._view = view;
            _self._view.on(['double-click', 'hold', 'drag', 'mouse-wheel'], function (evt) {
                if (_self._winPopupDom) {
                    if (evt && (evt.type === 'drag' || evt.type === 'mouse-wheel')) {
                        _self._currentScreenPoint = _self._view.toScreen(_self._mapPoint);
                        _self.updatePopPosition(_self._currentScreenPoint);
                    } else {
                        if (_self._winPopupDom) {
                            _self.destroy();
                        }
                    }
                }
            });
            _self._view.on('resize', function (evt) {
                if (_self._winPopupDom) {
                    let widthScall = evt.oldWidth / evt.width;
                    let heightScall = evt.oldHeight / evt.height;

                    let currentX = _self._currentScreenPoint.x / widthScall;
                    let currentY = _self._currentScreenPoint.y / heightScall;
                    _self._currentScreenPoint = {
                        x: currentX,
                        y: currentY
                    };
                    _self.updatePopPosition(_self._currentScreenPoint);
                }

            });
            

        },
        /**
         * 创建pop dom
         */
        _createSiglePopup: function (title, content) {
            let _self = this;
            _self._winPopupDom = domConstruct.create("div", {
                id: "winPopupId",
                innerHTML: '<span id="yin" style="position: absolute; display: block; left: calc(50% - 10px); width: 20px; height: 21px;margin-top: -20px; background: url(./img/tipAngle.png) no-repeat center"></span><div style= "background-color: #3a7ad6; display: flex; justify-content: space-between; font-size: 14px; color: #fff; padding: 6px 9px;"><span id="popTitle">' + title + '</span><span id="closePop" style= "cursor: pointer;">X</span></div><div id="popContent" style="display: block;">' + content + '</div>',
            }, win.body(), "last");
            on(dom.byId('closePop'), 'click', function(){
                _self.destroy();
            });
        },
        /**
         * 显示pop
         * @description 弹出框的位置为鼠标点右下角5px
         * @param mapPoint {Point} 鼠标经过的点
        //  * @param content {string| HTML} 要在弹窗框中显示的内容
         * @param style{CSS | style Object} 弹出框的样式，默认样式为"width": "300px", "z-index": "888", "position": "absolute"
         */
        show: function (mapPoint, title, content, style) {
            let _self = this;
            if (_self._winPopupDom) {
                _self.destroy();
            }
            _self._mapPoint = mapPoint;
            _self._createSiglePopup(title, content);
            _self._currentScreenPoint = _self._view.toScreen(mapPoint);
            _self._style = Object.assign({
                "background-color": "#fff",
                "width": "460px",
                "z-index": "888",
                "position": "absolute"
            },style? style:{});
            domStyle.set(_self._winPopupDom, _self._style);
            _self.updatePopPosition(_self._currentScreenPoint);
            
        },
        updatePopPosition: function (newScreenPoint) {
            let _self = this;
            domStyle.set(_self._winPopupDom, {
                'left': newScreenPoint.x - parseFloat(_self._style['width'])/2.0 + 'px',
                'top': newScreenPoint.y + 28 + 'px'
            });
        },
        /**
         * 销毁pop
         */
        destroy: function () {
            this._winPopupDom && domConstruct.destroy(this._winPopupDom);
        }
    })

});