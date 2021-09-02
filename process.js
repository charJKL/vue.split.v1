import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const argv = process.argv.slice(2);
const input = argv[0];
if(input === undefined) throw new Error(`Missing input directory.`);
if(path.isAbsolute(input) === false) throw new Error(`Input directory must be absolute path ${input}.`);
if(fs.existsSync(input) === false) throw new Error(`Input directory doesn't exists ${input}.`);

const metrics = argv[1];
if(metrics === undefined) throw new Error(`Missing metrics.json file.`);
if(path.isAbsolute(metrics) === false) throw new Error(`metrics.json must be absolute path ${metrics}.`);
if(fs.existsSync(metrics) === false) throw new Error(`metrics.json doesn't exists ${metrics}.`);

const output = argv[2];
if(output === undefined) throw new Error(`Missing output directory.`);
if(path.isAbsolute(output) === false) throw new Error(`Output directory must be absolute path ${output}.`);
if(fs.existsSync(output) === false) throw new Error(`Output directory doesn't exists ${output}.`);

const work = [];
const processed = [];
const skipped = [];
const invalid = [];
console.skipped = function(...msg)
{
	skipped.push(msg.join(' '));
	console.log(...msg);
}
console.invalid = function(...msg)
{
	invalid.push(msg.join(' '));
	console.log(...msg);
}
console.catch = function(filepath, error)
{
	console.log(filepath, error.message);
}

fs.readdir(input, function(error, files)
{
	if(error) throw new Error("Can't read folder");
	fs.readFile(metrics, 'utf8', function(error, data)
	{
		if(error) throw new Error(`Can't read metrics.json file ${metrics}`);
		const spec = JSON.parse(data);
		files.forEach(function(filename)
		{
			const filepath = path.join(input, filename);
			const parts = path.parse(filepath);
			const blueprint = spec[parts.name + parts.ext];
			if(blueprint === undefined) return console.skipped(filepath, '-> skipped');
			
			const angle = blueprint.metrics.rotate.value;
			const x1 = Math.round(blueprint.metrics.x1.value);
			const y1 = Math.round(blueprint.metrics.y1.value);
			const width = Math.round(blueprint.metrics.x2.value - blueprint.metrics.x1.value);
			const height = Math.round(blueprint.metrics.y2.value - blueprint.metrics.y1.value);
			const extract = {left: x1, top: y1, width: width, height: height };
			const options = {quality: 100};
			const dest = path.join(output, parts.name + '.jpg');
			
			if(width <= 0) return console.invalid(filepath, 'invalid width');
			if(height <= 0) return console.invalid(filepath, 'invalid height');
			
			work.push(sharp(filepath).rotate(angle).extract(extract).jpeg(options).toFile(dest).then(() => processed.push(dest)).catch(e => console.catch(filepath, e)));
		});
		
		Promise.all(work).then(function(values){
			const dest = path.join(output, 'files.txt');
			fs.writeFileSync(dest, processed.join('\n'));

			console.log("--------------------------------------");
			skipped.forEach(e => console.log(e));
			invalid.forEach(e => console.log(e));
		});
	});
});