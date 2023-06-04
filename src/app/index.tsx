import * as React from 'react';

export interface IAppProps {}

export function App(props: IAppProps) {
    const {} = props;
    const [logs, setLogs] = React.useState('');
    React.useEffect(() => {
        window.electronAPI.onWebUILogs((_, l) => {
            setLogs((v) => `${v}\n${l}`);
        });
    }, []);
    const cb = async () => {
        await window.electronAPI.updateWebUI(
            'https://github.com/lshqqytiger/stable-diffusion-webui-directml'
        );
        await window.electronAPI.startWebUIService({
            vram: 'lowvram',
        });
    };
    return (
        <div>
            <button onClick={cb}>click me</button>
            <div>{logs}</div>
        </div>
    );
}
