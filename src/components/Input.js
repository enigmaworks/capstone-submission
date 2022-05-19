export default function ColorInput(props) {
  return (
    <>
      <input
        type="range"
        value={props.value}
        min={props.range[0]}
        max={props.range[1]}
        onChange={(e) => {
          props.updateValue(parseInt(e.target.value));
        }}
      />
    </>
  );
}
