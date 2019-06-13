var sql = require('sqlite3');
const fs = require('fs');

var con = new sql.Database('happikar.db', (err) => {
	if (err) throw err;
	console.log('Connected!');
});

fs.readFile("CTS-V 2005.csv", "utf8", (err, data) => {
	if (err) throw err;
	var lines = data.split("\n");
	identifiers = lines[0].split(',');
	let make = identifiers[1];
	let model = identifiers[3];
	let year = identifiers[5];
	let trim = identifiers[7];
	con.run('DELETE FROM mileageitems;');
	con.get(`SELECT ROWID FROM carmodels WHERE make = '${make}' AND model = '${model}' AND year = '${year}' AND trim = '${trim}';`, function (err, result) {
		if (err) throw err;
		var id = result.rowid;
		for (var i = 2; i < lines.length; i++)
		{
			let item = lines[i].split(',');
			if (item.length >= 3)
			{
				let mileage = item[0];
				let title = item[1];
				let description = item[2];
				if (description)
				{
				con.exec(`insert into mileageitems (car_id, mileage, action, description) values (${id}, ${mileage}, '${title}', '${description}');`, (err) => {if (err) throw err});
					console.log(`Added an item: ${mileage}: ${title} - ${description}`);
				}
				else
				{
					con.exec(`insert into mileageitems (car_id, mileage, action) values (${id}, ${mileage}, '${title}');`, (err) => {if (err) throw err});
					console.log(`Added an item: ${mileage}: ${title} - no description`);
				}
			}
		}
		console.log('Finished!');
		con.close();
	});
});


