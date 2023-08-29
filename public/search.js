const bm25 = require('wink-bm25-text-search');
const nlp = require('wink-nlp-utils');
const bhutaShuddhi = require('./data/bhuta-shuddhi.json');
const simhaKriya = require('./data/simha-kriya.json');
const others = require('./data/others.json');
const docs = bhutaShuddhi.concat(others).concat(simhaKriya);
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
	hide('title');
	hide('body');
	hide('noresults');
	text('other', '');
	document.getElementById('search').addEventListener('keyup', function (el) {
		if (el.target.value === '') {
			hide('title');
			hide('body');
			hide('noresults');
			text('other', '');
			show('help');
			return false;
		} else {
			hide('help');
		}

		var results = engine.search(el.target.value);
		if (results.length < 1) {
			hide('title');
			hide('body');
			text('other', '');
			show('noresults');
		} else {
			var spotted = getSpottedTerms(
				results,
				el.target.value,
				docs,
				['q', 'a'],
				pipe,
				3,
			);
			hide('noresults');
			var result = docs[results[0][0]];
			show('title');
			show('body');
			html('title', highlightTerms(result.q, spotted));
			html('body', highlightTerms(result.a, spotted));
			text('other', '');
			if (results.length > 1) {
				for (var i = 1; i < results.length; i++) {
					var result = docs[results[i][0]];
					document.getElementById('other').innerHTML +=
						'<h3>' + highlightTerms(result.q, spotted) + '</h3>';
					document.getElementById('other').innerHTML +=
						'<small>' +
						highlightTerms(result.a, spotted) +
						'</small>';
				}
			}
		}
	});

	function highlightTerms(body, spotted) {
		spotted.forEach(function (term) {
			var r = new RegExp('\\W(' + term + ')\\W', 'ig');
			body = body.replace(r, ' <mark>$1</mark> ');
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
