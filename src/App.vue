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
    <md-dialog :md-active.sync="showDiff" style="max-width: 768px; width: 100%;">
      <md-dialog-title>Show diff</md-dialog-title>
      <md-dialog-content>
        <div class="codemirror">
          <codemirror :merge="true" :options="diffOpt"></codemirror>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="onClickDiffDone">Done</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="showAll" style="max-width: 768px; width: 100%;">
      <md-dialog-title>Choose</md-dialog-title>
      <md-dialog-content>
        <md-list>
          <md-list-item v-for="(elem, index) in this.codes" :key="elem.filename" @click="initPreCode(index)">
            <div class="md-list-item-text">
              <span>{{ elem.filename }}</span>
              <span>{{ elem.language }}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="onClickShowAllDone">Done</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-app>
      <md-app-toolbar class="md-primary">
        <span style="flex: 1" class="md-title">Tytype</span>
        <md-button class="md-primary" @click="onClickNewCode">New code</md-button>
        <md-button @click="onClickRandom">Ramdom</md-button>
        <md-button @click="onClickShowAll">Choose</md-button>
      </md-app-toolbar>

      <md-app-content>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ lang }}</div>
            </md-card-header-text>
            <md-card-actions>
              <md-button @click="onClickDiff">Diff</md-button>
            </md-card-actions>
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
            <div class="md-title" style="display: inline-block;">{{ typed_count+1 + " / " + precode.length }}</div>
            <md-icon v-if="isWrong || isCompleted">{{ stat_icon }}</md-icon>
          </md-card-header>
          <md-card-content>
            <md-field :class="wrongClass">
              <label>Code</label>
              <!--<md-textarea class="disabledTab" v-model="codein" @input="onCodeinUpdated" md-autogrow v-bind:disabled="isCompleted"></md-textarea>-->
              <codemirror style="float: left;" @input="onCodeinUpdated" v-model="codein" :options="codeInOpt"></codemirror>
              <span class="md-error">{{ wrongMessage }}</span>
            </md-field>
            <md-progress-bar md-mode="determinate" :md-value="typed_ratio"></md-progress-bar>
            <md-content class="md-primary" v-if="isCompleted">Done! Select code from "CHOOSE" or Push "RANDOM".</md-content>
          </md-card-content>
        </md-card>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/css/css.js'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import DiffMatchPatch from 'diff-match-patch'

window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function onCodeinUpdated (mes, e) {
  this.diffOpt.value = this.codein
  this.diffOpt.orig = this.precode
  console.log(mes)
  console.log(this.precode)
  if (this.isCompleted) return
  this.typed_count = mes.length - 1
  if (mes[this.typed_count] === this.precode[this.typed_count]) {
    this.isWrong = false
    this.typed_ratio = (mes.length / this.precode.length) * 100
    if (this.typed_count === this.precode.length - 1) {
      if (this.precode === mes) {
        console.log('Done!')
        this.isCompleted = true
        this.stat_icon = 'check_circle'
      } else {
        this.isWrong = true
        this.stat_icon = 'announcement'
        this.wrongMessage = 'Wrong! Consider using Diff to find out.'
      }
    }
  } else {
    this.isWrong = true
    this.stat_icon = 'announcement'
    this.wrongMessage = 'Wrong!'
  }
}

function onClickStart () {
  this.precode = this.codeInput.trim()
  this.codein = null
  this.isWrong = false
  this.isCompleted = false
  this.typed_ratio = 0
  this.typed_count = 0
  this.stat_icon = null
  this.lang = this.langInput
  this.showDialog = false
  this.codeInOpt = {
    tabSize: 4,
    theme: 'base16-dark',
    lineNumbers: true,
    styleActiveLine: true,
    indentUnit: this.inputIndentUnit ? this.inputIndentUnit : 4,
    indentWithTabs: this.indentInput !== 'spaces',
    smartIndent: true,
    name: this.lang
  }
}

function onClickNewCode () {
  this.showDialog = true
}

function onClickDiff () {
  this.showDiff = true
}
function onClickDiffDone () {
  this.showDiff = false
}
function onClickRandom () {
  this.initPreCode()
}
function onClickShowAll () {
  this.showAll = true
}
function onClickShowAllDone () {
  this.showAll = false
}
export default {
  name: 'App',
  data () {
    return {
      codes: [],
      precode: null,
      codein: null,
      isWrong: false,
      isCompleted: false,
      typed_ratio: 0,
      typed_count: 0,
      stat_icon: null,
      lang: null,
      codeInOpt: null,
      precodeOpt: null,
      diffOpt: null,
      showDiff: false,
      showDialog: false,
      showAll: false,
      indentInput: null,
      langInput: null,
      codeInput: null,
      inputIndentUnit: null,
      wrongMessage: null
    }
  },
  async created () {
    await this.fetchData()
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
    onClickStart: onClickStart,
    onClickDiff: onClickDiff,
    onClickDiffDone: onClickDiffDone,
    onClickRandom: onClickRandom,
    onClickShowAll: onClickShowAll,
    onClickShowAllDone: onClickShowAllDone,
    async getSource (index) {
      if (!this.codes[index].code) this.codes[index].code = await (await fetch(`static/sourcecodes/${this.codes[index].filename}`)).text()
    },
    async fetchData () {
      const res = await fetch('static/sourcecodes/list.json')
      const listjs = await res.json()
      this.codes = listjs.files
      console.log(this.codes)

      let initPreCode = async (index) => {
        let num = (index !== undefined) ? index : getRandomInt(this.codes.length)
        console.log(num)
        await this.getSource(num)
        let selcode = this.codes[num]
        this.precode = String(selcode.code).trim()
        this.lang = selcode.language
        let codeInOpt = {
          tabSize: 4,
          theme: 'base16-dark',
          lineNumbers: true,
          styleActiveLine: true,
          indentUnit: selcode.indentUnit ? selcode.indentUnit : 4,
          indentWithTabs: selcode.indent !== 'spaces',
          smartIndent: true,
          name: this.lang
        }
        let precodeOpt = Object.assign({}, codeInOpt)
        precodeOpt.readOnly = true
        let diffOpt = Object.assign({}, precodeOpt)
        diffOpt.theme = 'base16-light'
        diffOpt.collapseIdentical = false
        diffOpt.connect = 'align'
        diffOpt.origLeft = null
        diffOpt.mode = 'text/plain'
        diffOpt.highlightDifferences = true

        this.codeInOpt = codeInOpt
        this.precodeOpt = precodeOpt
        this.diffOpt = diffOpt
        this.isCompleted = false
        this.isWrong = false
        this.codein = ''
      }
      this.initPreCode = initPreCode
      await initPreCode()
    }
  }
}
</script>
