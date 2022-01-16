import * as path from 'path';

import * as fs from 'fs';


async function readData(year:number){
    let original = path.resolve(`$(__dirname)`,`../data/zh_CN/area/original/${year}`)
    let jsonFile = path.resolve(`$(__dirname)`,`../data/zh_CN/area/json/${year}.json`)
    let jsFile = path.resolve(`$(__dirname)`,`../data/zh_CN/area/js/${year}.js`)
    let exist = await fs.existsSync(original)

    if(exist){
        let data = await fs.readFileSync(original,"utf8")
        let arrColumn = []
        arrColumn = data.split("\n")
        console.log(arrColumn.length)

        let map:any = {}
        for(let i = 0 ; i < arrColumn.length; i ++){
            let arr = arrColumn[i].split('\t')
            if(arr.length>1 && arr[0].length == 6){
                if(!isNaN(Number(arr[0]))){
                    map[arr[0]] = arr[1].replace(/\s*/g,"")
                }
            }
        }
        let content = JSON.stringify(map,null,4)
        fs.writeFileSync(jsonFile,content)
        let ts = `var zh_CN_area=${JSON.stringify(map)}`
        fs.writeFileSync(jsFile,ts)
        return map;
    }
    return null;
}

async function writeJs(){
    let jsFile = path.resolve(`$(__dirname)`,`../lib/zh_CN_area.js`)
    let zh_CN_area = {}
    for(let i = 1980; i<= new Date().getFullYear(); i++){
        let map = await readData(i)
        if(map!=null){
            //@ts-ignore
            zh_CN_area[`y${i}`] = map
        }
    }
    let js = `var zh_CN_area = ${JSON.stringify(zh_CN_area)}`
    fs.writeFileSync(jsFile,js)
}

writeJs()