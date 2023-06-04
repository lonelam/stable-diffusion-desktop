import { getGitPath, initRepo } from './git';

jest.mock('electron');
describe('git operation', () => {
    it('git path', () => {
        expect(getGitPath()).toBe('appGit\\bin\\git.exe');
    });
    it('git clone', async () => {
        await initRepo('chatgpt', 'https://github.com/lonelam/EdgeGPTJs.git');
    });
});
