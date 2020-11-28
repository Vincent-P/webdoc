import { CommandList, start_capture, stop_capture } from './recorder.js';
import { display_ui, hide_ui } from './render.js';
import { parse } from 'webidl2';
import { webgl1idl_string, webgl2idl_string } from './webgl2idl.js';
import './style.scss';

function add_enum_or_function(members)
{
    for (const member of members)
    {
        // enum
        if (member.type == "const")
        {
            if (member.value.type != "number") {
                alert("const that is not a number!");
            }

            if (window.gl_enum_value_to_name.has(member.name)) {
                alert("duplicate enum");
            }

            window.gl_enum_value_to_name.set(parseInt(member.value.value), member.name);
        }
        // function
        else if (member.type == "operation")
        {
            let prototype = {args: new Array()};
            for (const arg of member.arguments)
            {
                if (!arg.idlType.idlType) {
                    alert("no type for argument");
                }
                prototype.args.push({
                    type: arg.idlType.idlType,
                    name: arg.name,
                    optional: arg.optional
                });
            }

            let prototypes = null;
            if (window.gl_functions_prototypes.has(member.name))
            {
                prototypes = window.gl_functions_prototypes.get(member.name);
            }
            else
            {
                prototypes = new Array();
            }

            prototypes.push(prototype);
            window.gl_functions_prototypes.set(member.name, prototypes);
        }
    }
}

export class WebDoc
{
    command_list = new CommandList();

    init = () => {

        const webgl1_tree = parse(webgl1idl_string);
        const webgl2_tree = parse(webgl2idl_string);

        window.gl_enum_value_to_name = new Map();
        window.gl_functions_prototypes = new Map();

        for (const node of webgl1_tree) {
            if (node.name == "WebGLRenderingContextBase") {
                add_enum_or_function(node.members);
            }
        }

        for (const node of webgl2_tree) {
            if (node.name == "WebGL2RenderingContextBase" || node.name == "WebGL2RenderingContextOverloads") {
                add_enum_or_function(node.members);
            }
        }

        console.log(`Found ${window.gl_enum_value_to_name.size} enums.`);
        console.log(`Found ${window.gl_functions_prototypes.size} functions.`);

    };

    start_capture = (gl_context) => {
        start_capture(gl_context, this.command_list);
    };

    stop_capture = (gl_context) => {
        stop_capture(gl_context);
    };

    display_ui = () => {
        console.log("Displaying command list", this.command_list);
        display_ui(this.command_list);
    }

    hide_ui = () => {
        hide_ui();
    }
}
