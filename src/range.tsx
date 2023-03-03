export type RangeProps = {
  min?: number;
  max?: number;
  value: number;
  step?: number;
  onChange: (newValue: number) => void;
  label?: string;
  class?: string;
};

export function Range(props: RangeProps) {
  function getWidthPercent() {
    const min = () => props.min ?? 0;
    const max = () => props.max ?? 0;
    let widthPercent = ((props.value - min()) / (max() - min())) * 100;
    if (widthPercent < 0) {
      widthPercent = 0;
    } else if (widthPercent > 100) {
      widthPercent = 100;
    }

    return widthPercent;
  }

  return (
    <div class="mec-range">
      <div>Internal value : {props.value}</div>
      <label class={'mec-range__slider'}>
        <input
          type="range"
          min={props.min ?? 0}
          max={props.max ?? 100}
          value={props.value}
          step={props.step ?? 1}
          class="hidden"
          onInput={(e) => props.onChange(e.currentTarget.valueAsNumber)}
        />

        <div
          class="mec-range__slider__fill"
          style={`zIndex: 50; width: ${getWidthPercent()}%,`}
        />
      </label>
    </div>
  );
}
