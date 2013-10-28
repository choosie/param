/*!
	Autosize v1.17.8 - 2013-09-07
	Automatically adjust textarea height based on user input.
	(c) 2013 Jack Moore - http://www.jacklmoore.com/autosize
	license: http://www.opensource.org/licenses/mit-license.php
*/(function(e) {
    typeof define == "function" && define.amd ? define([ "jquery" ], e) : e(window.jQuery || window.$);
})(function(e) {
    var t = {
        className: "autosizejs",
        append: "",
        callback: !1,
        resizeDelay: 10
    }, n = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>', r = [ "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "textTransform", "wordSpacing", "textIndent" ], i, s = e(n).data("autosize", !0)[0];
    s.style.lineHeight = "99px";
    e(s).css("lineHeight") === "99px" && r.push("lineHeight");
    s.style.lineHeight = "";
    e.fn.autosize = function(n) {
        if (!this.length) return this;
        n = e.extend({}, t, n || {});
        s.parentNode !== document.body && e(document.body).append(s);
        return this.each(function() {
            function d() {
                var n, r;
                if ("getComputedStyle" in window) {
                    n = window.getComputedStyle(t);
                    r = t.getBoundingClientRect().width;
                    e.each([ "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth" ], function(e, t) {
                        r -= parseInt(n[t], 10);
                    });
                    s.style.width = r + "px";
                } else s.style.width = Math.max(o.width(), 0) + "px";
            }
            function v() {
                var a = {};
                i = t;
                s.className = n.className;
                u = parseInt(o.css("maxHeight"), 10);
                e.each(r, function(e, t) {
                    a[t] = o.css(t);
                });
                e(s).css(a);
                d();
                if (window.chrome) {
                    var f = t.style.width;
                    t.style.width = "0px";
                    var l = t.offsetWidth;
                    t.style.width = f;
                }
            }
            function m() {
                var e, r;
                i !== t ? v() : d();
                s.value = t.value + n.append;
                s.style.overflowY = t.style.overflowY;
                r = parseInt(t.style.height, 10);
                s.scrollTop = 0;
                s.scrollTop = 9e4;
                e = s.scrollTop;
                if (u && e > u) {
                    t.style.overflowY = "scroll";
                    e = u;
                } else {
                    t.style.overflowY = "hidden";
                    e < a && (e = a);
                }
                e += f;
                if (r !== e) {
                    t.style.height = e + "px";
                    l && n.callback.call(t, t);
                }
            }
            function g() {
                clearTimeout(h);
                h = setTimeout(function() {
                    var e = o.width();
                    if (e !== p) {
                        p = e;
                        m();
                    }
                }, parseInt(n.resizeDelay, 10));
            }
            var t = this, o = e(t), u, a, f = 0, l = e.isFunction(n.callback), c = {
                height: t.style.height,
                overflow: t.style.overflow,
                overflowY: t.style.overflowY,
                wordWrap: t.style.wordWrap,
                resize: t.style.resize
            }, h, p = o.width();
            if (o.data("autosize")) return;
            o.data("autosize", !0);
            if (o.css("box-sizing") === "border-box" || o.css("-moz-box-sizing") === "border-box" || o.css("-webkit-box-sizing") === "border-box") f = o.outerHeight() - o.height();
            a = Math.max(parseInt(o.css("minHeight"), 10) - f || 0, o.height());
            o.css({
                overflow: "hidden",
                overflowY: "hidden",
                wordWrap: "break-word",
                resize: o.css("resize") === "none" || o.css("resize") === "vertical" ? "none" : "horizontal"
            });
            "onpropertychange" in t ? "oninput" in t ? o.on("input.autosize keyup.autosize", m) : o.on("propertychange.autosize", function() {
                event.propertyName === "value" && m();
            }) : o.on("input.autosize", m);
            n.resizeDelay !== !1 && e(window).on("resize.autosize", g);
            o.on("autosize.resize", m);
            o.on("autosize.resizeIncludeStyle", function() {
                i = null;
                m();
            });
            o.on("autosize.destroy", function() {
                i = null;
                clearTimeout(h);
                e(window).off("resize", g);
                o.off("autosize").off(".autosize").css(c).removeData("autosize");
            });
            m();
        });
    };
});