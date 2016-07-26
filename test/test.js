var expect = require('chai').expect
var spawn = require('child_process').spawn
var fs = require('fs')
var path = require('path')
var walk = require('walk')

function runPhantom (root, fileName, done) {

  var testFile = path.join(root, fileName)

  var cliProcess = spawn('phantomjs', ['phantom.js'].concat([testFile]), {cwd: __dirname})

  var output = '', msg = ''
  cliProcess.stdout.on('data', function (data) {
    output += data
  })
  cliProcess.stderr.on('data', function (data) {
    msg += data
  })
  cliProcess.on('exit', function () {
    if (msg) return done(msg)
    // console.log(output)

    // test format is output******result.css
    var group = output.replace(/------$/,'').split('------')

    for(var i = 0, len = group.length; i < len; i++) {
      var text = group[i].split('******')
      if(text.length<2) return done('wrong test format')

      try {
        var target = fs.readFileSync(path.join(root, text[1]), 'utf8')
      } catch(e) {
        return done(e)
      }

      expect(text[0]).equal(target)

    }

    done()
  })
}

var walker = walk.walkSync('./spec', {
  followLinks: false,
  listeners:{
    file : walkFile
  }
})

function walkFile(root, stat, next) {

  if(!/\.js$/i.test(stat.name)) return next()

  describe('test case in '+root, function () {

    this.slow(3000)

    it('case file '+stat.name, function (done) {
      runPhantom(root, stat.name, done)
    })

  })
  next()

}
