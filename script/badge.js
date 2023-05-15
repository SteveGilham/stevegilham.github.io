(function() {

var $b = {
toEscapeRep : function (c) { return '&#' + c+ ';'; },
getMailComponents: function (toRep) {
  var data = [
      638, 626, 634, 639, 615, 636, 553, 612,
      630, 625, 638, 626, 608, 615, 630, 609,
      595, 608, 615, 630, 613, 630, 628, 634,
      639, 635, 626, 638, 573, 624, 636, 638,
      556, 608, 614, 625, 633, 630, 624, 615,
      558, 608, 615, 630, 613, 630, 628, 634,
      639, 635, 626, 638, 573, 624, 636, 638,
      566, 545, 547, 612, 630, 625, 608, 634,
      615, 630, 531, 638, 626, 634, 639, 563,
      638, 630, 531, 612, 630, 625, 638, 626,
      608, 615, 630, 609, 595, 608, 615, 630,
      613, 630, 628, 634, 639, 635, 626, 638,
      573, 624, 636, 638, 531
    ];
    var idx = 0, n = data[data.length - 1];
    var components = {  link: '',   title: '',   text: ''  };
    while (data[idx] !== n) { components.link = components.link + toRep(data[idx++] ^ n);  }
    idx++;
    while (data[idx] !== n) { components.title = components.title + toRep(data[idx++] ^ n);  }
    idx++;
    while (data[idx] !== n) { components.text = components.text + toRep((data[idx++] ^ n)); }
    return components;
},
getMailtext: function () {
    var c = $b.getMailComponents($b.toEscapeRep);
    return  '<a href = "' + components.link + '" title = "' + components.title + '">' + components.text + '</a>';
},
doMailFor: function (who) {
    if (!document.layers)
    {
        var p  =  document.getElementById('mailtag');
        if (!p)  { return; }
        p.style.textAlign  =  "center";
        p.removeChild(p.firstChild);
        p.appendChild(document.createTextNode(unescape(who)));
        p.appendChild(document.createElement('a'));

        var c = $b.getMailComponents(String.fromCharCode);
        p.lastChild.setAttribute('href', c.link);
        p.lastChild.setAttribute('title', c.title);
        p.lastChild.appendChild(document.createTextNode(c.text));
    }
},
doMail:  function () { $b.doMailFor('This document maintained by domain webmaster \u2014 '); },
/* 
createElement function found at http://simon.incutio.com/archive/2003/06/15/javascriptWithXML
*/
createElement: function (element) {
	if (typeof document.createElementNS  !==  'undefined') {
		return document.createElementNS('http://www.w3.org/1999/xhtml', element);
	}
	if (typeof document.createElement  !==  'undefined') {
		return document.createElement(element);
	}
	return false;
},
doCopyright: function () 
{
    var p  =  $b.createElement("p");
    if (p) 
    {
        var year  =  new Date().getFullYear();
        var text  =  "Content copyright \u00A9 Steve Gilham 1997\u2013" + year;
        var t  =  document.createTextNode(text);
        p.appendChild(t);
        p.style.textAlign  =  "center";
        var point = document.getElementsByTagName("footer");
        point[point.length-1].appendChild(p);
    }
},
init:  function() {
 window.pre_tines_onload  =  window.onload;
 window.onload  =  function ()
 {
    $b.doMail();
    $b.doCopyright();
    if (window.pre_tines_onload) 
    {
        window.pre_tines_onload();
    }
 };
}
}; // end module

  $b.init();
})();