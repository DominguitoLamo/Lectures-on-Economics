const fs = require('fs')
const path = require('path').posix

main()

function main () {
    const filePath = process.argv[2]
    const contextTree = generateTree(filePath)
    const resultText = convertedToContext(contextTree)
    appendToSummary(resultText,'./SUMMARY.md')
}

function generateTree (dir) {
    const tree = {}
    const mdMap = generatePathMap(dir)
    tree["path"] = mdMap["main"]
    tree["title"] = getmainTitle(tree["path"])
    if (mdMap["children"].length > 0) {
      tree["children"] = getSectionsInfo(mdMap["children"])
    }
    return tree
}

function generatePathMap (dir) {
  const map = {}  
  const mdfiles = fs.readdirSync(dir).filter(item => item.indexOf(".md") !== -1)
  map["main"] = mdfiles.find(item => item.indexOf("README") !== -1)
  if (!map["main"]) {
    throw new Error("No main file!")
  }
  map["main"] = path.join(dir, map["main"])
  map["children"] = mdfiles.filter(item => item.indexOf("Section") !== -1)
                      .map(item => path.join(dir,item))
                      .sort((a,b) => {
                        newa = a.split(".")[0]
                        newa = newa.substring(newa.length - 3)
                        newb = b.split(".")[0]
                        newb = newb.substring(newb.length - 3)
                        return newa - newb
                      })
  return map
}

function getmainTitle (filePath) {
  const text = fs.readFileSync(filePath)
  const pattern = /^# (Lecture.*)/
  if (pattern.test(text)) {
    return RegExp.$1
  }
  return filePath
}

function getSectionsInfo (children) {
  const result = []
  children.forEach(item => {
    const temp = {}
    temp["path"] = item
    temp["title"] = getSectionTitle(item)
    result.push(temp)
  })
  return result
}

function getSectionTitle (filePath) {
  const text = fs.readFileSync(filePath)
  const pattern = /^# (Section.*)/
  if (pattern.test(text)) {
    return RegExp.$1 
  }
  return filePath
}

function convertedToContext (tree) {
  let text = `* [${tree["title"]}](${tree["path"]})\n`
  if (tree["children"]) {
    tree["children"].forEach(item => {
      text = text.concat(`  * [${item["title"]}](${item["path"]})\n`)
    })
  }

  return text
}

function appendToSummary (text, filePath) {
  fs.appendFile(filePath, text, () => console.log("success to write to the file"))
}