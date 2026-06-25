import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const COMPONENT_ROOT = resolve(process.cwd(), 'src/components');
const LEGACY_TOKEN_PATTERN = /--color-(?:status|theme)-|--color-base-orange/g;
const FIXED_RGB_ALLOWLIST = new Set([
    'frame/Frame.vue:background: rgb(0 0 0 / 2%);',
    'frame/PictureFrame.vue:background: rgb(0 0 0 / 2%);'
]);

const collectVueFiles = (dir: string): string[] => {
    return readdirSync(dir).flatMap((entry) => {
        const path = resolve(dir, entry);
        if (statSync(path).isDirectory()) return collectVueFiles(path);
        return path.endsWith('.vue') ? [path] : [];
    });
};

const componentFiles = collectVueFiles(COMPONENT_ROOT);

const formatFindings = (findings: string[]) => findings.join('\n');

describe('component design token usage', () => {
    it('does not use legacy color aliases', () => {
        const findings = componentFiles.flatMap((file) => {
            const source = readFileSync(file, 'utf8');
            return [...source.matchAll(LEGACY_TOKEN_PATTERN)].map(
                (match) => `${relative(COMPONENT_ROOT, file)}:${match[0]}`
            );
        });

        expect(formatFindings(findings)).toBe('');
    });

    it('does not use important declarations', () => {
        const findings = componentFiles.flatMap((file) => {
            const source = readFileSync(file, 'utf8');
            return source.includes('!important') ? [relative(COMPONENT_ROOT, file)] : [];
        });

        expect(formatFindings(findings)).toBe('');
    });

    it('keeps fixed rgb values limited to intentional frame overlays', () => {
        const findings = componentFiles.flatMap((file) => {
            const source = readFileSync(file, 'utf8');
            return source
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => /\brgba?\(/.test(line))
                .map((line) => `${relative(COMPONENT_ROOT, file)}:${line}`)
                .filter((finding) => !FIXED_RGB_ALLOWLIST.has(finding));
        });

        expect(formatFindings(findings)).toBe('');
    });
});
