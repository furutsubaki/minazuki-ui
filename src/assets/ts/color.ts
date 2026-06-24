const linearToSrgb = (channel: number) => {
    const clamped = Math.max(0, Math.min(1, channel));
    return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
};

// OKLab matrices（Björn Ottosson）。OKLCH -> linear sRGB
const oklchToLinearSrgb = (l: number, c: number, hDeg: number): [number, number, number] => {
    const h = (hDeg * Math.PI) / 180;
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const ll = l_ ** 3;
    const mm = m_ ** 3;
    const ss = s_ ** 3;

    return [
        4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss,
        -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss,
        -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss
    ];
};

const toHexByte = (channel: number) => Math.round(linearToSrgb(channel) * 255).toString(16).padStart(2, '0');

// sRGB ガモット外の値は toHexByte 内で 0-1 にクランプされる（簡易ガモットマッピング）
export const oklchToHex = (l: number, c: number, h: number): string => {
    const [r, g, b] = oklchToLinearSrgb(l, c, h);
    return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
};

export const oklchToHexAlpha = (l: number, c: number, h: number, alpha: number): string => {
    const alphaByte = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
        .toString(16)
        .padStart(2, '0');
    return `${oklchToHex(l, c, h)}${alphaByte}`;
};
