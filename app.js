// WebGL2 example code
function draw_triangle(canvas)
{
    const gl = canvas.getContext('webgl2');

    if (gl === null) {
        alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
        return;
    }

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
    gl.vertexAttribPointer(coord_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord_idx);

    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// Put a wrapper on every WebGL2 method
function setup_handler(command_list)
{
    let descriptors = Object.getOwnPropertyDescriptors(WebGL2RenderingContext.prototype);

    for (let property_name in descriptors)
    {
        if (descriptors[property_name]['get'] == undefined)
        {
            let property = WebGL2RenderingContext.prototype[property_name];
            if (typeof property == 'function')
            {
                const original_function = WebGL2RenderingContext.prototype[property_name];

                const wrapper = function(...args) {
                    const return_value = original_function.call(this, ...args) || null;
                    command_list.add(original_function, return_value, ...args);
                    return return_value;
                };

                WebGL2RenderingContext.prototype[property_name] = wrapper;
            }
        }
    }
}

// Contains every calls made to a WebGL2 context
class CommandList
{
    commands = new Array();

    add(fn, return_value, ...args)
    {
        this.commands.push({original_function: fn, return_value, arguments: [...args]});
        console.log(this.commands[this.commands.length-1]);
    }
}

// Replay the calls from a command list
function replay_commands(command_list, gl, canvas)
{
    return;

    for (const command of command_list.commands)
    {
        command.original_function(...command.arguments);
    }
}

function main()
{
    const client_canvas = document.querySelector('#client_canvas');
    const webdoc_canvas = document.querySelector('#webdoc_canvas');

    const webdoc_gl = webdoc_canvas.getContext('webgl2');
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
