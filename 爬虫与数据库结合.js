const axios=require('axios')
const mysql=require('mysql')
const cheerio=require('cheerio')
let baseurl='http://www.785888.net/'
let options={
  host:'localhost',
  user:'root',
  password:'caizhange+3.1415',
  database:'book'
}
let con=mysql.createConnection(options);
con.connect()
async function getname(baseurl){
  let arr=[]
  let res=await axios.get(baseurl)
  let $=cheerio.load(res.data);
  $('.header .nav a').each((i,v)=>{
   arr.push($(v).attr('href'))
  })
  arr.shift()
  return arr
}


async function geturl(baseurl,url){
 let res=await axios.get(url)
 let $=cheerio.load(res.data);
 let newurl=[]
 $('.list .listBox ul li>a').each((i,v)=>{
newurl.push(baseurl+$(v).attr('href'))
 })
 return newurl
}
async function getnum(url){
  let str=''
  let res=await axios.get(url)
  let $=cheerio.load(res.data);
  $('.listBox .tspage a:nth-child(2)').each((i,v)=>{
   str= $(v).attr('href').split('/index_')[1].split('.html')[0]
     })
   return parseInt(str)
     
}
async function sendmysql(url){
  let res=await axios.get(url)
  let $=cheerio.load(res.data);
  let name,auto,size,load,data,count
   name=$('.detail_info .detail_right>h1').text();
  count=$('.detail_info .detail_right ul li:nth-child(1)').text();
  auto=$('.detail_info .detail_right ul li:nth-child(7)').text();
  data=$('.detail_info .detail_right ul li:nth-child(5)').text();
  size=$('.detail_info .detail_right ul li:nth-child(3)').text();
  load=$('.mt20 .showDown li:nth-child(2)>a').attr('href')
  console.log(name,auto,size,load,data,count);
  
con.query('insert into bookdata(name,auto,size,loads,data,count)values(?,?,?,?,?,?)',[name,auto,size,load,data,count],(err,data)=>{
  console.log('成功');
  
})
}
async function getdata(){
  let res= await getname(baseurl)
 let myurl
 for(let i=0;i<res.length;i++){
  let num=await getnum(baseurl+res[i])
for(let j=1;j<=num;j++){
  if(j==1){
   myurl= await geturl(baseurl,baseurl+res[i]+'index.html');  
  }else{
    myurl= await geturl(baseurl,baseurl+res[i]+'index_'+j+'.html');
  }
 for(let i=0;i<myurl.length;i++){
  await sendmysql(myurl[i])
 }
  
}

 
 }
 }
 getdata()