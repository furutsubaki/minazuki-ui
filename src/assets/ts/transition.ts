const CSS_TIME_PATTERN = /^(-?\d+(?:\.\d+)?|-?\.\d+)(ms|s)$/i;

const parseCssTime = (raw: string): number => {
    const match = CSS_TIME_PATTERN.exec(raw.trim());
    if (!match) return 0;
    const value = parseFloat(match[1]);
    if (!Number.isFinite(value)) return 0;
    return match[2].toLowerCase() === 'ms' ? value : value * 1000;
};

const parseCssTimeList = (raw: string): number[] => raw.split(',').map(parseCssTime);

/**
 * 対象要素に実際に適用されているtransition-duration + transition-delayの最大値をミリ秒で返す。
 * `--duration-fast`のテキスト解析ではなく計算済みスタイルから読むため、calc()や消費者側の
 * カスタムプロパティ上書きがあっても実際のCSSトランジションと同期する。
 * (SSR時・要素未取得時は200msにフォールバック。transition未設定時は0を返す)
 */
export const getTransitionDuration = (el: Element | null | undefined): number => {
    if (typeof document === 'undefined' || !el) return 200;
    const style = getComputedStyle(el);
    const durations = parseCssTimeList(style.transitionDuration);
    const delays = parseCssTimeList(style.transitionDelay);
    const count = Math.max(durations.length, delays.length);
    let max = 0;
    for (let i = 0; i < count; i++) {
        max = Math.max(max, (durations[i % durations.length] ?? 0) + (delays[i % delays.length] ?? 0));
    }
    return max;
};
