function draw_triangle(gl, canvas)
{
    let vertices = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0,
    ];

    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indices = [0,1,2];
    let index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    /*================ Shaders ====================*/

    let vertex_code =
    `
        attribute vec3 coordinates;
        void main(void)
        {
            gl_Position = vec4(coordinates, 1.0);
        }
    `;
    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vertex_code);
    gl.compileShader(vertex_shader);

    let fragment_code =
    `
        void main(void) {
            gl_FragColor = vec4(gl_FragCoord.rgb, 0.1);
        }
    `;

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

    // Point an attribute to the currently bound VBO
    // index, size, type, normalized, stride, offset
    gl.vertexAttribPointer(coord_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord_idx);


    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function wrap_function(p, fn)
{
    const original = p[fn];
    p[fn] = function(...args) {
        console.log(fn, args);
        return original.call(this, ...args);
    };
}

function wrap_prototype(p, fn)
{
    wrap_function(p.prototype, fn);
}

function setup_handler()
{
    let descriptors = Object.getOwnPropertyDescriptors(WebGL2RenderingContext.prototype);

    // console.log(properties);
    // console.log(descriptors);

    for (let property_name in descriptors)
    {
        if (descriptors[property_name]['get'] == undefined)
        {
            let property = WebGL2RenderingContext.prototype[property_name];
            // console.log(property_name, property);
            if (typeof property == 'function')
            {
                wrap_prototype(WebGL2RenderingContext, property_name);
            }
        }
    }
}

function main()
{
    const canvas = document.querySelector('#gl_canvas');

    // Initialize the GL context
    const gl = canvas.getContext('webgl2');

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
        return;
    }
    setup_handler();
    draw_triangle(gl, canvas);
}

window.onload = main;
