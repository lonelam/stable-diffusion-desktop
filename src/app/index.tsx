import * as React from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export interface IAppProps {}

export function App(props: IAppProps) {
    const {} = props;
    const itermRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!itermRef.current) {
            return;
        }
        const term = new Terminal();
        term.open(itermRef.current);
        window.electronAPI.onWebUILogs((_, l) => {
            term.write(l);
        });
        return () => {
            term.dispose();
        };
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
            <button onClick={cb}>{t('click_to_start')}</button>
            <a href="http://127.0.0.1:7860" target="_blank">
                {t('open_stable_diffusion')}
            </a>
            <div ref={itermRef}></div>
        </div>
    );
}
