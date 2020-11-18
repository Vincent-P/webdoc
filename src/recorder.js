// Contains every calls made to a WebGL2 context
export class CommandList
{
    commands = new Array();

    add(fn, return_value, ...args)
    {
        this.commands.push(
            {
                original_function: fn,
                name: fn.name,
                return_value,
                args: [...args]
            });
        // console.log(this.commands[this.commands.length-1]);
    }
}

// Put a wrapper on every function of a WebGL context
export function start_capture(gl, command_list)
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
export function stop_capture(gl)
{
    for (let property_name in gl)
    {
        let property = gl[property_name];
        if (typeof property == 'function')
        {
            gl[property_name] = Object.getPrototypeOf(gl)[property_name];
        }
    }
}
