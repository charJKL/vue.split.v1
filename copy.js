import fs from 'fs';
import path from 'path';

const argv = process.argv.slice(2);
const input = argv[0];
if(input === undefined) throw new Error(`Missing input directory.`);
if(path.isAbsolute(input) === false) throw new Error(`Input directory must be absolute path ${input}.`);
if(fs.existsSync(input) === false) throw new Error(`Input directory doesn't exists ${input}.`);

const output = argv[1];
if(output === undefined) throw new Error(`Missing output directory.`);
if(path.isAbsolute(output) === false) throw new Error(`Output directory must be absolute path ${output}.`);
if(fs.existsSync(output) === false) throw new Error(`Output directory doesn't exists ${output}.`);

fs.readdir(input, function(error, files)
{
	if(error) throw new Error("Can't read folder");
	files.forEach(function(filename)
	{
		const filepath = path.join(input, filename);
		const parts = path.parse(filepath);
		const files = [parts.name + '-1' + parts.ext, parts.name + '-2' + parts.ext];
		
		files.forEach((file, index, array) => array[index] = path.join(output, file) );
		files.forEach((file) => fs.copyFile(filepath, file, (e) => { if(e) console.log(e.message);} ));
		console.log('File', filepath, '->', files[0]);
		console.log('File', filepath, '->', files[1]);
	});
});