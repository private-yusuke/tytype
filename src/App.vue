<template>
  <div id="app" class="page-container">
    <md-dialog :md-active.sync="showDialog" style="padding: 20px;">
      <md-dialog-title>New code</md-dialog-title>
      <md-field>
        <label>Language</label>
        <md-input v-model="langInput"></md-input>
      </md-field>
      <md-field>
        <label>code</label>
        <md-textarea v-model="codeInput" :options="codeInOpt"></md-textarea>
      </md-field>
      <div>
        <md-radio v-model="indentInput" value="spaces">Spaces</md-radio>
        <md-radio v-model="indentInput" value="tabs">Tabs</md-radio>
      </div>
      <md-field v-if="indentInput === 'spaces'">
        <label>Indent unit</label>
        <md-input v-model="inputIndentUnit" type="number"></md-input>
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" style="flex: 1" @click="onClickStart">Start</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-app>
      <md-app-toolbar class="md-primary">
        <span style="flex: 1" class="md-title">Tytype</span>
        <md-button class="md-primary" @click="onClickNewCode">New code</md-button>
      </md-app-toolbar>

      <md-app-content>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ lang }}</div>
            </md-card-header-text>
          </md-card-header>

          <md-card-content>
            <!--
            <div v-highlight>
            <pre><code :class="lang">{{ precode }}</code></pre>
            </div>
            -->
            <codemirror readonly v-model="precode" :options="precodeOpt"></codemirror>
          </md-card-content>
        </md-card>
        <md-card>
          <md-card-header>
            <div class="md-title">{{ typed_count+1 + " / " + precode.length }}</div>
          </md-card-header>
          <md-card-content>
            <md-field :class="wrongClass">
              <label>Code</label>
              <!--<md-textarea class="disabledTab" v-model="codein" @input="onCodeinUpdated" md-autogrow v-bind:disabled="isCompleted"></md-textarea>-->
              <codemirror style="float: left;" @input="onCodeinUpdated" v-model="codein" :options="codeInOpt"></codemirror>
              <span class="md-error">Wrong!</span>
            </md-field>
            <md-progress-bar md-mode="determinate" :md-value="typed_ratio"></md-progress-bar>
            <md-content class="md-primary" v-if="isCompleted">Done! You can type more source code by reloading this page.</md-content>
            <md-icon v-if="isWrong || isCompleted">{{ stat_icon }}</md-icon>
          </md-card-content>
        </md-card>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/base16-dark.css'

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

/* eslint-disable */
let codes = [
{"code": String.raw`
vector<unsigned long long> generate_prime_list(unsigned long long N) {
	vector<unsigned long long> prime_list;
	prime_list.push_back(2);
	bool not_prime = false;
	for (int i = 3; i <= N; ++i)
	{
		for (std::vector<unsigned long long>::iterator j = prime_list.begin(); j != prime_list.end(); ++j)
		{
			if(i % *j == 0)
			{
				not_prime = true;
				break;
			}
		}
		if(!not_prime) prime_list.push_back(i);
		not_prime = false;
	}
	return prime_list;
}
`, "language": "C++"
},
{"code": String.raw`
T[] deepcopy(T)(T[] a) {
	import std.traits : isArray;
	static if(isArray!T) {
		T[] res;
		foreach(i; a) {
			res ~= deepcopy(i);
		}
		return res;
	} else {
		return a.dup;
	}
}

unittest
{
	auto a = [[[1,2],[3,4]],[[5,6],[7,8]]];
	auto b = a.deepcopy;
	b[0][0][1] = 100;
	assert(a != b);
}
`, "language": "D"
},
{
"code": String.raw`
ulong[] generate_prime_list(T)(T N) if(isIntegral!T) {
	ulong[] prime_list = [2];
	bool not_prime = false;
	foreach(i; 3..N.to!ulong+1) {
		foreach(j; prime_list) {
			if(i % j == 0) {
				not_prime = true;
				break;
			}
		}
		if(!not_prime) prime_list ~= i;
		not_prime = false;
	}
	return prime_list;
}
`, "language": "D"
},
{
"code": String.raw`
bool isPrime(ulong n) {
	if(n <= 1) return false;
	else if(n == 2) return true;
	else if(n % 2 == 0) return false;

	foreach(i; iota(3, n.to!double.sqrt.ceil+1, 2)) {
		if(n % i == 0) return false;
	}
	return true;
}
`, "language": "D"
},
{
"code": String.raw`
ulong pow_mod(ulong n, ulong k, ulong m) {
	if(k==0) return 1;
	else if(k & 1) return pow_mod(n, k-1, m) * n % m;
	else {
		ulong t = pow_mod(n, k>>1, m);
		return t * t % m;
	}
}
`, "language": "D"
},
{
"code": String.raw`
class UnionFind(T) {
	T[] arr;
	this(ulong n) {
		arr.length = n;
		arr[] = -1;
	}
	T root(T x) {
		return arr[x] < 0 ? x : root(arr[x]);
	}
	bool same(T x, T y) {
		return root(x) == root(y);
	}
	bool unite(T x, T y) {
		x = root(x);
		y = root(y);
		if(x == y) return false;
		if(arr[x] > arr[y]) swap(x, y);
		arr[x] += arr[y];
		arr[y] = x;
		return true;
	}
	T size(T a) {
		return -arr[root(a)];
	}
}
`, "language": "D"
},
{
"code": String.raw`
function onCodeinUpdated (mes, e) {
  if (done) return
  charCount = mes.length - 1
  if (mes[charCount] === precode[charCount]) {
    this.isWrong = false
    this.typed_ratio = (mes.length / precode.length) * 100
    if (charCount === precode.length - 1) {
      if (precode === mes) {
        console.log('Done!')
        done = this.isCompleted = true
        this.stat_icon = 'check_circle'
      } else {
        this.isWrong = true
        this.stat_icon = 'announcement'
      }
    }
  } else {
    this.isWrong = true
    this.stat_icon = 'announcement'
  }
}`, "language": "JavaScript", "indentUnit": 2, "indent": "spaces"
}
]

let num = getRandomInt(codes.length)
let selcode = codes[num]
let precode = selcode.code//.replace("\t", "    ")
let lang = selcode.language
let codeInOpt =  {
  tabSize: 4,
  theme: 'base16-dark',
  lineNumbers: true,
  styleActiveLine: true,
  indentUnit: selcode.indentUnit ? selcode.indentUnit : 4,
  indentWithTabs: selcode.indent !== "spaces",
	smartIndent: true,
  name: lang
}
var precodeOpt = Object.assign({}, codeInOpt)
precodeOpt.readOnly = true

precode = precode.trim()
var charCount = 0
console.log(precode.length)

function onCodeinUpdated (mes, e) {
  console.log(mes)
  console.log(this.precode)
  if (this.isCompleted) return
  charCount = this.typed_count = mes.length - 1
  if (mes[charCount] === this.precode[charCount]) {
    this.isWrong = false
    this.typed_ratio = (mes.length / this.precode.length) * 100
    if (charCount === this.precode.length - 1) {
      if (this.precode === mes) {
        console.log('Done!')
        this.isCompleted = true
        this.stat_icon = 'check_circle'
      } else {
        this.isWrong = true
        this.stat_icon = 'announcement'
      }
    }
  } else {
    this.isWrong = true
    this.stat_icon = 'announcement'
  }
}

function onClickStart () {
  this.precode = this.codeInput.trim()
  this.codein = ""
  this.isWrong = false
  this.isCompleted = false
  this.typed_ratio = 0
  this.typed_count = 0
  this.stat_icon = null
  this.lang = this.langInput
  this.showDialog = false
  this.codeInOpt =  {
    tabSize: 4,
    theme: 'base16-dark',
    lineNumbers: true,
    styleActiveLine: true,
    indentUnit: this.inputIndentUnit ? this.inputIndentUnit : 4,
    indentWithTabs: this.indentInput !== "spaces",
    smartIndent: true,
    name: this.lang
  }
  this.precodeOpt = precodeOpt
  charCount = 0
}

function onClickNewCode () {
  this.showDialog = true
}

console.log(precode)

export default {
  name: 'App',
  data () {
    return {
      precode: precode,
      codein: null,
      isWrong: false,
      isCompleted: false,
      typed_ratio: 0,
      typed_count: 0,
      stat_icon: null,
      lang: lang,
      codeInOpt: codeInOpt,
      precodeOpt: precodeOpt,
      showDialog: false,
      indentInput: null,
      langInput: null,
      codeInput: null,
      inputIndentUnit: null
    }
  },
  computed: {
    wrongClass () {
      return {
        'md-invalid': this.isWrong
      }
    }
  },
  methods: {
    onCodeinUpdated: onCodeinUpdated,
    onClickNewCode: onClickNewCode,
    onClickStart: onClickStart
  }
}
</script>
