import { CommandList, start_capture, stop_capture } from './recorder.js';
import { display_ui, hide_ui } from './render.js';

// WebGL2 example code
function draw_triangle(gl, canvas)
{
    let vertices = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0,
    ];

    let indices = [0,1,2];

    let vertex_code =
        `
        attribute vec3 coordinates;
        void main(void)
        {
            gl_Position = vec4(coordinates, 1.0);
        }
    `;


    let fragment_code =
        `
        void main(void) {
            gl_FragColor = vec4(gl_FragCoord.rgb, 1.0);
        }
    `;


    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vertex_code);
    gl.compileShader(vertex_shader);

    let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, fragment_code);
    gl.compileShader(fragment_shader);

    let program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

    let coord_idx = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coord_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord_idx);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

/*
  function inspector_draw(inspector)
  {
  const {canvas, ctx, source} = inspector;

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.restore();

  ctx.drawImage(source, 0, 0);
  }

  function inspector_wheel(inspector, event)
  {
  event.preventDefault();
  const delta = -event.deltaY;

  if (delta)
  {
  const pt = inspector.ctx.transform_point(inspector.mouse.x, inspector.mouse.y);
  inspector.ctx.translate(pt.x, pt.y);
  const factor = Math.pow(1.1, delta);
  inspector.ctx.scale(factor, factor);
  inspector.ctx.translate(-pt.x, -pt.y);

  inspector_draw(inspector)
  }
  }

  function inspector_mousedown(inspector, event)
  {
  event.preventDefault();

  inspector.pressed = true;

  inspector.start = inspector.ctx.transform_point(event.offsetX, event.offsetY);
  }

  function inspector_mouseup(inspector, event)
  {
  event.preventDefault();

  inspector.pressed = false;
  }

  function inspector_mousemove(inspector, event)
  {
  event.preventDefault();

  inspector.mouse = inspector.ctx.transform_point(event.offsetX, event.offsetY);

  if (inspector.pressed)
  {
  const dx = inspector.mouse.x - inspector.start.x;
  const dy = inspector.mouse.y - inspector.start.y;
  inspector.ctx.translate(dx, dy);

  inspector_draw(inspector);
  }
  }
*/


function main()
{
    /// --- Setup
    const client_canvas = document.querySelector('#client_canvas');

    const client_gl = client_canvas.getContext('webgl2');
    if (client_gl == null) {
        alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
        return;
    }

    /*
      const inspector_canvas = document.querySelector('#webdoc_inspector_canvas');
      const inspector = {
      canvas: inspector_canvas,
      ctx: inspector_canvas.getContext('2d'),
      source: webdoc_canvas,
      scale: 1.0,
      old_scale: 1.0,
      offset_x: 0,
      offset_y: 0,
      pan_x: 0,
      pan_y: 0,
      start: {x: 0, y: 0},
      mouse: {x: 0, y: 0},
      pressed: false,
      };
      track_transforms(inspector.ctx);
      inspector.ctx.imageSmoothingEnabled = false; // disable interpolation when zooming

      inspector_canvas.addEventListener('wheel', event => inspector_wheel(inspector, event));
      inspector_canvas.addEventListener('mouseup', event => inspector_mouseup(inspector, event));
      inspector_canvas.addEventListener('mousedown', event => inspector_mousedown(inspector, event));
      inspector_canvas.addEventListener('mousemove', event => inspector_mousemove(inspector, event));

      inspector_draw(inspector);
    */

    let command_list = new CommandList();
    start_capture(client_gl, command_list);

    draw_triangle(client_gl, client_canvas);

    stop_capture(client_gl);
    display_ui(command_list);
}


// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transform_point(x,y) - returns an SVGPoint
/*
  function track_transforms(ctx)
  {
  const svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  let xform = svg.createSVGMatrix();

  ctx.getTransform = function() { return xform; };

  const savedTransforms = [];
  const save = ctx.save;
  ctx.save = _ =>  {
  savedTransforms.push(xform.translate(0,0));
  return save.call(ctx);
  };

  const restore = ctx.restore;
  ctx.restore = _ => {
  xform = savedTransforms.pop();
  return restore.call(ctx);
  };

  const scale = ctx.scale;
  ctx.scale = (sx,sy) => {
  xform = xform.scaleNonUniform(sx,sy);
  return scale.call(ctx, sx, sy);
  };

  const rotate = ctx.rotate;
  ctx.rotate = (radians) => {
  xform = xform.rotate(radians*180/Math.PI);
  return rotate.call(ctx, radians);
  };

  const translate = ctx.translate;
  ctx.translate = (dx,dy) => {
  xform = xform.translate(dx,dy);
  return translate.call(ctx,dx,dy);
  };

  const transform = ctx.transform;
  ctx.transform = (a, b, c, d, e, f) => {
  const m2 = svg.createSVGMatrix();
  m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
  xform = xform.multiply(m2);
  return transform.call(ctx, a, b, c, d, e, f);
  };

  const setTransform = ctx.setTransform;
  ctx.setTransform = (a, b, c, d, e, f) => {
  xform.a = a;
  xform.b = b;
  xform.c = c;
  xform.d = d;
  xform.e = e;
  xform.f = f;
  return setTransform.call(ctx, a, b, c, d, e, f);
  };

  const pt  = svg.createSVGPoint();
  ctx.transform_point = (x,y) => {
  pt.x=x; pt.y=y;
  return pt.matrixTransform(xform.inverse());
  }
  }
*/

window.onload = main;
