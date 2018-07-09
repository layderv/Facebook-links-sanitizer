let sanitized_els = new Set();

function sanitizing(el) {
    if (! sanitized_els.has(el)) {
        sanitized_els.add(el);
        return true;
    }
    return false;
}

function sanitize_anchor(anchor) {
    if (anchor && anchor.tagName === "A") {
        if (sanitizing(anchor)) {
            const re_link = /https:\/\/l.facebook.com\/l.php(.*)[&\?]u=([^&]*)/;
            const re_data = /data-(.*)/;
            let matches = anchor.href.match(re_link);
            let new_link = matches && matches.length > 2 ? matches[2] : null;
            if (new_link) {
                anchor.href = decodeURIComponent(new_link);
                let matches = [];
                for (const attr of anchor.attributes) {
                    if (attr.name.match(re_data)) {
                        matches.push(attr.name);
                    }
                }
                for (const attr_name of matches) {
                    anchor.removeAttribute(attr_name);
                }
            }
        }
    }
}

function sanitize_anchors(anchors) {
    if (sanitizing(anchors)) {
        for (let a of anchors) {
            sanitize_anchor(a);
        }
    }
}

function sanitize_rec(el) {
    if (el && sanitizing(el)) {
        sanitize_anchor(el);
        for (let child of el.children) {
            sanitize_rec(child);
        }
    }
}

document.addEventListener('click', function(e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    sanitize_rec(target);
}, false);

document.addEventListener('mouseover', function(e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    sanitize_rec(target);
}, false);

window.onload = function() {
    sanitize_anchors(document.getElementsByTagName("a"));
}
