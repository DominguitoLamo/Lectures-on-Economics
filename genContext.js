const fs = require('fs')
const path = require('path')

main()

function main () {
    generateTree('./Lecture09')
}

function generateTree (dir) {
    const map = generatePathMap(dir)
}

function generatePathMap (dir) {
  const map = {}  
  const mdfiles = fs.readdirSync(dir).filter(item => item.indexOf(".md") !== -1)
  map["main"] = mdfiles.find(item => item.indexOf("README") !== -1)
  map["main"] = path.join(dir, map["main"])
  map["children"] = mdfiles.filter(item => item.indexOf("Section") !== -1)
                      .map(item => path.join(dir,item))
  console.log(map.main)
}