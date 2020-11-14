/******/ (() => { // webpackBootstrap
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// WebGL2 example code
function draw_triangle(canvas) {
  var gl = canvas.getContext('webgl2');

  if (gl === null) {
    alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
    return;
  }

  var vertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  var indices = [0, 1, 2];
  var index_Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  var vertex_code = "\n        attribute vec3 coordinates;\n        void main(void)\n        {\n            gl_Position = vec4(coordinates, 1.0);\n        }\n    ";
  var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, vertex_code);
  gl.compileShader(vertex_shader);
  var fragment_code = "\n        void main(void) {\n            gl_FragColor = vec4(gl_FragCoord.rgb, 0.1);\n        }\n    ";
  var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment_shader, fragment_code);
  gl.compileShader(fragment_shader);
  var program = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
  var coord_idx = gl.getAttribLocation(program, "coordinates");
  gl.vertexAttribPointer(coord_idx, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coord_idx);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
} // Put a wrapper on every WebGL2 method


function setup_handler(command_list) {
  var descriptors = Object.getOwnPropertyDescriptors(WebGL2RenderingContext.prototype);

  for (var property_name in descriptors) {
    if (descriptors[property_name]['get'] == undefined) {
      var property = WebGL2RenderingContext.prototype[property_name];

      if (typeof property == 'function') {
        (function () {
          var original_function = WebGL2RenderingContext.prototype[property_name];

          var wrapper = function wrapper() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var return_value = original_function.call.apply(original_function, [this].concat(args)) || null;
            command_list.add.apply(command_list, [original_function, return_value].concat(args));
            return return_value;
          };

          WebGL2RenderingContext.prototype[property_name] = wrapper;
        })();
      }
    }
  }
} // Contains every calls made to a WebGL2 context


var CommandList = /*#__PURE__*/function () {
  function CommandList() {
    _classCallCheck(this, CommandList);

    _defineProperty(this, "commands", new Array());
  }

  _createClass(CommandList, [{
    key: "add",
    value: function add(fn, return_value) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      this.commands.push({
        original_function: fn,
        return_value: return_value,
        args: [].concat(args)
      });
      console.log(this.commands[this.commands.length - 1]);
    }
  }]);

  return CommandList;
}(); // Replay the calls from a command list


function replay_commands(command_list, gl, canvas) {
  var variables = new Map();

  var _iterator = _createForOfIteratorHelper(command_list.commands),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var command = _step.value;
      var original_returned_value = command.return_value;

      var args = _toConsumableArray(command.args); // replace variables


      for (var i_argument in args) {
        if (variables.has(args[i_argument])) {
          args[i_argument] = variables.get(args[i_argument]);
        }
      }

      var returned_value = command.original_function.bind(gl).apply(void 0, _toConsumableArray(args));

      if (returned_value) {
        variables.set(original_returned_value, returned_value);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function main() {
  var client_canvas = document.querySelector('#client_canvas');
  var webdoc_canvas = document.querySelector('#webdoc_canvas');
  var webdoc_gl = webdoc_canvas.getContext('webgl2');

  if (webdoc_gl === null) {
    alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
    return;
  }

  command_list = new CommandList();
  setup_handler(command_list);
  draw_triangle(client_canvas);
  replay_commands(command_list, webdoc_gl, webdoc_canvas);
  bob = 0;
}

window.onload = main;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJkb2MvLi9zcmMvYXBwLmpzIl0sIm5hbWVzIjpbImRyYXdfdHJpYW5nbGUiLCJjYW52YXMiLCJnbCIsImdldENvbnRleHQiLCJhbGVydCIsInZlcnRpY2VzIiwidmVydGV4X2J1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiRmxvYXQzMkFycmF5IiwiU1RBVElDX0RSQVciLCJpbmRpY2VzIiwiaW5kZXhfQnVmZmVyIiwiRUxFTUVOVF9BUlJBWV9CVUZGRVIiLCJVaW50MTZBcnJheSIsInZlcnRleF9jb2RlIiwidmVydGV4X3NoYWRlciIsImNyZWF0ZVNoYWRlciIsIlZFUlRFWF9TSEFERVIiLCJzaGFkZXJTb3VyY2UiLCJjb21waWxlU2hhZGVyIiwiZnJhZ21lbnRfY29kZSIsImZyYWdtZW50X3NoYWRlciIsIkZSQUdNRU5UX1NIQURFUiIsInByb2dyYW0iLCJjcmVhdGVQcm9ncmFtIiwiYXR0YWNoU2hhZGVyIiwibGlua1Byb2dyYW0iLCJ1c2VQcm9ncmFtIiwiY29vcmRfaWR4IiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwiRkxPQVQiLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImNsZWFyQ29sb3IiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiY2xlYXIiLCJDT0xPUl9CVUZGRVJfQklUIiwidmlld3BvcnQiLCJ3aWR0aCIsImhlaWdodCIsImRyYXdFbGVtZW50cyIsIlRSSUFOR0xFUyIsImxlbmd0aCIsIlVOU0lHTkVEX1NIT1JUIiwic2V0dXBfaGFuZGxlciIsImNvbW1hbmRfbGlzdCIsImRlc2NyaXB0b3JzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsIldlYkdMMlJlbmRlcmluZ0NvbnRleHQiLCJwcm90b3R5cGUiLCJwcm9wZXJ0eV9uYW1lIiwidW5kZWZpbmVkIiwicHJvcGVydHkiLCJvcmlnaW5hbF9mdW5jdGlvbiIsIndyYXBwZXIiLCJhcmdzIiwicmV0dXJuX3ZhbHVlIiwiY2FsbCIsImFkZCIsIkNvbW1hbmRMaXN0IiwiQXJyYXkiLCJmbiIsImNvbW1hbmRzIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJyZXBsYXlfY29tbWFuZHMiLCJ2YXJpYWJsZXMiLCJNYXAiLCJjb21tYW5kIiwib3JpZ2luYWxfcmV0dXJuZWRfdmFsdWUiLCJpX2FyZ3VtZW50IiwiaGFzIiwiZ2V0IiwicmV0dXJuZWRfdmFsdWUiLCJiaW5kIiwic2V0IiwibWFpbiIsImNsaWVudF9jYW52YXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ3ZWJkb2NfY2FudmFzIiwid2ViZG9jX2dsIiwiYm9iIiwid2luZG93Iiwib25sb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxTQUFTQSxhQUFULENBQXVCQyxNQUF2QixFQUNBO0FBQ0ksTUFBTUMsRUFBRSxHQUFHRCxNQUFNLENBQUNFLFVBQVAsQ0FBa0IsUUFBbEIsQ0FBWDs7QUFFQSxNQUFJRCxFQUFFLEtBQUssSUFBWCxFQUFpQjtBQUNiRSxTQUFLLENBQUMsMEVBQUQsQ0FBTDtBQUNBO0FBQ0g7O0FBRUQsTUFBSUMsUUFBUSxHQUFHLENBQ1gsQ0FBQyxHQURVLEVBQ04sR0FETSxFQUNGLEdBREUsRUFFWCxDQUFDLEdBRlUsRUFFTixDQUFDLEdBRkssRUFFRCxHQUZDLEVBR1gsR0FIVyxFQUdQLENBQUMsR0FITSxFQUdGLEdBSEUsQ0FBZjtBQU1BLE1BQUlDLGFBQWEsR0FBR0osRUFBRSxDQUFDSyxZQUFILEVBQXBCO0FBQ0FMLElBQUUsQ0FBQ00sVUFBSCxDQUFjTixFQUFFLENBQUNPLFlBQWpCLEVBQStCSCxhQUEvQjtBQUNBSixJQUFFLENBQUNRLFVBQUgsQ0FBY1IsRUFBRSxDQUFDTyxZQUFqQixFQUErQixJQUFJRSxZQUFKLENBQWlCTixRQUFqQixDQUEvQixFQUEyREgsRUFBRSxDQUFDVSxXQUE5RDtBQUNB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QUFDQSxNQUFJb0YsU0FBUyxLQUFLLElBQWxCLEVBQXdCO0FBQ3BCbkYsU0FBSyxDQUFDLDBFQUFELENBQUw7QUFDQTtBQUNIOztBQUVENkMsY0FBWSxHQUFHLElBQUllLFdBQUosRUFBZjtBQUNBaEIsZUFBYSxDQUFDQyxZQUFELENBQWI7QUFFQWpELGVBQWEsQ0FBQ21GLGFBQUQsQ0FBYjtBQUVBWixpQkFBZSxDQUFDdEIsWUFBRCxFQUFlc0MsU0FBZixFQUEwQkQsYUFBMUIsQ0FBZjtBQUVBRSxLQUFHLEdBQUcsQ0FBTjtBQUNIOztBQUVEQyxNQUFNLENBQUNDLE1BQVAsR0FBZ0JSLElBQWhCLEMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdlYkdMMiBleGFtcGxlIGNvZGVcbmZ1bmN0aW9uIGRyYXdfdHJpYW5nbGUoY2FudmFzKVxue1xuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicpO1xuXG4gICAgaWYgKGdsID09PSBudWxsKSB7XG4gICAgICAgIGFsZXJ0KCdVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTDIuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB2ZXJ0aWNlcyA9IFtcbiAgICAgICAgLTAuNSwwLjUsMC4wLFxuICAgICAgICAtMC41LC0wLjUsMC4wLFxuICAgICAgICAwLjUsLTAuNSwwLjAsXG4gICAgXTtcblxuICAgIGxldCB2ZXJ0ZXhfYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuICAgIGxldCBpbmRpY2VzID0gWzAsMSwyXTtcbiAgICBsZXQgaW5kZXhfQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kZXhfQnVmZmVyKTtcbiAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuICAgIGxldCB2ZXJ0ZXhfY29kZSA9XG4gICAgYFxuICAgICAgICBhdHRyaWJ1dGUgdmVjMyBjb29yZGluYXRlcztcbiAgICAgICAgdm9pZCBtYWluKHZvaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGdsX1Bvc2l0aW9uID0gdmVjNChjb29yZGluYXRlcywgMS4wKTtcbiAgICAgICAgfVxuICAgIGA7XG5cbiAgICBsZXQgdmVydGV4X3NoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4X3NoYWRlciwgdmVydGV4X2NvZGUpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4X3NoYWRlcik7XG5cbiAgICBsZXQgZnJhZ21lbnRfY29kZSA9XG4gICAgYFxuICAgICAgICB2b2lkIG1haW4odm9pZCkge1xuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChnbF9GcmFnQ29vcmQucmdiLCAwLjEpO1xuICAgICAgICB9XG4gICAgYDtcblxuICAgIGxldCBmcmFnbWVudF9zaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRfc2hhZGVyLCBmcmFnbWVudF9jb2RlKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdtZW50X3NoYWRlcik7XG5cbiAgICBsZXQgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4X3NoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50X3NoYWRlcik7XG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhfYnVmZmVyKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleF9CdWZmZXIpO1xuXG4gICAgbGV0IGNvb3JkX2lkeCA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiY29vcmRpbmF0ZXNcIik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihjb29yZF9pZHgsIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29vcmRfaWR4KTtcblxuICAgIGdsLmNsZWFyQ29sb3IoMC41LCAwLjUsIDAuNSwgMC45KTtcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgZ2wudmlld3BvcnQoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIGluZGljZXMubGVuZ3RoLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XG59XG5cbi8vIFB1dCBhIHdyYXBwZXIgb24gZXZlcnkgV2ViR0wyIG1ldGhvZFxuZnVuY3Rpb24gc2V0dXBfaGFuZGxlcihjb21tYW5kX2xpc3QpXG57XG4gICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoV2ViR0wyUmVuZGVyaW5nQ29udGV4dC5wcm90b3R5cGUpO1xuXG4gICAgZm9yIChsZXQgcHJvcGVydHlfbmFtZSBpbiBkZXNjcmlwdG9ycylcbiAgICB7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yc1twcm9wZXJ0eV9uYW1lXVsnZ2V0J10gPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydHkgPSBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LnByb3RvdHlwZVtwcm9wZXJ0eV9uYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9mdW5jdGlvbiA9IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQucHJvdG90eXBlW3Byb3BlcnR5X25hbWVdO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0dXJuX3ZhbHVlID0gb3JpZ2luYWxfZnVuY3Rpb24uY2FsbCh0aGlzLCAuLi5hcmdzKSB8fCBudWxsO1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kX2xpc3QuYWRkKG9yaWdpbmFsX2Z1bmN0aW9uLCByZXR1cm5fdmFsdWUsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LnByb3RvdHlwZVtwcm9wZXJ0eV9uYW1lXSA9IHdyYXBwZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIENvbnRhaW5zIGV2ZXJ5IGNhbGxzIG1hZGUgdG8gYSBXZWJHTDIgY29udGV4dFxuY2xhc3MgQ29tbWFuZExpc3RcbntcbiAgICBjb21tYW5kcyA9IG5ldyBBcnJheSgpO1xuXG4gICAgYWRkKGZuLCByZXR1cm5fdmFsdWUsIC4uLmFyZ3MpXG4gICAge1xuICAgICAgICB0aGlzLmNvbW1hbmRzLnB1c2goe29yaWdpbmFsX2Z1bmN0aW9uOiBmbiwgcmV0dXJuX3ZhbHVlLCBhcmdzOiBbLi4uYXJnc119KTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jb21tYW5kc1t0aGlzLmNvbW1hbmRzLmxlbmd0aC0xXSk7XG4gICAgfVxufVxuXG4vLyBSZXBsYXkgdGhlIGNhbGxzIGZyb20gYSBjb21tYW5kIGxpc3RcbmZ1bmN0aW9uIHJlcGxheV9jb21tYW5kcyhjb21tYW5kX2xpc3QsIGdsLCBjYW52YXMpXG57XG4gICAgbGV0IHZhcmlhYmxlcyA9IG5ldyBNYXAoKTtcblxuICAgIGZvciAoY29uc3QgY29tbWFuZCBvZiBjb21tYW5kX2xpc3QuY29tbWFuZHMpXG4gICAge1xuICAgICAgICBjb25zdCBvcmlnaW5hbF9yZXR1cm5lZF92YWx1ZSA9IGNvbW1hbmQucmV0dXJuX3ZhbHVlO1xuICAgICAgICBsZXQgYXJncyA9IFsuLi5jb21tYW5kLmFyZ3NdO1xuXG4gICAgICAgIC8vIHJlcGxhY2UgdmFyaWFibGVzXG4gICAgICAgIGZvciAobGV0IGlfYXJndW1lbnQgaW4gYXJncylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHZhcmlhYmxlcy5oYXMoYXJnc1tpX2FyZ3VtZW50XSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYXJnc1tpX2FyZ3VtZW50XSA9IHZhcmlhYmxlcy5nZXQoYXJnc1tpX2FyZ3VtZW50XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmV0dXJuZWRfdmFsdWUgPSBjb21tYW5kLm9yaWdpbmFsX2Z1bmN0aW9uLmJpbmQoZ2wpKC4uLmFyZ3MpO1xuICAgICAgICBpZiAocmV0dXJuZWRfdmFsdWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhcmlhYmxlcy5zZXQob3JpZ2luYWxfcmV0dXJuZWRfdmFsdWUsIHJldHVybmVkX3ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbWFpbigpXG57XG4gICAgY29uc3QgY2xpZW50X2NhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbGllbnRfY2FudmFzJyk7XG4gICAgY29uc3Qgd2ViZG9jX2NhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3ZWJkb2NfY2FudmFzJyk7XG5cbiAgICBjb25zdCB3ZWJkb2NfZ2wgPSB3ZWJkb2NfY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicpO1xuICAgIGlmICh3ZWJkb2NfZ2wgPT09IG51bGwpIHtcbiAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMMi4gWW91ciBicm93c2VyIG9yIG1hY2hpbmUgbWF5IG5vdCBzdXBwb3J0IGl0LicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbWFuZF9saXN0ID0gbmV3IENvbW1hbmRMaXN0KCk7XG4gICAgc2V0dXBfaGFuZGxlcihjb21tYW5kX2xpc3QpO1xuXG4gICAgZHJhd190cmlhbmdsZShjbGllbnRfY2FudmFzKTtcblxuICAgIHJlcGxheV9jb21tYW5kcyhjb21tYW5kX2xpc3QsIHdlYmRvY19nbCwgd2ViZG9jX2NhbnZhcyk7XG5cbiAgICBib2IgPSAwO1xufVxuXG53aW5kb3cub25sb2FkID0gbWFpbjtcbiJdLCJzb3VyY2VSb290IjoiIn0=