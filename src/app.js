import React, { useState } from "react";
import ReactDOM from "react-dom";

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
            gl_FragColor = vec4(gl_FragCoord.rgb, 0.1);
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

    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// Contains every calls made to a WebGL2 context
class CommandList
{
    commands = new Array();

    add(fn, return_value, ...args)
    {
        this.commands.push({original_function: fn, return_value, args: [...args]});
        // console.log(this.commands[this.commands.length-1]);
    }
}

// Replay the calls from a command list
function replay_commands(command_list, gl, canvas, limit=null)
{
    let variables = new Map();

    // clear framebuffer before replaying commands
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const i_command in command_list.commands)
    {
        if (limit != null && i_command > limit)
        {
            break;
        }

        const command = command_list.commands[i_command];
        const original_returned_value = command.return_value;
        let args = [...command.args];

        // replace variables
        for (let i_argument in args)
        {
            if (variables.has(args[i_argument]))
            {
                args[i_argument] = variables.get(args[i_argument]);
            }
        }

        let returned_value = command.original_function.bind(gl)(...args);
        if (returned_value)
        {
            variables.set(original_returned_value, returned_value);
        }
    }
}


// Put a wrapper on every function of a WebGL context
function start_capture(gl, command_list)
{
    for (let property_name in gl)
    {
        let property = gl[property_name];
        if (typeof property == 'function')
        {
            const original_function = gl[property_name];

            const wrapper = function(...args) {
                const return_value = original_function.call(this, ...args) || null;
                command_list.add(original_function, return_value, ...args);
                return return_value;
            };

            gl[property_name] = wrapper;
        }
    }
}

// Restore the functions of a WebGL context
function stop_capture(gl)
{
    for (let property_name in gl)
    {
        let property = gl[property_name];
        if (typeof property == 'function')
        {
            const original_function = gl[property_name];

            const wrapper = function(...args) {
                const return_value = original_function.call(this, ...args) || null;
                command_list.add(original_function, return_value, ...args);
                return return_value;
            };

            gl[property_name] = Object.getPrototypeOf(gl)[property_name];
        }
    }
}

function main()
{
    const client_canvas = document.querySelector('#client_canvas');
    const webdoc_canvas = document.querySelector('#webdoc_canvas');

    const webdoc_gl = webdoc_canvas.getContext('webgl2');
    const client_gl = client_canvas.getContext('webgl2');
    if (client_gl == null || webdoc_gl == null) {
        alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
        return;
    }

    let command_list = new CommandList();
    start_capture(client_gl, command_list);
    draw_triangle(client_gl, client_canvas);
    stop_capture(client_gl);

    const CommandComponent = ({command}) => (
        <div>{command.original_function.name}({command.args.map((argument, index) => (`${index == 0 ? '' : ', '}${argument}`))})</div>
    );

    const CommandListComponent = ({commands}) => {
        const [selected, set_selected] = useState(null);
        const update = index => {
            set_selected(index);
            replay_commands(command_list, webdoc_gl, webdoc_canvas, index);
        };

        return (<div>
                    <h3>Command List</h3>
                    <ol>
                        {commands.map((command, index) => (
                            <li
                                key={index}
                                onClick={_ => update(index)}
                                className={index == selected ? "selected" : ""}
                            >
                                <CommandComponent command={command}/>
                            </li>
                        ))}
                    </ol>
                </div>)
    };

    const react_root = document.getElementById('webdoc_react_root');
    if (react_root)
    {
        ReactDOM.render(<CommandListComponent commands={command_list.commands} />, react_root);
    }
}

window.onload = main;
