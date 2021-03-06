exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _stroke = require("perfect-freehand");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lazyBrush = require("lazy-brush");

var _catenaryCurve = require("catenary-curve");

var _resizeObserverPolyfill = require("resize-observer-polyfill");

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _drawImage = require("./drawImage");

var _drawImage2 = _interopRequireDefault(_drawImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

var canvasStyle = {
  display: "block",
  position: "absolute"
};

var canvasTypes = [{
  name: "interface",
  zIndex: 15
}, {
  name: "drawing",
  zIndex: 11
}, {
  name: "temp",
  zIndex: 12
}, {
  name: "select",
  zIndex: 13
}, {
  name: "borders",
  zIndex: 14
}, {
  name: "grid",
  zIndex: 10
}];

var dimensionsPropTypes = _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]);

var _default = (_temp = _class = function (_PureComponent) {
  _inherits(_default, _PureComponent);

  function _default(props) {
    _classCallCheck(this, _default);

    var _this = _possibleConstructorReturn(this, _PureComponent.call(this, props));

    _this.componentWillUnmount = function () {
      _this.canvasObserver.unobserve(_this.canvasContainer);
    };

    _this.drawImage = function () {
      if (!_this.props.imgSrc) return;

      // Load the image
      _this.image = new Image();

      // Prevent SecurityError "Tainted canvases may not be exported." #70
      _this.image.crossOrigin = "anonymous";

      // Draw the image once loaded
      _this.image.onload = function () {
        return (0, _drawImage2.default)({ ctx: _this.ctx.grid, img: _this.image });
      };
      _this.image.src = _this.props.imgSrc;
    };

    _this.getPointData = function() {
      if (this.props.eraseCanvas)
        return { ...this.lazy.brush.toObject(), erase: true };
      if (this.props.bSelect)
        return { ...this.lazy.brush.toObject(), select: true };
      return this.lazy.brush.toObject();   
    }

    _this.undo = function () {
      // console.log(JSON.stringify(_this.lines));
      if (_this.lines.length === 0) return;
      _this.redo_lines.push(_this.lines.pop());
      var lines = _this.lines;
      _this.clear();
      _this.simulateDrawingLines({ lines: lines, immediate: true });
      _this.triggerOnChange();
    };

    _this.redo = function () {
      if (_this.redo_lines.length === 0) return;
      var lines = _this.lines;
      lines.push(_this.redo_lines.pop());
      _this.clear();
      _this.simulateDrawingLines({ lines: lines, immediate: true });
      _this.triggerOnChange();
      // console.log(JSON.stringify(_this.lines));
    };

    _this.getSaveData = function () {
      // Construct and return the stringified saveData object
      return JSON.stringify({
        lines: _this.lines,
        width: _this.props.canvasWidth,
        height: _this.props.canvasHeight
      });
    };

    _this.loadSaveData = function (saveData) {
      var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.immediateLoading;

      if (typeof saveData !== "string") {
        throw new Error("saveData needs to be of type string!");
      }

      var _JSON$parse = JSON.parse(saveData),
          lines = _JSON$parse.lines,
          width = _JSON$parse.width,
          height = _JSON$parse.height;

      if (!lines || typeof lines.push !== "function") {
        throw new Error("saveData.lines needs to be an array!");
      }

      _this.clear();

      if (width === _this.props.canvasWidth && height === _this.props.canvasHeight) {
        _this.simulateDrawingLines({
          lines: lines,
          immediate: immediate
        });
      } else {
        // we need to rescale the lines based on saved & current dimensions
        var scaleX = _this.props.canvasWidth / width;
        var scaleY = _this.props.canvasHeight / height;
        var scaleAvg = (scaleX + scaleY) / 2;

        _this.simulateDrawingLines({
          lines: lines.map(function (line) {
            return _extends({}, line, {
              points: line.points.map(function (p) {
                return {
                  x: p.x * scaleX,
                  y: p.y * scaleY
                };
              }),
              brushRadius: line.brushRadius * scaleAvg
            });
          }),
          immediate: immediate
        });
      }
    };

    _this.simulateDrawingLines = function (_ref) {
      var lines = _ref.lines,
          immediate = _ref.immediate;

      // Simulate live-drawing of the loaded lines
      // TODO use a generator
      var curTime = 0;
      var timeoutGap = immediate ? 0 : _this.props.loadTimeOffset;

      lines.forEach(function (line) {
        var points = line.points,
            brushColor = line.brushColor,
            brushRadius = line.brushRadius;

        // Draw all at once if immediate flag is set, instead of using setTimeout

        if (immediate) {
          // Draw the points
          _this.drawPoints({
            points: points,
            brushColor: brushColor,
            brushRadius: brushRadius
          });

          if (brushColor === "move-select") {
            const x = line.points[0];
            const y = line.points[1];
            const w = line.points[2];
            const h = line.points[3];
            const x2 = line.points[4];
            const y2 = line.points[5];
            const imageData = _this.ctx.drawing.getImageData(x, y, w, h);
            
            _this.ctx.select.putImageData(imageData, x2, y2);
            _this.ctx.drawing.clearRect(x, y, w, h); 
            _this.ctx.drawing.globalCompositeOperation = "source-over";
            _this.ctx.drawing.drawImage(_this.canvas.select, 0, 0, _this.canvas.select.width, _this.canvas.select.height);
            _this.ctx.select.clearRect(x2, y2, w, h);
            _this.lines.push(line);
            return;
          }

          if (brushColor === "paste-select") {
            const w = line.points[2];
            const h = line.points[3];
            const x2 = line.points[4];
            const y2 = line.points[5];
            const imageData = _this.pasteMemo[line.imgData];
            
            _this.ctx.select.putImageData(imageData, x2, y2);
            _this.ctx.drawing.globalCompositeOperation = "source-over";
            _this.ctx.drawing.drawImage(_this.canvas.select, 0, 0, _this.canvas.select.width, _this.canvas.select.height);
            _this.ctx.select.clearRect(x2, y2, w, h);
            _this.lines.push(line);
            return;
          }
            // Save line with the drawn points
          _this.points = points;
          _this.saveLine({ brushColor: brushColor, brushRadius: brushRadius });
          return;
        }

        // Use timeout to draw

        var _loop = function _loop(i) {
          curTime += timeoutGap;
          window.setTimeout(function () {
            _this.drawPoints({
              points: points.slice(0, i + 1),
              brushColor: brushColor,
              brushRadius: brushRadius
            });
          }, curTime);
        };

        for (var i = 1; i < points.length; i++) {
          _loop(i);
        }

        curTime += timeoutGap;
        window.setTimeout(function () {
          // Save this line with its props instead of this.props
          _this.points = points;
          _this.saveLine({ brushColor: brushColor, brushRadius: brushRadius });
        }, curTime);
      });
    };

    _this.handleDrawStart = function (e) {
      e.preventDefault();

      // Start drawing
      _this.isPressing = true;

      var _this$getPointerPos = _this.getPointerPos(e),
          x = _this$getPointerPos.x,
          y = _this$getPointerPos.y;

      if (e.touches && e.touches.length > 0) {
        // on touch, set catenary position to touch pos
        _this.lazy.update({ x: x, y: y }, { both: true });
      }

      // Ensure the initial down position gets added to our line
      _this.handlePointerMove(x, y);
    };

    _this.handleDrawMove = function (e) {
      e.preventDefault();

      var _this$getPointerPos2 = _this.getPointerPos(e),
          x = _this$getPointerPos2.x,
          y = _this$getPointerPos2.y;

      _this.handlePointerMove(x, y);
    };

    _this.drawSelectBorder = function(time) {
      _this.ctx.borders.beginPath();
      _this.ctx.borders.setLineDash([25, 25]);
      _this.ctx.borders.rect(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.ctx.borders.strokeStyle="#bf1717";
      _this.ctx.borders.lineDashOffset = -(time) * 2;
      _this.ctx.borders.lineWidth = 6;
      _this.ctx.borders.stroke();
    }

    _this.saveSelectionToHistory = function() {
      if (_this.org_x < -100 || _this.sel_x < -100 || (_this.sel_x === _this.orig_x && _this.sel_y === _this.orig_y));
      else {
        var obj = (_this.bPaste ? 
          {
            points: [_this.orig_x, _this.orig_y, _this.sel_w, _this.sel_h, _this.sel_x, _this.sel_y],
            brushColor: "paste-select",
            brushRadius: 2,
            imgData: _this.pasteMemo.length - 1,
          } : 
          {
            points: [_this.orig_x, _this.orig_y, _this.sel_w, _this.sel_h, _this.sel_x, _this.sel_y],
            brushColor: "move-select",
            brushRadius: 2,
          }
        );
        _this.bPaste = false;
        _this.drawPoints(obj);
        _this.lines.push(obj);
        _this.props.onDrawFinish && _this.props.onDrawFinish(_this);
      }
    }

    _this.pasteSelection = function() {
      _this.saveSelectionToHistory();

      _this.bPaste = true;
      _this.ctx.drawing.globalCompositeOperation = "source-over";
      _this.ctx.drawing.drawImage(_this.canvas.select, 0, 0, _this.canvas.select.width, _this.canvas.select.height);
      const imageData = _this.ctx.select.getImageData(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.ctx.select.clearRect(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.sel_x += 100;
      _this.sel_y += 100;
      _this.ctx.select.putImageData(imageData, _this.sel_x, _this.sel_y);
      _this.drawSelectBorder();
    }

    _this.handleSelectionEnd = function() {
      _this.saveSelectionToHistory();

      _this.props.onSelectFinish(_this, "text nou");
      _this.ctx.drawing.globalCompositeOperation = "source-over";
      _this.ctx.drawing.drawImage(_this.canvas.select, 0, 0, _this.canvas.select.width, _this.canvas.select.height);
      _this.ctx.select.clearRect(0, 0, 8000, 8000);
      _this.sel_x = -100000;
      _this.sel_y = -100000;
    }

    _this.moveSelection = function(new_x, new_y) {
      const imageData = _this.ctx.select.getImageData(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.ctx.select.clearRect(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.sel_x = new_x;
      _this.sel_y = new_y;
      _this.ctx.select.putImageData(imageData, _this.sel_x, _this.sel_y);
    }

    _this.AddSelection = function(new_x, new_y) {
      const imageData = _this.ctx.select.getImageData(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.ctx.select.clearRect(_this.sel_x, _this.sel_y, _this.sel_w, _this.sel_h);
      _this.sel_x += new_x;
      _this.sel_y += new_y;
      _this.ctx.select.putImageData(imageData, _this.sel_x, _this.sel_y);
    }

    _this.imageDataToJpg = function(imagedata) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = imagedata.width;
      canvas.height = imagedata.height;
      ctx.putImageData(imagedata, 0, 0);
  
      // var image = new Image();
      // image.src = canvas.toDataURL();
      const base64_encoded_image = canvas.toDataURL().split(",")[1];

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer ya29.c.Kp8BFQgSwggFsf2tIJPNumheigiTz6CDMouu-Hn0tiA5JrJzti7ZnL9Tfi_UOtA8K7V5oDHb7pffFZR9yJ5QnWs8ohXqOKuniNrMz96jRsfVvb3VT89_T0FM8PM0hgqjz2NjqA2Wo15sScBTxSbBLfmvgDYZyfQ__PFoxameLlTKSSuuWjAQXXdy97igL-35MmsR4MMpZm-Z_0ngeo8hngGM...............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................");
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "requests": [
          {
            "image": {
              "content": base64_encoded_image
            },
            "features": [
              {
                "type": "DOCUMENT_TEXT_DETECTION"
              }
            ]
          }
        ]
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://vision.googleapis.com/v1/images:annotate", requestOptions)
        .then(response => response.text())
        //.then(result => console.log(result))
        .then(result => {console.log(result); const parsed_result = JSON.parse(result); _this.props.changeOCRText(parsed_result["responses"][0]["textAnnotations"][0]["description"]); })
        .catch(error => console.log('error', error));

     
    }

    _this.handleDrawEnd = function (e) {
      e.preventDefault();

      // Draw to this end pos
      _this.handleDrawMove(e);

      // Stop drawing & save the drawn line
      _this.isDrawing = false;
      _this.isPressing = false;
      if (_this.props.bSelect) {
        _this.ctx.select.globalCompositeOperation = "source-over";
        const xs = _this.getSelectionRectangle(_this.points);
        if (xs.length == 4 && xs[0] > 0) {
          _this.handleSelectionEnd();
          var x = xs[0] | 0;
          var y = xs[1] | 0;
          var w = xs[2] | 0;
          var h = xs[3] | 0;
          if (w < 0) { x += w; w=-w; }
          if (h < 0) { y += h; h=-h; }
          if (w !== 0 && h !== 0) {
            const imageData = _this.ctx.drawing.getImageData(x, y, w, h);
            _this.imageDataToJpg(imageData);
            _this.pasteImageData = imageData;
            _this.pasteMemo.push(_this.pasteImageData);
            _this.ctx.drawing.clearRect(x, y, w, h);
            _this.sel_x = _this.orig_x = x;
            _this.sel_y = _this.orig_y = y;
            _this.sel_w = w;
            _this.sel_h = h;
            _this.ctx.select.putImageData(imageData, x, y);
          }
        }
      }
      if (_this.props.bSelect === false && _this.props.disabled === false && _this.points.length >= 2) _this.props.onDrawFinish && _this.props.onDrawFinish(_this);
      
      if (_this.props.bSmooth === true) {
        console.log("etc");
        const new_format_points = _this.points.map(result => 
          [result["x"], result["y"], 0.5]
        );
        console.log(JSON.stringify(new_format_points));
        const stroked_points = _stroke.getStroke(new_format_points, {
          size: 8,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
          easing: (t) => t,
          simulatePressure: true,
          last: true,
          start: {
            cap: true,
            taper: 0,
            easing: (t) => t,
          },
          end: {
            cap: true,
            taper: 0,
            easing: (t) => t,
          },
        });

        console.log(JSON.stringify(stroked_points));
        // console.log(JSON.stringify(new_format_stroked_points);
        
        for (var i = 0; i < _this.points.length && i < stroked_points.length; i++)
        {
          _this.points[i].x = Math.floor(stroked_points[i][0]);
          _this.points[i].y = Math.floor(stroked_points[i][1]);
        }

       
        console.log(JSON.stringify(_this.points));
        if (_this.points.length >= 2 )
        _this.drawPoints({
          points: _this.points,
          brushColor: _this.props.brushColor,
          brushRadius: _this.props.brushRadius
        });
      }

      _this.saveLine();
    };

    _this.handleCanvasResize = function (entries, observer) {
      var saveData = _this.getSaveData();
      for (var _iterator = entries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var entry = _ref2;
        var _entry$contentRect = entry.contentRect,
            width = _entry$contentRect.width,
            height = _entry$contentRect.height;

        _this.setCanvasSize(_this.canvas.interface, width, height);
        _this.setCanvasSize(_this.canvas.drawing, width, height);
        _this.setCanvasSize(_this.canvas.temp, width, height);
        _this.setCanvasSize(_this.canvas.select, width, height);
        _this.setCanvasSize(_this.canvas.borders, width, height);
        _this.setCanvasSize(_this.canvas.grid, width, height);

        _this.drawGrid(_this.ctx.grid);
        _this.drawImage();
        _this.loop({ once: true });
      }
      _this.loadSaveData(saveData, true);
    };

    _this.setCanvasSize = function (canvas, width, height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width;
      canvas.style.height = height;
    };

    _this.isMouseInside = function() {
      const e = _this.latestPosition;
      if (e) {
        var rect = _this.canvas.interface.getBoundingClientRect();

        var clientX = e.clientX;
        var clientY = e.clientY;

        if (clientX < rect.left) return false;
        if (clientX > rect.right) return false;
        if (clientY > rect.bottom) return false;
        if (clientY < rect.top) return false;
        return true;
      }
      return false;
    }

    _this.getPointerPos = function (e) {
      _this.latestPosition = e;
      var rect = _this.canvas.interface.getBoundingClientRect();

      // use cursor pos as default
      var clientX = e.clientX;
      var clientY = e.clientY;

      // use first touch if available
      if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      // return mouse/touch position inside canvas
      const multiply = 1 / _this.props.scale;
      return {
        x: (clientX - rect.left) * multiply,
        y: (clientY - rect.top) * multiply
      };
    };

    _this.handlePointerMove = function (x, y) {
      if (_this.props.disabled) return;

      _this.lazy.update({ x: x, y: y });
      var isDisabled = !_this.lazy.isEnabled();

      if (_this.isPressing && !_this.isDrawing || isDisabled && _this.isPressing) {
        // Start drawing and add point
        _this.isDrawing = true;
        _this.points.push(_this.getPointData());
      }

      if (_this.isDrawing) {
        // Add new point
        _this.points.push(_this.getPointData());

        _this.redo_lines = [];

        // Draw current points
        if (_this.props.bSelect);
        else
          _this.drawPoints({
            points: _this.points,
            brushColor: _this.props.eraseCanvas ? "erase" : _this.props.brushColor,
            brushRadius: _this.props.brushRadius
          });
      }

      _this.mouseHasMoved = true;
    };

    _this.drawPoints = function (_ref3) {
      var points = _ref3.points,
          brushColor = _ref3.brushColor,
          brushRadius = _ref3.brushRadius;

      if (brushColor === "move-select" || brushColor === "paste-select") {
        return;
      }

      _this.ctx.temp.lineJoin = "round";
      _this.ctx.temp.lineCap = "round";
      _this.ctx.temp.strokeStyle = (brushColor === "erase") ? "#FFFFFF" : brushColor;
      this.ctx.drawing.globalCompositeOperation = (brushColor === "erase") ? "destination-out" : "source-over";

      _this.ctx.temp.clearRect(0, 0, _this.ctx.temp.canvas.width, _this.ctx.temp.canvas.height);
      _this.ctx.temp.lineWidth = brushRadius * 2;

      var p1 = points[0];
      var p2 = points[1];

      {
        _this.ctx.temp.moveTo(p2.x, p2.y);
        _this.ctx.temp.beginPath();

        for (var i = 1, len = points.length; i < len; i++) {
          // we pick the point between pi+1 & pi+2 as the
          // end point and p1 as our control point
          var midPoint = midPointBtw(p1, p2);
          _this.ctx.temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
          p1 = points[i];
          p2 = points[i + 1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        _this.ctx.temp.lineTo(p1.x, p1.y);
        _this.ctx.temp.stroke();
      }
    };

    _this.saveLine = function () {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          brushColor = _ref4.brushColor,
          brushRadius = _ref4.brushRadius;

      if (_this.points.length < 2) return;

      if (_this.points[0].erase) {
        brushColor = "erase";
      }

      if (_this.points[0].select) {
        _this.points.length = 0;
        _this.ctx.temp.clearRect(0, 0, width, height);
        return;
      }

      // Save as new line
      _this.lines.push({
        points: [].concat(_this.points),
        brushColor: brushColor || _this.props.brushColor,
        brushRadius: brushRadius || _this.props.brushRadius
      });

      // Reset points array
      _this.points.length = 0;

      var width = _this.canvas.temp.width;
      var height = _this.canvas.temp.height;

      // Copy the line to the drawing canvas
      _this.ctx.drawing.drawImage(_this.canvas.temp, 0, 0, width, height);

      // Clear the temporary line-drawing canvas
      _this.ctx.temp.clearRect(0, 0, width, height);

      _this.triggerOnChange();
    };

    _this.triggerOnChange = function () {
      _this.props.onChange && _this.props.onChange(_this);
    };

    _this.clear = function () {
      _this.lines = [];
      _this.valuesChanged = true;
      _this.ctx.drawing.clearRect(0, 0, _this.canvas.drawing.width, _this.canvas.drawing.height);
      _this.ctx.temp.clearRect(0, 0, _this.canvas.temp.width, _this.canvas.temp.height);
    };

    _this.loop = function () {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$once = _ref5.once,
          once = _ref5$once === undefined ? false : _ref5$once;

      _this.ctx.borders.clearRect(0, 0, _this.canvas.borders.width, _this.canvas.borders.height);
      _this.drawSelectBorder(_this.time);

      if (_this.mouseHasMoved || _this.valuesChanged) {
        var pointer = _this.lazy.getPointerCoordinates();
        var brush = _this.lazy.getBrushCoordinates();

        _this.drawInterface(_this.ctx.interface, pointer, brush);
        _this.mouseHasMoved = false;
        _this.valuesChanged = false;
      }

      if (!once) {
        setTimeout(() => {_this.time += 1}, 1);
        window.requestAnimationFrame(function () {
          _this.loop();
        });
      }
    };

    _this.drawGrid = function (ctx) {
      if (_this.props.hideGrid) return;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.beginPath();
      ctx.setLineDash([5, 1]);
      ctx.setLineDash([]);
      ctx.strokeStyle = _this.props.gridColor;
      ctx.lineWidth = 0.5;

      var gridSize = 25;

      var countX = 0;
      while (countX < ctx.canvas.width) {
        countX += gridSize;
        ctx.moveTo(countX, 0);
        ctx.lineTo(countX, ctx.canvas.height);
      }
      ctx.stroke();

      var countY = 0;
      while (countY < ctx.canvas.height) {
        countY += gridSize;
        ctx.moveTo(0, countY);
        ctx.lineTo(ctx.canvas.width, countY);
      }
      ctx.stroke();
    };
    
    _this.getSelectionRectangle = function (points) {
      var x = -100;
      var y = -100;
      var w = 10;
      var h = 10;
      if (_this.points.length > 0) {
        x = _this.points[0].x;
        y = _this.points[0].y;
        w = _this.points[_this.points.length-1].x - x;
        h = _this.points[_this.points.length-1].y - y;
      }
      return [x, y, w, h]; 
    };

    _this.drawInterface = function (ctx, pointer, brush) {
      if (_this.props.hideInterface) return;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (_this.props.bSelect) {
        var x = _this.getSelectionRectangle(_this.points);
        ctx.beginPath();
        ctx.globalAlpha = 0.4;
        ctx.fillRect(x[0], x[1], x[2], x[3]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#17C69A";
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      else {
        // Draw brush preview
        if (_this.isMouseInside()) {
            ctx.beginPath();
            ctx.fillStyle = this.props.eraseCanvas ? "#FFFFFF" : _this.props.brushColor;
            ctx.arc(brush.x, brush.y, _this.props.brushRadius, 0, Math.PI * 2, true);
            ctx.fill();
        }

        // Draw mouse point (the one directly at the cursor)
        ctx.beginPath();
        ctx.fillStyle = _this.props.catenaryColor;
        ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2, true);
        ctx.fill();

        // Draw catenary
        if (_this.lazy.isEnabled()) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.setLineDash([2, 4]);
          ctx.strokeStyle = _this.props.catenaryColor;
          _this.catenary.drawToCanvas(_this.ctx.interface, brush, pointer, _this.chainLength);
          ctx.stroke();
        }

        // Draw brush point (the one in the middle of the brush preview)
        ctx.beginPath();
        ctx.fillStyle = _this.props.catenaryColor;
        ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true);
        ctx.fill();
      }
    };

    _this.canvas = {};
    _this.ctx = {};

    _this.catenary = new _catenaryCurve.Catenary();

    _this.points = [];
    _this.lines = [];
    _this.pasteMemo = [];
    _this.pasteImageData = null;
    _this.bPaste = false;
    _this.loop_clock = null;
    _this.time = 0.0;
    _this.redo_lines = [];
    _this.latestPosition = null;

    _this.mouseHasMoved = true;
    _this.valuesChanged = true;
    _this.isDrawing = false;
    _this.isPressing = false;
    _this.orig_x = -1000;
    _this.orig_y = -1000;
    _this.sel_x = -1000;
    _this.sel_y = -1000;
    _this.sel_w = 10;
    _this.sel_h = 10;
    return _this;
  }

  _default.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.lazy = new _lazyBrush.LazyBrush({
      radius: this.props.lazyRadius * window.devicePixelRatio,
      enabled: true,
      initialPoint: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
    });
    this.chainLength = this.props.lazyRadius * window.devicePixelRatio;

    this.canvasObserver = new _resizeObserverPolyfill2.default(function (entries, observer) {
      return _this2.handleCanvasResize(entries, observer);
    });
    this.canvasObserver.observe(this.canvasContainer);

    this.drawImage();
    this.loop();

    window.setTimeout(function () {
      var initX = window.innerWidth / 2;
      var initY = window.innerHeight / 2;
      _this2.lazy.update({ x: initX - _this2.chainLength / 4, y: initY }, { both: true });
      _this2.lazy.update({ x: initX + _this2.chainLength / 4, y: initY }, { both: false });
      _this2.mouseHasMoved = true;
      _this2.valuesChanged = true;
      _this2.clear();

      // Load saveData from prop if it exists
      if (_this2.props.saveData) {
        _this2.loadSaveData(_this2.props.saveData);
      }
    }, 100);
  };

  _default.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.lazyRadius !== this.props.lazyRadius) {
      // Set new lazyRadius values
      this.chainLength = this.props.lazyRadius * window.devicePixelRatio;
      this.lazy.setRadius(this.props.lazyRadius * window.devicePixelRatio);
    }

    if (prevProps.saveData !== this.props.saveData) {
      this.loadSaveData(this.props.saveData);
    }

    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Signal this.loop function that values changed
      this.valuesChanged = true;
    }
  };

  _default.prototype.render = function render() {
    var _this3 = this;

    return _react2.default.createElement(
      "div",
      {
        className: this.props.className,
        style: _extends({
          display: "block",
          background: this.props.backgroundColor,
          touchAction: "none",
          width: this.props.canvasWidth,
          height: this.props.canvasHeight
        }, this.props.style),
        ref: function ref(container) {
          if (container) {
            _this3.canvasContainer = container;
          }
        }
      },
      canvasTypes.map(function (_ref6) {
        var name = _ref6.name,
            zIndex = _ref6.zIndex;

        var isInterface = name === "interface";
        return _react2.default.createElement("canvas", {
          key: name,
          ref: function ref(canvas) {
            if (canvas) {
              _this3.canvas[name] = canvas;
              _this3.ctx[name] = canvas.getContext("2d");
            }
          },
          style: _extends({}, canvasStyle, { zIndex: zIndex }),
          onMouseDown: isInterface ? _this3.handleDrawStart : undefined,
          onMouseMove: isInterface ? _this3.handleDrawMove : undefined,
          onMouseUp: isInterface ? _this3.handleDrawEnd : undefined,
          onMouseOut: isInterface ? _this3.handleDrawEnd : undefined,
          onTouchStart: isInterface ? _this3.handleDrawStart : undefined,
          onTouchMove: isInterface ? _this3.handleDrawMove : undefined,
          onTouchEnd: isInterface ? _this3.handleDrawEnd : undefined,
          onTouchCancel: isInterface ? _this3.handleDrawEnd : undefined
        });
      })
    );
  };

  return _default;
}(_react.PureComponent), _class.propTypes = {
  onChange: _propTypes2.default.func,
  scale: _propTypes2.default.number,
  loadTimeOffset: _propTypes2.default.number,
  lazyRadius: _propTypes2.default.number,
  brushRadius: _propTypes2.default.number,
  brushColor: _propTypes2.default.string,
  catenaryColor: _propTypes2.default.string,
  gridColor: _propTypes2.default.string,
  backgroundColor: _propTypes2.default.string,
  hideGrid: _propTypes2.default.bool,
  canvasWidth: dimensionsPropTypes,
  canvasHeight: dimensionsPropTypes,
  disabled: _propTypes2.default.bool,
  imgSrc: _propTypes2.default.string,
  saveData: _propTypes2.default.string,
  immediateLoading: _propTypes2.default.bool,
  hideInterface: _propTypes2.default.bool,
  eraseCanvas: _propTypes2.default.bool,
  bSelect: _propTypes2.default.bool,
  onDrawFinish: _propTypes2.default.func,
  onSelectFinish: _propTypes2.default.func,
  changeOCRText: _propTypes2.default.func,
  bSmooth: _propTypes2.default.bool,
}, _class.defaultProps = {
  onChange: null,
  scale: 1,
  loadTimeOffset: 5,
  lazyRadius: 12,
  brushRadius: 10,
  brushColor: "#444",
  catenaryColor: "#0a0302",
  gridColor: "rgba(150,150,150,0.17)",
  backgroundColor: "#FFF",
  hideGrid: false,
  canvasWidth: 400,
  canvasHeight: 400,
  disabled: false,
  imgSrc: "",
  saveData: "",
  immediateLoading: false,
  hideInterface: false,
  bSelect: false,
  eraseCanvas: false,
  onDrawFinish: (ref) => { },
  onSelectFinish: (ref) => { },
  changeOCRText: (text) => { },
  bSmooth: false,
}, _temp);

exports.default = _default;
export default exports["default"];