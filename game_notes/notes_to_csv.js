const fs = require('fs');

const dir = fs.readdirSync('./departments');

Object.defineProperty(String.prototype, "capitalizeName", {
    value: function capitalizeName() {
        return this
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
});

const results = dir.map((department) => {
    // get all the files in the department
    const files = fs
        .readdirSync(`./departments/${department}`)
        .filter((file) => file.endsWith('.md'));

    return files.map((file) => {
        const data = fs.readFileSync(`./departments/${department}/${file}`, 'utf8');
        const lines = data.split('\n');
        const title = lines[0].replace('# ', '');
        const content = lines.slice(1).join(' ');

        return {
            department,
            name: file.replace('.md', '').replace(/_/g, ' ').capitalizeName(),
            title,
            content,
        };
    });
});

const flatResults = results.flat();
console.log(flatResults);

const csv = flatResults.map((note) => {
    return `"${note.department}","${note.name}","${note.title}","${note.content}"`;
});

console.log('Writing out to notes.csv...' + csv.join('\n'));

if (fs.existsSync('notes.csv'))
    fs.unlinkSync('notes.csv');

fs.writeFileSync('notes.csv', csv.join('\n'));
