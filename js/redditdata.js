$(document).ready(() => {
    populateWithRedditData();
});

function populateWithRedditData() {
    let limit = 4;
    let basePageUrl = "https://www.reddit.com/r/business/new.json?limit=".concat(limit.toString());
    let searchParams = new URLSearchParams(window.location.search);
    let after = "";
    let before = "";
    if (searchParams.has("after")) {
        after = "&after=t3_".concat(searchParams.get("after"));
    }

    if (searchParams.has("before")) {
        before = "&before=t3_".concat(searchParams.get("before"));
    }

    let url = basePageUrl.concat(after, before);
    console.log(url);
    $.getJSON(url, "", (returnedData) => {
        let children = returnedData.data.children;
        console.log("Child count: " + children.length);
        let lastId = "";
        let titleKey = "title";
        let submittedByKey = "author";
        let idKey = "id";
        let commentCountKey = "num_comments";
        let firstId = "";
        for (let i = 0; i < children.length; i++) {
            let childData = children[i].data;
            let id = childData[idKey];
            if (firstId.length === 0) firstId = id;
            lastId = id;
            let title = childData[titleKey];
            let submitter = childData[submittedByKey];
            let commentCount = childData[commentCountKey];

            addCard(title, submitter, commentCount, id)
        }
        addButtons(firstId, lastId);
    });
}

function addCard(title, submitter, commentCount, id) { // There's probably a better way to do templating, but I'm rusty with "vanilla" js.
    let column = $(".column");
    let link = 'https://www.reddit.com/r/business/comments/'.concat(id);
    let card = $("<div class = 'card'></div>").appendTo(column);
    let headline = $("<div class='headline'></div>").appendTo(card);
    let headlineString = `<a href = ${link}> <h4>${title}</h4> </a>`;
    $(headlineString).appendTo(headline);
    $("<div class ='dashed-line'></div>").appendTo(card);
    let lower = $("<div class = 'lower'></div>").appendTo(card);
    $(`<div class = 'comment-count'>${commentCount} comments</div>`).appendTo(lower);
    $(`<div class = 'submitted-by'>submitted by ${submitter}</div>`).appendTo(lower);
}

function addButtons(firstId, lastId) {
    let pathName = $(window)[0].location.pathname;
    let buttonsContainer = $("<div class = 'buttons'></div>").appendTo($(".column"));

    let prevPath = `${pathName}?before=${firstId}`;
    let onclickPrev = `onclick=location.href='${prevPath}'`;
    let prev = $(`<button class='previous' ${onclickPrev}></button>`).appendTo(buttonsContainer);
    $("<span class = 'previous-text'>previous</span>").appendTo(prev);

    let nextPath = `${pathName}?after=${lastId}`;
    let onclickNext = `onclick=location.href='${nextPath}'`;
    let next = $(`<button class = 'next' ${onclickNext}></button>`).appendTo(buttonsContainer);
    $("<span class = 'next-text'>next</span>").appendTo(next);
}


