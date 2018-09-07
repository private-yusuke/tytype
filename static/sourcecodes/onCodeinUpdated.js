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
}