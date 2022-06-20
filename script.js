function getRSS(path){
    let req = new XMLHttpRequest();
    req.open("get", path, true);
    req.send(null);

    req.onload = function(){
        rss = req.responseXML;
        createDisplayData(rss);
    }
}

function createIndexNo(length, p_no){
    let index = document.querySelector("#indexno");
    let index2 = document.querySelector("#indexno2");

    index.innerHTML = "";
    index2.innerHTML = "";
    for(let j=0; j<length; j++){
        if(j!=p_no){
            htmlstr = "<a href='#p-" + j +"' onclick=initialize()>" + (j+1) + "</a>&nbsp;";
        }
        else{
            htmlstr = (j+1) + "&nbsp;";
        }
        index.innerHTML += htmlstr;
        index2.innerHTML += htmlstr;
    }
}


function createDisplayDataPerPage(list, p_no){
    
    let lists_length = Math.ceil(list.length/5.0);
    let lists = new Array(lists_length).fill().map((_, i) => list.slice(i * 5, (i+1)*5));

    if(p_no>=lists_length){
        p_no=0;
    }

    createIndexNo(lists_length, p_no);
    // 記事生成
    let j=0;
    document.querySelector("#main").innerHTML ="";
    lists[p_no].forEach(element =>{
    //lists.forEach(element =>{
        if(j==1){
            document.querySelector("#main").innerHTML = document.querySelector("#main").innerHTML+ document.querySelector("#othercont").outerHTML;
        }
        j+=1;
        let title_text = element.querySelector("title").textContent;
        let date_text = element.querySelector("pubDate").textContent;
        let desc_text = element.querySelector("description").textContent.replace(/data-src/g, "loading='lazy' src");
        let id_text = element.querySelector("guid").textContent.split("#")[1];
        
        let item = document.createElement("div");
        item.setAttribute("class", "content");
        item.setAttribute("id", "n-"+id_text)

        let title = document.createElement("div");
        title.setAttribute("class", "content-title");
        title.innerHTML = "<h2>" + title_text + "</h2>";
        item.insertAdjacentElement("beforeend", title);

        let date = document.createElement("div");
        date.setAttribute("class", "content-pubdate");
        date.innerHTML = "<p>投稿日：" + date_text + "</p>";
        item.insertAdjacentElement("beforeend", date);

        let desc = document.createElement("div");
        desc.setAttribute("class", "content-desc");
        desc.innerHTML = desc_text;
        desc.querySelectorAll(".content-div-word").forEach(div =>{
            p = document.createElement("p");
            p.innerHTML = "<span class='word'>" + div.innerHTML +"</span>";
            div.innerHTML = p.outerHTML;
        });
        desc.querySelectorAll(".content-div-title").forEach(div =>{
            p = document.createElement("p");
            p.innerHTML = "<span class='title'>" + div.innerHTML +"</span>";
            div.innerHTML = p.outerHTML;
        });
        item.insertAdjacentElement("beforeend", desc);

        main_d = document.querySelector("#main").insertAdjacentElement("beforeend",item);
    })
}
function createDisplayData(rss){
    document.querySelector("#lastBuildDate").textContent = "最終更新日：" + rss.querySelector("lastBuildDate").textContent;

    let list = Array.from(rss.querySelectorAll("item"));

    // index 生成
    list.forEach(element =>{
        let title_text = element.querySelector("title").textContent;
        let date_text = element.querySelector("pubDate").textContent;
        let id_text = element.querySelector("guid").textContent.split("#")[1];
        
        let date_l = date_text.split(" ");
        let index_link = "<li>"+date_l[3] + "/"+ date_l[2] + "/" + date_l[1] +"：<a href='#n-" + id_text +"' onclick='refreshContent()'>" + title_text +"</a></li>";
        document.querySelector("#mokuji ul").innerHTML = document.querySelector("#mokuji ul").innerHTML + index_link;
    })

    // #で処理制御
    let p_no=0;
    let hashstr = location.hash;
    if(hashstr.match(/p-/)){
        p_no= parseInt(hashstr.match(/\d+/));
    }
    else if(hashstr.match(/n-/)){
        refreshContent();
        return;
    }
    createDisplayDataPerPage(list, p_no);
}

function initialize(){
    getRSS("houchi_news.xml")
}

function refreshContent(){
    let req = new XMLHttpRequest();
    req.open("get", "houchi_news.xml", true);
    req.send(null);

    req.onload = function(){
        rss = req.responseXML;

        let list = rss.querySelectorAll("item");
    
        let i = 0;
        let hashstr = location.hash;
        if(hashstr.match(/n-/)){
            list.forEach(element =>{
                if(hashstr.match(/\d+/) == element.querySelector("guid").textContent.split("#")[1]){
                    let title_text = element.querySelector("title").textContent;
                    let date_text = element.querySelector("pubDate").textContent;
                    let desc_text = element.querySelector("description").textContent.replace(/data-src/g, "src");
                    let id_text = element.querySelector("guid").textContent.split("#")[1];
                    
                    let item = document.createElement("div");
                    item.setAttribute("class", "content");
                    item.setAttribute("id", "n-"+id_text)
            
                    let title = document.createElement("div");
                    title.setAttribute("class", "content-title");
                    title.innerHTML = "<h2>" + title_text + "</h2>";
                    item.insertAdjacentElement("beforeend", title);
            
                    let date = document.createElement("div");
                    date.setAttribute("class", "content-pubdate");
                    date.innerHTML = "<p>投稿日：" + date_text + "</p>";
                    item.insertAdjacentElement("beforeend", date);
            
                    let desc = document.createElement("div");
                    desc.setAttribute("class", "content-desc");
                    desc.innerHTML = desc_text;
                    desc.querySelectorAll(".content-div-word").forEach(div =>{
                        p = document.createElement("p");
                        p.innerHTML = "<span class='word'>" + div.innerHTML +"</span>";
                        div.innerHTML = p.outerHTML;
                    });
                    desc.querySelectorAll(".content-div-title").forEach(div =>{
                        p = document.createElement("p");
                        p.innerHTML = "<span class='title'>" + div.innerHTML +"</span>";
                        div.innerHTML = p.outerHTML;
                    });
                    item.insertAdjacentElement("beforeend", desc);
            
                    main_d = document.querySelector("#main").innerHTML = item.outerHTML;
                }
            })
        }
    }

}

window.onload = initialize()

/*
let viewXML = (xmlDocument) => {
    //取得した文字列をコンソール出力
    console.log(xmlDocument);

    //XML形式に変換
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlDocument, "text/xml");
    let rss = doc.documentElement.getElementsByTagName("item");

    //HTMLタグの作成
    for(let i = 0;i < rss.length;i++){
        //RSSから取得したタイトルとリンク情報を格納
        let rssTitle = rss[i].getElementsByTagName("title")[0].textContent;
        let rssLink   = rss[i].getElementsByTagName("link")[0].textContent;

        //テンプレート文字列を使ってアンカータグを作成
        const tagString = `<a href="${rssLink}">${rssTitle}</a><br/>`;

        //body以下にアンカータグを挿入
        document.body.insertAdjacentHTML('beforeend',tagString );
    }
};
const URL = 'https://ascii.jp/mac/rss.xml';
fetch(URL)
.then( response => response.text())
.then( xmlData => viewXML(xmlData));
*/