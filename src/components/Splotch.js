import styles from "./Splotch.module.css";

export default function Splotch(props) {
  //modified algorithm from: https://www.w3.org/TR/css-color-3/#numerical
  function convertToRGB(hsl) {
    var h = hsl[0];
    var s = hsl[1];
    var l = hsl[2];

    h = h % 360;
    if (h < 0) {
      h += 360;
    }
    s /= 100;
    l /= 100;

    function f(n) {
      var k = (n + h / 30) % 12;
      var a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }

    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }

  function convertToHex(hsl) {
    const rgb = convertToRGB(hsl);
    function convertDigitToHex(digit) {
      let rounded = Math.round(digit);
      rounded = rounded.toString(16);
      if (rounded.length < 2) {
        rounded = "0" + rounded;
      }
      return rounded;
    }
    return "" + convertDigitToHex(rgb[0]) + convertDigitToHex(rgb[1]) + convertDigitToHex(rgb[2]);
  }

  return (
    <div
      className={styles.splotch}
      style={{
        backgroundColor: `hsl(${props.color[0]},${props.color[1]}%,${props.color[2]}%)`,
        color: props.color[2] < 45 ? "white" : "black",
      }}
    >
      <span className={styles.hex}>{convertToHex(props.color).toLocaleUpperCase()}</span>
      <span className={styles.hsl}>
        {`hsl(${props.color[0]},${props.color[1]}%,${props.color[2]}%)`}
      </span>
    </div>
  );
}
