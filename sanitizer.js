function sanitize_anchor(anchor) {
    if (anchor && anchor.tagName === "A") {
        const re_link = /https:\/\/l.facebook.com\/l.php(.*)[&\?]u=(.*)&(.*)/;
        const re_data = /data-(.*)/;
        let new_link = anchor.href.replace(re_link, "$2");
        if (new_link) {
            anchor.href = decodeURIComponent(new_link);
            let matches = [];
            for (let attr of anchor.attributes) {
                if (attr.name.match(re_data)) {
                matches.push(attr.name);
                }
            }
            for (let attr_name of matches) {
                anchor.removeAttribute(attr_name);
                console.log("removed", attr_name)
            }
        }
    }
}
function sanitize(anchors) {
    for (let a of anchors) {
      sanitize_anchor(a);
    }
}

window.onload = function() {
    document.addEventListener('click', function(e) {
        e = e || window.event;
        let target = e.target || e.srcElement;
        sanitize_anchor(target);
    }, false);
    sanitize(document.getElementsByTagName("a"));
}


