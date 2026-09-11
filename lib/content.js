const fs=require("fs");const path=require("path");
const cats=["engenharia","arquitetura","construcao","tecnologia","infraestrutura","mercado","gestao","sustentabilidade"];
const articles=cats.flatMap(c=>require(path.join("..","data",c+".json")));
const events=require("../data/events.json");
module.exports={articles,events,cats};
