import Input from "./components/Input";
import Splotch from "./components/Splotch";
import { useEffect, useState } from "react";
import styles from "./App.module.css";

export default function App() {
	// *** VARIABLES & STATE *** //
	const [output, setOutput] = useState([]); // initialize the list to hold the calculated colors and create the function to update its value
	// this list will hold a number three-value arrays representing HSL colors
	const analgousStep = 30; //the number specifying how far apart on the color wheel analogous colors should be
	const tintshadeStep = 4; //the number specifying how much saturation and lightness should increase or decrease for tints and shades
	const [hue, setHue] = useState(153); // initialize the variable to hold the selected hue and create the function to update its value
	const [saturation, setSaturation] = useState(65); // initialize the variable to hold the selected saturation and create the function to update its value
	const [lightness, setLightness] = useState(70); // initialize the variable to hold the selected lightness and create the function to update its value

	// *** Update Functions *** //
	// event handlers are built into react, so these are fired by react's event handlers
	const updateHue = (value) => {
		setHue(parseInt(value)); // update the stored hue with the newly inputted value
		setOutput([]); // clear the previously generated array of colors (they do not reflect this new color)
	};

	const updateSaturation = (value) => {
		setSaturation(parseInt(value)); // update the stored saturation with the newly inputted value
		setOutput([]); // clear the previously generated array of colors
	};

	const updateLightness = (value) => {
		setLightness(parseInt(value)); // update the stored lightness with the newly inputted value
		setOutput([]); // clear the previously generated  colors
	};

	function testUpdateFunctions() {
		console.log("%cTESTING UPDATE FUNCTIONS", "color: blue;padding: 1rem;");
		console.log(
			`before test: hue is ${hue}, saturation is ${saturation}, lightness is ${lightness} `
		);
		console.log(`updating values to: hue 215, saturation 31, lightness 51`);
		updateHue("215");
		updateSaturation("31");
		updateLightness("51");
		console.log(
			"UI should reflect these changes-- this code is run on one render, but the changes will not be visible until the next, which they trigger"
		);
	}

	// *** Calculation Functions *** //
	/* wrapValueToRange takes two parementers
			range, an array containing two integer values, the minumum and maximum value of a range
			value, an integer
		the function returns an integer, representing the "wrapped" value of the input to fit within that range,
		all values are contained within the upper portion of the range via the mod operator, and any value below the minumum is subracted from the maximum
		*/
	const wrapValueToRange = (range, value) => {
		let newValue = value % range[1]; // ensures that the inputed value is not larger than the maximum balue
		newValue =
			newValue < range[0] ? range[1] - Math.abs(newValue) : Math.abs(newValue); // if the number is too small, "wrap" it around to the top
		return newValue;
	};

	// find the value of the hue directly opposiste on color wheel from the current input hue by moving 180 degrees around it
	const calculateComplement = () => {
		let newHue = wrapValueToRange([0, 360], hue + 180);
		setOutput([[newHue, saturation, lightness]]); // set the ouput list to contain a single value with this new complementary color
		return [newHue, saturation, lightness]; //return values for debug
	};

	// calculate five tints of the input color by incrementaly decreasing the saturation and increasing the lightness
	const calculateTints = () => {
		const result = []; // initialize a temporary list to hold the calculated values
		for (let i = 1; i <= 5; i++) {
			let newSat = saturation - tintshadeStep * i;
			if (newSat < 0) {
				newSat = 0;
			}
			let newLight = lightness + tintshadeStep * i;
			if (newLight > 100) {
				newLight = 100;
			}
			result.push([hue, newSat, newLight]); // add the new tint to the temporary result list
		}
		setOutput(result); // update the  ouput list to contain these new values.
		return result; //return values for debug
	};

	// calculate five shades of the input color by incrementaly decreasing the saturation and lightness
	const calculateShades = () => {
		const result = []; // initialize a temporary list to hold the calculated values
		for (let i = 1; i <= 5; i++) {
			let newSat =
				saturation - tintshadeStep * i < 0 ? 0 : saturation - tintshadeStep * i;
			let newLight =
				lightness - tintshadeStep * i < 0 ? 0 : lightness - tintshadeStep * i;
			result.push([hue, newSat, newLight]); // add the new tint to the temporary  list
		}
		setOutput(result); // update the  ouput list to contain these new values.
		return result; //return values for debug
	};

	// calculate three analgous colors to the input color by moving around the color wheel a set distance three times
	const calculateAnalgous = () => {
		let result = []; // initialize a temporary list to hold the calculated values
		for (let i = 1; i <= 3; i++) {
			let newHue = wrapValueToRange([0, 360], hue + analgousStep * i);
			result.push([newHue, saturation, lightness]);
		}
		setOutput(result); // update the  ouput list to contain the new values
		return result; //return values for debug
	};

	/* prettier-ignore */ // tell my code formatter to ignore this function
	function testCalculationFunctions() {
		console.log(
			"%cTESTING CALCULATION FUNCTIONS",
			"color: blue;padding: 1rem;"
		);
		console.log(
			"testing wrapping a value to fit range"
		)
		console.log(
			 "range 0-100",
			`\n input 50, output ${wrapValueToRange( [0, 100], 50 )}, expected value 50`,
			`\n input 130, output ${wrapValueToRange([0, 100], 130)}, expected value 30`,
			`\n input -48, output ${wrapValueToRange([0, 100], -48 )}, expected value 52`
		);
		console.log(
			"testing complement function",
			`\nhue is ${hue}, saturation is ${saturation}, lightness is ${lightness}`,
			`\noutput is ${calculateComplement()}`
		);
		console.log(
			"testing tints & shades functions",
			`\nhue is ${hue}, saturation is ${saturation}, lightness is ${lightness}`,
			`\ntints output is ${JSON.stringify(calculateTints())}`,
			`\nshades output is ${JSON.stringify(calculateShades())}`
		);
		console.log(
			"testing analgous colors function",
			`hue is ${hue}, saturation is ${saturation}, lightness is ${lightness}`,
			`output is ${JSON.stringify(calculateAnalgous())}`
		);
	}

	//run the test function on only the first render of the component
	useEffect(() => {
		testUpdateFunctions();
		testCalculationFunctions();
		setOutput([]);
	}, []);

	// *** UI *** //
	return (
		<>
			<main className={styles.main}>
				<div>
					<Splotch color={[hue, saturation, lightness]}></Splotch>
				</div>

				{/* prettier-ignore */ /* tell my code formatter to ignore this becuase it looks bad when it tries  */}
				<div className={styles.inputcontainer}>
					<label>
						hue:
						<Input value={hue} range={[0, 360]} updateValue={updateHue}></Input>
						{hue}deg
					</label>

					<label>
						saturation:
						<Input value={saturation} range={[0, 100]} updateValue={updateSaturation}></Input>
						{saturation}%
					</label>

					<label>
						lightness:
						<Input value={lightness} range={[0, 100]} updateValue={updateLightness}></Input>
						{lightness}%
					</label>
				</div>

				<div className={styles.buttonscontainer}>
					<button onClick={calculateComplement}>Calculate Complement</button>
					<button onClick={calculateTints}>Calculate Tints</button>
					<button onClick={calculateShades}>Calculate Shades</button>
					<button onClick={calculateAnalgous}>Calculate Analgous Colors</button>
				</div>

				<div className={styles.splotchgrid}>
					{output.map((color, i) => {
						return <Splotch key={`color${i}`} color={color}></Splotch>;
					})}
				</div>
			</main>
		</>
	);
}
