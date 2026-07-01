export const HUE_NAMES = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'teal',
    'blue',
    'indigo',
    'purple',
    'pink'
] as const;
export type HueName = (typeof HUE_NAMES)[number];

export const COLOR_STEPS = [100, 200, 300, 400, 500, 600, 700] as const;
export type ColorStep = (typeof COLOR_STEPS)[number];

export const NEUTRAL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type NeutralStep = (typeof NEUTRAL_STEPS)[number];

export const STATUS_NAMES = ['brand', 'info', 'success', 'warning', 'danger'] as const;
export type StatusName = (typeof STATUS_NAMES)[number];

export const SEMANTIC_SUFFIXES = ['surface', 'subtle', 'muted', 'emphasis', 'strong', 'alpha'] as const;
export type SemanticSuffix = (typeof SEMANTIC_SUFFIXES)[number];

export interface HueDefinition {
    hue: number;
    chroma: number;
    lightnessOffset?: number;
}

export interface StatusDefinition {
    hue: HueName;
    chroma: HueName;
    lightnessOffset: number;
}

export const LIGHTNESS_SCALE: Record<ColorStep, number> = {
    100: 0.96,
    200: 0.88,
    300: 0.76,
    400: 0.70,
    500: 0.55,
    600: 0.45,
    700: 0.35
};

export const CHROMA_SCALE: Record<ColorStep, number> = {
    100: 0.15,
    200: 0.40,
    300: 0.78,
    400: 1.0,
    500: 0.78,
    600: 0.40,
    700: 0.15
};

export const NEUTRAL_LIGHTNESS: Record<NeutralStep, number> = {
    50: 0.985,
    100: 0.95,
    200: 0.90,
    300: 0.82,
    400: 0.70,
    500: 0.55,
    600: 0.40,
    700: 0.30,
    800: 0.22,
    900: 0.15
};

export const DEFAULT_HUES: Record<HueName, HueDefinition> = {
    red: { hue: 20, chroma: 0.22, lightnessOffset: -0.10 },
    orange: { hue: 50, chroma: 0.16 },
    yellow: { hue: 85, chroma: 0.17, lightnessOffset: 0.14 },
    lime: { hue: 135, chroma: 0.15 },
    green: { hue: 155, chroma: 0.14 },
    teal: { hue: 180, chroma: 0.10 },
    blue: { hue: 250, chroma: 0.15 },
    indigo: { hue: 270, chroma: 0.12 },
    purple: { hue: 310, chroma: 0.13 },
    pink: { hue: 357, chroma: 0.16 }
};

export const DEFAULT_STATUSES: Record<StatusName, StatusDefinition> = {
    brand: { hue: 'teal', chroma: 'teal', lightnessOffset: 0 },
    info: { hue: 'blue', chroma: 'blue', lightnessOffset: 0 },
    success: { hue: 'green', chroma: 'green', lightnessOffset: 0 },
    warning: { hue: 'yellow', chroma: 'yellow', lightnessOffset: 0.15 },
    danger: { hue: 'red', chroma: 'red', lightnessOffset: 0 }
};

export const SEMANTIC_STEP_MAP: Record<SemanticSuffix, ColorStep> = {
    surface: 100,
    subtle: 200,
    muted: 300,
    emphasis: 500,
    strong: 600,
    alpha: 400
};

// --- OKLCH → sRGB conversion ---

function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    return [
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ];
}

function linearToSrgb(c: number): number {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function clamp01(v: number): number {
    return Math.max(0, Math.min(1, v));
}

export function oklchToHex(L: number, C: number, H: number): string {
    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);
    const [lr, lg, lb] = oklabToLinearSrgb(L, a, b);
    const r = Math.round(clamp01(linearToSrgb(lr)) * 255);
    const g = Math.round(clamp01(linearToSrgb(lg)) * 255);
    const bv = Math.round(clamp01(linearToSrgb(lb)) * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bv.toString(16).padStart(2, '0')}`;
}

export function oklchToOklchString(L: number, C: number, H: number, alpha?: number): string {
    const base = `oklch(${L} ${C} ${H})`;
    if (alpha !== undefined && alpha < 1) {
        return `oklch(${L} ${C} ${H} / ${Math.round(alpha * 100)}%)`;
    }
    return base;
}

export function computePrimitiveColor(
    hueDef: HueDefinition,
    step: ColorStep
): { hex: string; oklch: string; L: number; C: number; H: number } {
    const baseL = LIGHTNESS_SCALE[step];
    const scaledOffset = (hueDef.lightnessOffset ?? 0) * (baseL / LIGHTNESS_SCALE[400]);
    const L = Math.min(1, Math.max(0, baseL + scaledOffset));
    const C = hueDef.chroma * CHROMA_SCALE[step];
    const H = hueDef.hue;
    return {
        hex: oklchToHex(L, C, H),
        oklch: oklchToOklchString(L, C, H),
        L,
        C,
        H
    };
}

export function computeNeutralColor(
    step: NeutralStep,
    neutralHue?: number
): { hex: string; oklch: string; L: number } {
    const L = NEUTRAL_LIGHTNESS[step];
    const C = 0;
    const H = neutralHue ?? 0;
    return {
        hex: oklchToHex(L, C, H),
        oklch: oklchToOklchString(L, C, H),
        L
    };
}

export function computeStatusColor(
    statusDef: StatusDefinition,
    hues: Record<HueName, HueDefinition>,
    step: ColorStep
): { hex: string; oklch: string; L: number; C: number; H: number } {
    const hueDef = hues[statusDef.hue];
    const chromaDef = hues[statusDef.chroma];
    const baseL = LIGHTNESS_SCALE[step];
    const L = Math.min(1, Math.max(0, baseL + statusDef.lightnessOffset));
    const C = chromaDef.chroma * CHROMA_SCALE[step];
    const H = hueDef.hue;
    return {
        hex: oklchToHex(L, C, H),
        oklch: oklchToOklchString(L, C, H),
        L,
        C,
        H
    };
}
