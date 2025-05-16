let myHtmlEncode = function(str){
    return String(str).replace(/[^\w. ]/gi, function(c){
        return '&#'+c.charCodeAt(0)+';';
    });
}

let jsEscape2 = function (str){
    return String(str).replace(/[^\w. ]/gi, function(c){
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
    });
}

function jsEscape3(text) {
    const entities = {
        '\'': '&apos;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
        '\\': '&bslash;',
        '`': '&grave;'
      };
    
      const pattern = /['"&<>\\]/g;
      return text.replace(pattern, (match) => entities[match]);
  }

function toPlainText(text=""){
    return text.replace(/[^\p{L}\p{N}\s.,!?;:'"-]/gu, '');
}

/*  &prime; ′
* &rsquo; ’
* &rdquo; ”
* &rarr; \ →
* &lsaquo; ‹
* &rsaquo; ›
*/
let jsEscape = function (str){
    const entities = {
        '`' : '&prime;',
        '\'': '&prime;',
        '"' : '&rdquo;',
        '<' : '&lsaquo;',
        '>' : '&gt;',
        '\\': '&rarr;',    
    };
    return String(str).replace(/[`'"<>\\]/g, (match) => entities[match]);
}
var AntiHacking = {
    htmlEncode: myHtmlEncode,
    jsEscape: jsEscape,
    toPlainText: toPlainText,
    sanitize: DOMPurify.sanitize,
};