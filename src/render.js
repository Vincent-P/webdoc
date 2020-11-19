import React  from "react";
import ReactDOM from "react-dom";

import 'bulma/css/bulma.css'

// Replay the calls from a command list
export function replay_commands(command_list, gl, limit=null)
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

// Display a command list, clicking on a command selects it
//  ({command.args.map((argument, index) => (`${index == 0 ? '' : ', '}${argument}`))})
const CommandListComponent = ({commands, selected, select_command}) => {
    return (<aside className="menu is-flex-basis-0 is-flex-1 overflow-auto is-size-7">
                <ol key="1" className="menu-list">
                    {commands.map((command, index) => (
                        <li
                            key={index}
                            className="is-family-monospace"
                        >
                            <a onClick={_ => select_command(index)} className={index == selected ? "is-active" : ""}>{command.original_function.name}()</a>
                        </li>
                    ))}
                </ol>
            </aside>
           );
};

const CommandArguments = ({command}) => {
    const prototypes = window.gl_functions_prototypes.get(command.name);
    if (!prototypes) {
        alert(`Unknown function ${command.name}.`);
    }

    if (prototypes.length > 1) {
        alert(`Multiple prototypes for ${command.name}.`);
    }

    const prototype = prototypes[0];

    let pretty_args = new Array();
    for (const i_arg in command.args)
    {
        const arg = command.args[i_arg];
        if (prototype.args[i_arg].type == "GLenum") {
            pretty_args.push(window.gl_enum_value_to_name.get(arg));
        }
        else {
            pretty_args.push(`${arg}`);
        }

    }

    return [
        <div key="1" className="table-container">
            <table className="table is-fullwidth is-narrow">
                <thead>
                    <tr>
                        <th>Arguments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {pretty_args.map((arg, index) => (
                        <tr key={index} className="is-size-7">
                            <td>{`${prototype.args[index].name}`}</td>
                            <td>{`${arg}`}</td>
                        </tr>
                    ))}
                </tbody>
          </table>
        </div>
    ];
}

// Canvas where the commands get replayed
class CanvasComponent extends React.Component {
    gl_context = null;

    constructor(props) {
        super(props);
        this.canvas_ref = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvas_ref.current;
        if (canvas)
        {
            this.gl_context = canvas.getContext('webgl2', {preserveDrawingBuffer: false});

            // re-render once the gl context has been created
            // because componentDidMount() gets called after render()
            this.forceUpdate();
        }
    }

    componentWillUnmount() {

    }

    render() {
        const { command_list, selected } = this.props;
        console.log(command_list);

        if (this.gl_context) {
            replay_commands(command_list, this.gl_context, selected || null);
        }

        return (
            <canvas ref={this.canvas_ref} className="replay-canvas is-flex-1" id={this.props.id} width={command_list.canvas_size.x} height={command_list.canvas_size.y}></canvas>
        );
    }
}


// Main component
class WebdocComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {selected: null};
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    select_command = (index) => {
        this.setState(state => ({
            selected: index
        }));
    };

    render() {
        const {command_list} = this.props;

        return [
            <header key="0" className="level">
                <div className="level-left">
                    <div className="level-item">
                        <h1 className="title is-5">
                            Webdoc
                        </h1>
                    </div>                </div>
                <div className="level-right">
                    <p className="level-item"><a download="capture" href={`data:application/json,${JSON.stringify(command_list)}`}>Download capture</a></p>
                </div>
            </header>,
            <div key="1" className="columns is-fullheight is-flex-1 m-0">
                <div className="column">
                    <h2 key="0" className="title is-5">Command list</h2>
                    <CommandListComponent
                        commands={command_list.commands}
                        selected={this.state.selected}
                        select_command={this.select_command}/>
                    {this.state.selected ? <CommandArguments command={command_list.commands[this.state.selected]} /> : null}
                </div>
                <div className="column is-flex-3">
                    <h2 className="title is-5">Replay</h2>
                    <CanvasComponent id="webdoc_canvas" command_list={command_list} selected={this.state.selected}/>
                </div>
            </div>
        ];
    }
}

function get_webdoc_root() {
    let root = document.getElementById('webdoc_react_root');
    if (!root)
    {
        root = document.createElement('div');
        root.id = 'webdoc_react_root';
        root.className = 'fullscreen';
        document.body.append(root);
    }
    return root;
};

export function display_ui(command_list) {
    document.body.className = "no-scroll";
    ReactDOM.render(<WebdocComponent command_list={command_list} />, get_webdoc_root());
};

export function hide_ui() {
    document.body.className = null;
    ReactDOM.unmountComponentAtNode(get_webdoc_root());
}
