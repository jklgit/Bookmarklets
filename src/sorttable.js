(() => {
	'use strict';

	const compose = (...functions) => data => functions.reduceRight((value, func) => func(value), data);

	let as = [];

	const compare = (a, b) => a.localeCompare(b, undefined, {
		numeric: true,
		sensitivity: 'base'
	});

	const sortTable = (table, column, order = 1) => {
		let tbody = table.querySelector('tbody');
		let nodes = [...tbody.querySelectorAll('tr')].sort((a, b) => {
			a = a.querySelector(`td:nth-child(${column+1})`).innerText;
			b = b.querySelector(`td:nth-child(${column+1})`).innerText;
			return (order * compare(a, b));
		});
		nodes.forEach((node) => tbody.appendChild(node));

		return table;
	};

	const sortTableOnClick = (a, table, i) => {
		let order = 1;
		if (a.textContent === 'o') {
			a.textContent = '^';
		} else if (a.textContent === '^') {
			a.textContent = 'v';
			order = -1;
		} else if (a.textContent === 'v') {
			a.textContent = 'o';
			i = 0;
		}

		sortTable(table, i, order);

		// Set all other sort arrows back to 'o'
		as.forEach((other_a) => {
			if (other_a !== a) {
				other_a.textContent = 'o';
			}
		});
	};

	const addSortArrows = (table) => {
		table.querySelectorAll('thead > tr > th').forEach((th, i, list) => {
			th.innerHTML = th.innerHTML + ' ';
			let a = document.createElement('a');
			a.textContent = 'o';
			a.href = '#';
			a.onclick = () => sortTableOnClick(a, table, i);
			th.appendChild(a);
			as.push(a);
		});
		return table;
	};

	const addIndex = (table) => {
		// Add index header
		let th = document.createElement('th');
		th.textContent = 'Index';
		let tr = table.querySelector('thead > tr');
		if (tr !== null) {
			tr.insertBefore(th, tr.firstChild);

			// Add default indizes
			table.querySelectorAll('tbody > tr').forEach((tr, i) => {
				let td = document.createElement('td');
				td.textContent = i + 1;
				tr.insertBefore(td, tr.firstChild);
			});
		}
		return table;
	};

	document.querySelectorAll('table').forEach((table) => compose(addSortArrows, addIndex)(table));

	return false;
})();
