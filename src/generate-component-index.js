import fs from 'fs';
import path from 'path';

const normalizePath = (p) => p.replace(/\\/g, '/');
const getBaseName = (filePath) => path.basename(filePath, path.extname(filePath));

// --- components ---
const componentFilePaths = fs
    .readdirSync('./src/components', { recursive: true })
    .map((p) => normalizePath(p.toString()))
    .filter((p) => p.endsWith('.vue'))
    .sort();

let importContent = '';
let componentNameMapContent = '';
let exportContent = '';
let interfaceItemsContent = '';
let nuxtListContent = '';

componentFilePaths.forEach((filePath) => {
    const name = getBaseName(filePath);
    importContent += `import Mi${name} from '@/components/${filePath}';\n`;
    componentNameMapContent += `    Mi${name}: { name: 'Mi${name}' as const, component: Mi${name} },\n`;
    exportContent += `    Mi${name},\n`;
    interfaceItemsContent += `        Mi${name}: typeof Mi${name};\n`;
    nuxtListContent += `    { name: 'Mi${name}', export: 'Mi${name}', filePath: 'minazuki-ui' },\n`;
});

// src/components/index.ts
const componentsIndexContent = `${importContent}
export const componentNameMap = {
${componentNameMapContent}} as const;

export {
${exportContent}}

declare module 'vue' {
    interface GlobalComponents {
${interfaceItemsContent}    }
}
`;
fs.writeFileSync('./src/components/index.ts', componentsIndexContent);

// src/components/nuxt-map.ts
const nuxtMapContent = `// 自動生成ファイル。直接編集禁止。pnpm create-component-d で再生成
export const miComponentList = [
${nuxtListContent}] as const;
`;
fs.writeFileSync('./src/components/nuxt-map.ts', nuxtMapContent);

// --- composables ---
const composableFilePaths = fs
    .readdirSync('./src/composables')
    .map((p) => normalizePath(p.toString()))
    .filter((p) => p.endsWith('.ts') && p !== 'index.ts')
    .sort();

let composablesBarrel = '// 自動生成ファイル。直接編集禁止。pnpm create-component-d で再生成\n';
composableFilePaths.forEach((filePath) => {
    const name = path.basename(filePath, '.ts');
    composablesBarrel += `export { default as ${name} } from './${name}';\n`;
    composablesBarrel += `export * from './${name}';\n`;
});
fs.writeFileSync('./src/composables/index.ts', composablesBarrel);

// --- directives ---
const directiveFilePaths = fs
    .readdirSync('./src/directives')
    .map((p) => normalizePath(p.toString()))
    .filter((p) => p.endsWith('.ts') && p !== 'index.ts')
    .sort();

let directivesBarrel = '// 自動生成ファイル。直接編集禁止。pnpm create-component-d で再生成\n';
directiveFilePaths.forEach((filePath) => {
    const name = path.basename(filePath, '.ts');
    directivesBarrel += `export { default as ${name} } from './${name}';\n`;
    directivesBarrel += `export * from './${name}';\n`;
});
fs.writeFileSync('./src/directives/index.ts', directivesBarrel);

// --- src/nuxt/composable-map.ts ---
const composableNames = composableFilePaths.map((p) => path.basename(p, '.ts'));
const directiveNames = directiveFilePaths.map((p) => path.basename(p, '.ts'));

let composableMapContent = '// 自動生成ファイル。直接編集禁止。pnpm create-component-d で再生成\n';
composableMapContent += 'export const miComposableList = [\n';
[...composableNames, ...directiveNames].forEach((name) => {
    composableMapContent += `    { name: '${name}', from: 'minazuki-ui' },\n`;
});
composableMapContent += '] as const;\n';

if (!fs.existsSync('./src/nuxt')) {
    fs.mkdirSync('./src/nuxt', { recursive: true });
}
if (!fs.existsSync('./src/nuxt/runtime')) {
    fs.mkdirSync('./src/nuxt/runtime', { recursive: true });
}
fs.writeFileSync('./src/nuxt/composable-map.ts', composableMapContent);
