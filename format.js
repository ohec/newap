var info = [{
    "exampleUrl":  "http://rlsbb.ru/category/tv-shows/",
    "url":         "^http://rlsbb.ru/category/tv-shows/",
    "pageElement": "//div[@class='post']",
    "nextLink":    "//a[(text()='Older Entries')]",
},{
    "exampleUrl":  "http://scene-rls.net/category/tvshows/page/4/",
    "url":         "^http://scene-rls.net/category/tvshows/",
    "pageElement": "//div[@class='post']",
    "nextLink":    "//span[@class='zmg_pn_next']/a",
}, {
    "url":         "^http://allkindsofgirls.com/members/",
    "nextLink":    "//a[(text()='Next Page>')]",
    "pageElement": "//table[@width='750']/tbody",
    "exampleUrl":  "http://allkindsofgirls.com/members/index.asp?Page=1",
}, {
    "url":         "^(http|https)://(.*)jetbrains(.*)/(.*).+",  //"url":         "https://plugins.jetbrains.com/*", //"http(s)?://plugins.jetbrains.com/(.*)?(idea)\\S+",
    "nextLink":    "//a[@class='nextLink']",
    "pageElement": "//div[@class='g-row _justify-center']",
    "exampleUrl":  "https://plugins.jetbrains.com/new-or-updated/idea?correctionAllowed=false&search=&offset=20&max=10&orderBy=update+date&title=New+or+Updated",
}];

for (var obj in info) {
    console.log(JSON.stringify(info[obj].url));
}