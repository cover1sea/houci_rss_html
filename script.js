function getRSS(path){
    var req = new XMLHttpRequest();
    req.open("get", path, true);
    req.send(null);

    req.onload = function(){
        rss = req.responseXML;
        createDisplayData(rss);
    }
}

function createDisplayData(rss){
    document.querySelector("#lastBuildDate").textContent = "最終更新日：" + rss.querySelector("lastBuildDate").textContent;

    list = rss.querySelectorAll("item");

    list.forEach(element =>{
        title_text = element.querySelector("title").textContent;
        date_text = element.querySelector("pubDate").textContent;
        desc_text = element.querySelector("description").textContent.replace(/data-src/g, "src");
        id_text = element.querySelector("guid").textContent.split("#")[1];
        
        date_l = date_text.split(" ");
        index_link = "<li>"+date_l[3] + "/"+ date_l[2] + "/" + date_l[1] +"：<a href='#n-" + id_text +"'>" + title_text +"</a></li>";
        document.querySelector("#mokuji ul").innerHTML = document.querySelector("#mokuji ul").innerHTML + index_link;

        item = document.createElement("div");
        item.setAttribute("class", "content");
        item.setAttribute("id", "n-"+id_text)

        title = document.createElement("div");
        title.setAttribute("class", "content-title");
        title.innerHTML = "<h2>" + title_text + "</h2>";
        item.insertAdjacentElement("beforeend", title);

        date = document.createElement("div");
        date.setAttribute("class", "content-pubdate");
        date.innerHTML = "<p>投稿日：" + date_text + "</p>";
        item.insertAdjacentElement("beforeend", date);

        desc = document.createElement("div");
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

function initialize(){
    getRSS("houchi_news.xml")
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