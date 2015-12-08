/*global $l */
/* eslint: no-unused-vars: 1 */


(function() {
  'use strict';
  function DOMNodeCollection(array){
    this.HTMLels = array;
  }

  var que = [];
  window.$l = function (arg){
    if (arg instanceof Function) {
      que.push(arg);
    }

    if (typeof arg === 'string'){
      var nodeList = document.querySelectorAll(arg);
      var nodeListArray = [].slice.call(nodeList);
      return new DOMNodeCollection(nodeListArray);
    } else if (arg instanceof HTMLElement ){
      var HTMLArray = [].slice.call(arg);
      return new DOMNodeCollection(HTMLArray);
    }
  };

  if (document.readyState === "complete") {
    // this code isn't doing anything
    que.forEach(function(fn) {
      fn();
    });
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      que.forEach(function(fn) {
        fn();
      });
    });
  }

  // this callback will never be called if document is already ready
  $l(function () {});

  var extend = $l.extend = function (base) {
    var extensions = Array.prototype.slice.call(arguments, 1);

    extensions.forEach(function(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            base[key] = obj[key];
          }
        }
      });
  };

  var ajax = $l.ajax = function(options){
    var deFault = {
      method: 'GET',
      success: function(){console.log("success");},
      error: function(){console.log("error");},
      data: null,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      url: ""
    };

    extend(deFault, options);

    function reqListener () {
      console.log(this.responseText);
    }

    var req = new XMLHttpRequest();
    req.addEventListener("load", reqListener);
    req.open(deFault['method'], deFault['url']);
    req.send();
  };
    /* DRYs out the code
      arg = document.querySelectorAll(arg);
    var newArray = [].slice.call(arg);
    return new DOMNodeCollection(newArray);
    */

  DOMNodeCollection.prototype.html = function (string) {
    if (typeof string === "undefined") {
      return this.HTMLels[0].innerHTML;
    }

    this.HTMLels.forEach(function(el) {
      el.innerHTML = string;
    });
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html('');
  };

  DOMNodeCollection.prototype.append = function (arg) {
    if(typeof arg === 'string'){
      this.HTMLels.forEach(function(el) {
        el.innerHTML += arg;
      });
    } else if(arg instanceof HTMLElement){
      // append to first only
      this.HTMLels.forEach(function(el) {
        el.appendChild(arg);
      });
    } else if(arg instanceof DOMNodeCollection){
      this.HTMLels.forEach(function(myEl) {
        arg.HTMLels.forEach(function(el) {
          myEl.appendChild(el);
        });
      });
    }
  };

  DOMNodeCollection.prototype.attr = function (string) {
      // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
    for (var i = 0; i < this.HTMLels.length; i++) {
      for (var j = 0; i < this.HTMLels[i].attributes.length; j++) {
        if (this.HTMLels[i].attributes[j].name === string){
          return this.HTMLels[i].attributes[j].value;
        }
      }
    }
  };

  DOMNodeCollection.prototype.addClass = function (newClass) {
    this.HTMLels.forEach( function(el){
      if (el.hasAttribute("class")) {
        var oldClass = el.getAttribute("class");
        el.setAttribute("class", oldClass + " " + newClass);
      } else {
        el.setAttribute("class", newClass);
      }
    });
  };

  DOMNodeCollection.prototype.removeClass = function (oldClass) {
    this.HTMLels.forEach( function(el){
      if (el.hasAttribute("class")) {
        var classArray = el.getAttribute("class").split(' ');
      }

      for (var i = 0; i < classArray.length; i++) {
        if (classArray[i] === oldClass) {
          classArray.splice(i, 1);
          el.setAttribute("class", classArray.join(' '));
          return;
        }
      }
    });
  };

  DOMNodeCollection.prototype.children = function () {
    var allMyChildren = [];
    this.HTMLels.forEach( function(el){
      if(el.children.length >0){
        allMyChildren = allMyChildren.concat(el.children);
      }
    });
    return new DOMNodeCollection(allMyChildren);
  };

  DOMNodeCollection.prototype.parent = function () {
    var myThreeDads = [];

    this.HTMLels.forEach( function(el){
        myThreeDads = myThreeDads.concat(el.parentNode);
    });
    return new DOMNodeCollection(myThreeDads);
  };

  DOMNodeCollection.prototype.find = function (arg) {
    var matches = [];
    var nodeList = document.querySelectorAll(arg);
    var nodeListArray = [].slice.call(nodeList);
    this.HTMLels.forEach( function(el){
      nodeListArray.forEach(function(node){
        if (el.contains(node)){
          matches.push(node);
        }
      });
    });
    return new DOMNodeCollection(matches);
  };

  DOMNodeCollection.prototype.remove = function (arg) {
    var matched = null;

    if (typeof arg !== "undefined") {
      matched = this.find(arg).HTMLels;
    } else {
      matched = this.HTMLels;
    }

    matched.forEach(function(el) {
      el.parentNode.removeChild(el);
    });
  };

  DOMNodeCollection.prototype.on = function (type, fn) {
    this.HTMLels.forEach( function(el){
      el.addEventListener( type, fn);
    });
  };

  DOMNodeCollection.prototype.off = function (type, fn) {
    this.HTMLels.forEach( function(el){
      el.removeEventListener( type, fn);
    });
  };
}());
