import React  from "react";
import ReactDOM from "react-dom";

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

// Display a single command (used in the command list)
const CommandComponent = ({command}) => (
    <div>
        {command.original_function.name}({command.args.map((argument, index) => (`${index == 0 ? '' : ', '}${argument}`))})
    </div>
);

// Display a command list, clicking on a command selects it
const CommandListComponent = ({commands, selected, select_command}) => {
    return (<div>
                <h3>Command List</h3>
                <ol>
                    {commands.map((command, index) => (
                        <li
                            key={index}
                            onClick={_ => select_command(index)}
                            className={index == selected ? "selected" : ""}
                        >
                            <CommandComponent command={command}/>
                        </li>
                    ))}
                </ol>
            </div>);
};

// Canvas where the commands get replayed
class CanvasComponent extends React.Component {
    gl_context = null;

    constructor(props) {
        super(props);
        this.canvas_ref = React.createRef();
    }

    componentDidMount() {
        console.log("Creating gl context");
        const canvas = this.canvas_ref.current;
        this.gl_context = canvas.getContext('webgl2', {preserveDrawingBuffer: false});
        console.log(this.gl_context, canvas);

        // re-render once the gl context has been created
        // because componentDidMount() gets called after render()
        this.forceUpdate();
    }

    componentWillUnmount() {

    }

    render() {
        const { command_list, selected } = this.props;

        if (this.gl_context) {
            replay_commands(command_list, this.gl_context, selected || null);
        }

        return (
            <div>
                <canvas ref={this.canvas_ref} id={this.props.id} width="640" height="480"></canvas>
            </div>
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
        console.log("select command", index);
        this.setState(state => ({
            selected: index
        }));
    };

    render() {
        const {command_list} = this.props;

        return (
            <div className="fullscreen">
                <h1>Webdoc</h1>

                <h2>Replay</h2>
                <CanvasComponent id="webdoc_canvas" command_list={command_list} selected={this.state.selected}/>

                <p><a download="command_list" href={`data:application/json,${JSON.stringify(command_list)}`}>Download</a></p>
                <CommandListComponent
                    commands={command_list.commands}
                    selected={this.state.selected}
                    select_command={this.select_command}/>
            </div>
        );
    }
}

function get_webdoc_root() {
    let root = document.getElementById('webdoc_react_root');
    if (!root)
    {
        root = document.createElement('div');
        root.id = 'webdoc_react_root';
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
