/**
* One of the lightest DOM query library, which has number of reuable function, which can be used to manipulate DOM
*/
var queryConfig = {
    addEventListener: document.addEventListener,
    removeEventListener: document.removeEventListener,
    createEvent: "createEvent" in document,
};
var query = (function (document) {
    var readyCallbacks = [],
        callbacks = [];
    function find(selector, object) {
        if (object) {
            return object.elements[0].querySelectorAll(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    }
    function liteJSElement(selector) {
        if (typeof selector == "object") {
            switch (selector) {
                case document: {
                    this.ready = function (callback) {
                        readyCallbacks.push(callback);
                    }
                }
            }
            if (selector.length >= 0) {
                this.elements = selector;
            } else {
                this.elements = [selector];
            }
        } else if (typeof selector === "string") {
            this.elements = find(selector);
        } else {
            this.elements = selector;
        }
    }
    liteJSElement.prototype = {
        find: function (selector) {
            return new liteJSElement(find(selector, this));
        },
        get: function(index){
            return this.elements[index];
        },
        first: function (selector) {
            return new liteJSElement(this.elements[0]);
        },
        addClass: function (className) {
            var length = this.elements.length,
                elements = this.elements;
            for (var i = 0; i < length; i++) {
                if (elements[i].className.indexOf(className) == -1) {
                    elements[i].className = elements[i].className.length > 0 ? elements[i].className + " " + className : className;
                }
            }
            return this;
        },
        removeClass: function (className) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                if (this.elements[i].className.length) {
                    this.elements[i].className = this.elements[i].className.replace(className, "");
                }
            }
            return this;
        },
        hasClass: function (className) {
            return this.elements[0].className.indexOf(className) > -1;
        },
        append: function (html) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                if (typeof html === "string") {
                    this.elements[i].innerHTML = this.elements[i].innerHTML + html;
                } else {
                    if (html.elements.length & html.elements.length > 0)
                        this.elements[i].appendChild(html.elements[0]);
                }
            }
            return this;
        },
        html: function (html) {
            if (html || html === "") {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    if (typeof html === "string") {
                        this.elements[i].innerHTML = html;
                    } else {
                        this.elements[i].innerHTML = "";
                        if (html.elements.length & html.elements.length > 0)
                            this.elements[i].appendChild(html.elements[0]);
                    }
                }
                return this;
            } else {
                return this.elements[0].innerHTML;
            }
        },
        on: function (event, callback) {
            for (var i = 0; i < this.elements.length; i++) {
                if (queryConfig.addEventListener)
                    this.elements[i].addEventListener(event, callback);
                else
                    this.elements[i].attachEvent("on" + event, callback);
            }
        },
        off: function (event, callback) {
            for (var i = 0; i < this.elements.length; i++) {
                if (queryConfig.removeEventListener) {
                    this.elements[i].removeEventListener(event, callback);
                }
                else
                    this.elements[i].detachEvent("on" + event, callback);
            }
        },
        each: function (callback) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                callback(this.elements[i], i);
            }
        },
        trigger: function (event, data) {
            for (var i = 0; i < this.elements.length; i++) {
                if (queryConfig.createEvent) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent(event, false, true);
                    this.elements[i].dispatchEvent(evt, data);
                }
                else {
                    this.elements[i].fireEvent("on" + event, data);
                }
            }
        },
        prop: function (name, value) {
            if (value) {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    this.elements[i][name] = value;
                }
                return this;
            } else {
                return this.elements[0][name];
            }
        },
        attr: function (name, value) {
            if (value) {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    this.elements[i].setAttribute(name, value);
                }
                return this;
            } else {
                return this.elements[0].getAttribute(name);
            }
        },
        data: function (name, value) {
            return this.attr("data-" + name, value);
        },
        css: function (obj, value) {
            if (typeof obj == "string") {
                this.each(function (element) {
                    element.style[obj] = value;
                });
            } else {
                for (var key in obj) {
                    this.each(function (element) {
                        element.style[key] = obj[key];
                    });
                }
            }
        },
        parent: function () {
            return new liteJSElement(this.elements[0].parentElement);
        }
    }
    document.addEventListener("DOMContentLoaded", function () {
        for (var i = 0; i < readyCallbacks.length; i++) {
            readyCallbacks[i].call();
        }
    });
    var queryFunc = function (selector) {
        return new liteJSElement(selector);
    };
    queryFunc.extend = function () {
        var extended = {};
        for (key in arguments) {
            var argument = arguments[key];
            for (prop in argument) {
                if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                    extended[prop] = argument[prop];
                }
            }
        }
        return extended;
    };
    //www.test.com?name=abc&age=30; returns {name:abc, age:30}
    queryFunc.queryParam = function (url) {
        var params = {}, pieces, parts, i;
        var question = url.lastIndexOf("?");
        if (question !== -1) {
            url = url.slice(question + 1);
            pieces = url.split("&");
            for (i = 0; i < pieces.length; i++) {
                parts = pieces[i].split("=");
                if (parts.length < 2) {
                    parts.push("");
                }
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        }
        return params;
    }
    queryFunc.new = function (element, queryElement) {
        if (queryElement) {
            return queryFunc(document.createElement(element));
        }
        return document.createElement(element);
    };
    return queryFunc;
}(document));
