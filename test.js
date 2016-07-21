/**
 * Created by Ler on 16/7/12.
 */



var str =  '1308995--abcdefgh'

var num = str.indexOf("--")

console.log(str.substring(0,str.indexOf("--")))
console.log(str.substring(str.indexOf("--")+2 ,str.length))