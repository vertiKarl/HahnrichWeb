module.exports = {
  name: 'test-plugin',
  execute() {
    console.test('test!')
    return true
  }
}
