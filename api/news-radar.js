const {getRadar}=require('../lib/news-radar');
module.exports=async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.statusCode=405;res.setHeader('Allow','GET');return res.end('{}');}
  try{const data=await getRadar();res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=300');return res.end(JSON.stringify(data));}
  catch{res.statusCode=503;res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify({error:'temporarily_unavailable'}));}
};
