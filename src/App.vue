<template>
  <div id="app" class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Tytype</span>
      </md-app-toolbar>

      <md-app-content>
        <!--<md-field>
          <label>precode</label>
          <md-textarea v-model="precode" md-autogrow disabled>{{ precode }}</md-textarea>
          <md-icon>description</md-icon>
        </md-field>
        -->
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">C++</div>
            </md-card-header-text>
          </md-card-header>

          <md-card-content>
            <pre>{{ precode }}</pre>
          </md-card-content>
        </md-card>
        <md-field>
          <label>Code</label>
          <md-textarea v-model="codein" @input="onCodeinUpdated" md-autogrow v-bind:disabled="isCompleted"></md-textarea>
          <md-icon v-if="isWrong || isCompleted">{{ stat_icon }}
          </md-icon>
        </md-field>
        <md-content class="md-accent" v-if="isWrong">Wrong!</md-content>
        <md-content class="md-primary" v-if="isCompleted">Completed!</md-content>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

let precode = String.raw`
#include <iostream>
int main()
`
precode = precode.trim()
var charCount = 0
var done = false
console.log(precode.length)

function onCodeinUpdated (mes, e) {
  if (done) return
  console.log(charCount)
  console.log(`${mes[charCount]}, ${precode[charCount]}`, `${mes[charCount] === (precode[charCount])}`)
  if (mes[charCount] === precode[charCount]) {
    charCount++
    this.isWrong = false
    console.log(charCount)
    if (charCount === precode.length) {
      console.log('Done!')
      done = this.isCompleted = true
      this.stat_icon = 'check_circle'
    }
  } else {
    this.isWrong = true
    this.stat_icon = 'announcement'
  }
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
      stat_icon: null
    }
  },
  methods: {
    onCodeinUpdated: onCodeinUpdated
  }
}
</script>
