const bm25 = require('wink-bm25-text-search');
const nlp = require('wink-nlp-utils');
const docs = require('./data/bundle.json');

var getSpottedTerms = require('wink-bm25-text-search/runkit/get-spotted-terms.js');

var engine = bm25();
var pipe = [
	nlp.string.lowerCase,
	nlp.string.tokenize0,
	nlp.tokens.removeWords,
	nlp.tokens.stem,
	nlp.tokens.propagateNegations,
];
engine.defineConfig({ fldWeights: { q: 1, a: 2 } });
engine.definePrepTasks(pipe);
docs.forEach(function (doc, i) {
	engine.addDoc(doc, i);
});
engine.consolidate();

window.addEventListener('DOMContentLoaded', function () {
	hide('results');
	hide('noresults');

	document.getElementById('search').addEventListener('keyup', function (el) {
		hide('results');
		hide('noresults');
		hide('help');

		if (el.target.value === '') {
			show('help');
			return false;
		}

		var results = engine.search(el.target.value);
		if (results.length < 1) {
			show('noresults');
			return false;
		}

		show('results');
		var spotted = getSpottedTerms(
			results,
			el.target.value,
			docs,
			['q', 'a'],
			pipe,
			3,
		);

		var resultsElem = document.getElementById('results');
		resultsElem.innerHTML = '';
		for (let i = 0; i < results.length; i++) {
			const result = docs[results[i][0]];
			resultsElem.innerHTML += `<div class="question">${marked.parse(
				highlightTerms(result.q, spotted),
			)}</div>`;
			resultsElem.innerHTML += `<div class="ans">${marked.parse(
				highlightTerms(result.a, spotted),
			)}</div>`;
		}
	});

	function highlightTerms(body, spotted) {
		spotted.forEach(function (term) {
			var r = new RegExp('(\\W)(' + term + ')(\\W)', 'ig');
			body = body.replace(r, '$1 <mark>$2</mark> $3');
		});
		return body;
	}

	function hide(id) {
		document.getElementById(id).setAttribute('class', 'hidden');
		document.getElementById(id).style.display = 'none';
	}

	function show(id) {
		document.getElementById(id).style.display = 'block';
		window.setTimeout(function () {
			document.getElementById(id).setAttribute('class', 'shown');
		}, 0);
	}

	function text(id, text) {
		document.getElementById(id).innerText = text;
	}

	function html(id, text) {
		document.getElementById(id).innerHTML = text;
	}
});
