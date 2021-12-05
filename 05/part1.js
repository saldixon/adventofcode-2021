const fs = require('fs')

const lineRegex = new RegExp('^([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)$');

const parseInput = (filename, split) => {
  return fs.readFileSync(filename).toString().split(split)
  .filter(entry => entry)
}

function parseVentLines(input){
	const ventLines = input.map(
		line => {
			const elements = lineRegex.exec(line);
			elements.shift();
			const start = elements.slice(0,2).map(string => parseInt(string)); // first two matching groups
			const end = elements.slice(2,4).map(string => parseInt(string)); // second tow matching grps
			return {
				start, end
			}
		}
	);
	return ventLines;
} 

function filterOutIrrelevantLines(lines){
	return lines.filter(
		line => {
			return (line.start[0] === line.end[0]) || 
			(line.start[1] === line.end[1]) ;
		}  
	)
}

function getVectorToApply(line){
	const numberOfDimensions = 2;
	const vector = [];
	for (let i=0; i<numberOfDimensions; i++){
		const diff = line.end[i] - line.start[i];
		const increment = diff === 0 ? 0 : diff > 0 ? 1 : -1 ;
		vector.push(increment);
	}
	console.info(`caluclating vector to apply line=${JSON.stringify(line)}, vector=${JSON.stringify(vector)}`);
	return vector;
}

function getPointsCoveredByLine(line){
	const vectorToAdd = getVectorToApply(line);

	var x = line.start[0];
	var y = line.start[1];
	const gridEntries = [[x,y]];

	//  keep applying vectors until we reach the end co-ordintae 
	while ( true ){
		x += vectorToAdd[0];
		y += vectorToAdd[1];
		gridEntries.push([x,y]);
		if (x == line.end[0] && y === line.end[1]){
			break;
		}
	}
	return gridEntries;
}


function populateGrid(lines){
	const grid = [];
	for (ventline of lines){
		console.info(`line=${JSON.stringify(ventline)} vector=${getVectorToApply(ventline)}`);
		const points = getPointsCoveredByLine(ventline);
		console.info(`\npoints on grid = ${points}`);
	
		points.map(
			point => {
				const x = point[0];
				const y = point[1];
				if (!grid[x]){
					grid[x] = []; // create the 'row' if it doesn't exist already
				}
				const currentCount = grid[x][y] || 0;
	
				grid[x][y] =  currentCount + 1;
			}
		);
	} 
	return grid;
}


// ========== start the proceedings ===================
const filename = process.argv[2] || 'input.txt';
const input = parseInput(filename, '\n');

const ventLines = parseVentLines(input);

const relevantVentLines = filterOutIrrelevantLines(ventLines); // for PART 1 : filter out diagonals
// const relevantVentLines = ventLines; // PART 2 (unfiltered)
console.warn(`relevantVentLines= ${JSON.stringify(relevantVentLines)}`);

const grid = populateGrid(relevantVentLines);

// Read the grid to find most dangerous places..
const dangerousGrid = grid.flat().filter(entry => entry >= 2);
console.info(`number of dangerous grids = ${dangerousGrid.length}`);