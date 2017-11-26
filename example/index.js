require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/geometry/SpatialReference",
    "Popup/index",
    "dojo/domReady!"
], function (Map, SceneView, GraphicsLayer, Graphic, Point,SpatialReference,
    Popup
) {
    tempPopupInstance = null;
    let view = new SceneView({
        map: new Map({
            basemap: "osm"
        }),
        container: "viewDiv",
        center: [86.2342, 42.0412],
        zoom: 15,
        heading: 10,
        tilt: 100
    });
    let graphicsLayer = new GraphicsLayer({
        id: "tempGraphicsLayer"
    });
    view.map.add(graphicsLayer);
    addData().then(()=>{
        registEvent();
    });

    // 注册事件
    function registEvent(){
        let tempPopupInstance = new Popup(view);
        view.on("pointer-move", (evt)=> {
            view.hitTest(evt).then((response) => {
                let result = response.results[0];
                if (result.graphic) {
                    let graphicAttr = result.graphic.attributes;
                    let content = "";
                    content += `<div class="jidianjin">`;
                    // title
                    content += `<div class="title">`;
                    content += `<span>${graphicAttr.STNM}</span>`;
                    content += `<span>${graphicAttr.STCD}</span>`;
                    content += `</div>`;
                    // content
                    content += `<div class="content">`;
                    content += `<div class="content-title">`;
                    content += '<span>开泵时间</span>';
                    content += '<span>运行时长(H)</span>';
                    content += '<span>瞬时流量(m*3/s)</span>';
                    content += `</div>`;
                    content += `<div class="line"></div>`;
                    content += `<div class="content-value">`;
                    content += `<span>11-26</span>`;
                    content += `<span>4</span>`;
                    content += `<span>4</span>`;
                    content += `</div>`;
                    content += "</div>";
                    tempPopupInstance.show(result.mapPoint, content, {})
                } else {
                    tempPopupInstance.destroy();
                }
            });
        })
    };
    // 加载数据
    function addData(){
        return new Promise((resolve, reject) =>{
            let symbol = {
                type: "point-3d", 
                symbolLayers: [{
                    type: "object", 
                    width: 50, 
                    height: 100, 
                    depth: 15, 
                    resource: {
                        primitive: "cube"
                    },
                    material: {
                        color: "red"
                    }
                }]
            };
            for (let point of data) {
                let tempGraphic = new Graphic({
                    attributes: {
                        STNM: point.STNM,
                        STCD: point.STCD
                    },
                    geometry: new Point({
                        x: point.LGTD,
                        y: point.LTTD,
                        spatialReference: new SpatialReference({
                            wkid: 4326
                        })
                    }),
                    symbol: symbol
                });
                graphicsLayer.graphics.add(tempGraphic);
                tempGraphic = null;
            }
            resolve();
        });
    }
});