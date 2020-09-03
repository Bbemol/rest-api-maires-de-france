
const fetch = require('node-fetch')

async function myFetch() {
  const response = await fetch('https://www.data.gouv.fr/api/1/datasets/repertoire-national-des-elus-1/')
  const data = await response.json()
  const mairieFileUrl = data.resources.filter(resource => resource.title === '9-rne-maires.txt')[0].url
  const getMairiesInfoFile = await fetch(mairieFileUrl)

  return await getMairiesInfoFile.text()
}

myFetch().then((response) => {
  const fileArr = response.split('\n')
  const mairiesJson = {
    mairies: []
  }
  fileArr.map((mairie, index) => {
    if ([0, 1].includes(index)) return;
    const mairieInfos = mairie.split('\t')
    mairiesJson.mairies.push({
      'codeDepartement': mairieInfos[0],
      'codeInseeCommune': mairieInfos[2],
      'libelleCommune': mairieInfos[3],
      'nom': mairieInfos[4],
      'prenom': mairieInfos[5],
      'dateDeNaissance': mairieInfos[7]
    })
  })
  const express = require('express')
  const app = express()
  const port = 3000
  
  app.get('/mairies', (req, res) => {
    res.send(mairiesJson)
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})