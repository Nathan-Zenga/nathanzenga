/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.32
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////
!function(r,d){"use strict";function i(i){for(var e={},o=0;o<i.length;o++)e[i[o].toUpperCase()]=i[o];return e}function M(i,e){return typeof i===l&&-1!==j(e).indexOf(j(i))}function n(i,e){if(typeof i===l)return i=i.replace(/^\s\s*/,b).replace(/\s\s*$/,b),typeof e==w?i:i.substring(0,350)}function t(i,e){for(var o,a,r,n,t,s=0;s<e.length&&!n;){for(var b=e[s],w=e[s+1],l=o=0;l<b.length&&!n;)if(n=b[l++].exec(i))for(a=0;a<w.length;a++)t=n[++o],typeof(r=w[a])===c&&0<r.length?2===r.length?typeof r[1]==u?this[r[0]]=r[1].call(this,t):this[r[0]]=r[1]:3===r.length?typeof r[1]!==u||r[1].exec&&r[1].test?this[r[0]]=t?t.replace(r[1],r[2]):d:this[r[0]]=t?r[1].call(this,t,r[2]):d:4===r.length&&(this[r[0]]=t?r[3].call(this,t.replace(r[1],r[2])):d):this[r]=t||d;s+=2}}function e(i,e){for(var o in e)if(typeof e[o]===c&&0<e[o].length){for(var a=0;a<e[o].length;a++)if(M(e[o][a],i))return"?"===o?d:o}else if(M(e[o],i))return"?"===o?d:o;return i}function s(i,e){if(typeof i===c&&(e=i,i=d),!(this instanceof s))return new s(i,e).getResult();var o=i||(typeof r!=w&&r.navigator&&r.navigator.userAgent?r.navigator.userAgent:b),a=e?function(i,e){var o,a={};for(o in i)e[o]&&e[o].length%2==0?a[o]=e[o].concat(i[o]):a[o]=i[o];return a}(H,e):H;return this.getBrowser=function(){var i,e={};return e[m]=d,e[g]=d,t.call(e,o,a.browser),e.major=typeof(i=e.version)===l?i.replace(/[^\d\.]/g,b).split(".")[0]:d,e},this.getCPU=function(){var i={};return i[v]=d,t.call(i,o,a.cpu),i},this.getDevice=function(){var i={};return i[h]=d,i[p]=d,i[f]=d,t.call(i,o,a.device),i},this.getEngine=function(){var i={};return i[m]=d,i[g]=d,t.call(i,o,a.engine),i},this.getOS=function(){var i={};return i[m]=d,i[g]=d,t.call(i,o,a.os),i},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return o},this.setUA=function(i){return o=typeof i===l&&350<i.length?n(i,350):i,this},this.setUA(o),this}var a,b="",u="function",w="undefined",c="object",l="string",p="model",m="name",f="type",h="vendor",g="version",v="architecture",o="console",x="mobile",k="tablet",y="smarttv",_="wearable",P="embedded",T="Amazon",q="Apple",V="ASUS",B="BlackBerry",S="Browser",z="Chrome",N="Firefox",A="Google",D="Huawei",C="LG",E="Microsoft",I="Motorola",O="Opera",W="Samsung",F="Sharp",U="Sony",G="Xiaomi",L="Zebra",Z="Facebook",j=function(i){return i.toLowerCase()},$={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},H={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[g,[m,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[g,[m,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[m,g],[/opios[\/ ]+([\w\.]+)/i],[g,[m,O+" Mini"]],[/\bopr\/([\w\.]+)/i],[g,[m,O]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,/(weibo)__([\d\.]+)/i],[m,g],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[g,[m,"UC"+S]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i],[g,[m,"WeChat(Win) Desktop"]],[/micromessenger\/([\w\.]+)/i],[g,[m,"WeChat"]],[/konqueror\/([\w\.]+)/i],[g,[m,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[g,[m,"IE"]],[/yabrowser\/([\w\.]+)/i],[g,[m,"Yandex"]],[/(avast|avg)\/([\w\.]+)/i],[[m,/(.+)/,"$1 Secure "+S],g],[/\bfocus\/([\w\.]+)/i],[g,[m,N+" Focus"]],[/\bopt\/([\w\.]+)/i],[g,[m,O+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[g,[m,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[g,[m,"Dolphin"]],[/coast\/([\w\.]+)/i],[g,[m,O+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[g,[m,"MIUI "+S]],[/fxios\/([-\w\.]+)/i],[g,[m,N]],[/\bqihu|(qi?ho?o?|360)browser/i],[[m,"360 "+S]],[/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],[[m,/(.+)/,"$1 "+S],g],[/(comodo_dragon)\/([\w\.]+)/i],[[m,/_/g," "],g],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],[m,g],[/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i,/\[(linkedin)app\]/i],[m],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[m,Z],g],[/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram)[\/ ]([-\w\.]+)/i],[m,g],[/\bgsa\/([\w\.]+) .*safari\//i],[g,[m,"GSA"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[g,[m,z+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[m,z+" WebView"],g],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[g,[m,"Android "+S]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[m,g],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[g,[m,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[g,m],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[m,[g,e,{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(webkit|khtml)\/([\w\.]+)/i],[m,g],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[m,"Netscape"],g],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[g,[m,N+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i],[m,g]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[v,"amd64"]],[/(ia32(?=;))/i],[[v,j]],[/((?:i[346]|x)86)[;\)]/i],[[v,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[v,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[v,"armhf"]],[/windows (ce|mobile); ppc;/i],[[v,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[v,/ower/,b,j]],[/(sun4\w)[;\)]/i],[[v,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[v,j]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[p,[h,W],[f,k]],[/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[p,[h,W],[f,x]],[/\((ip(?:hone|od)[\w ]*);/i],[p,[h,q],[f,x]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[p,[h,q],[f,k]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[p,[h,D],[f,k]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[p,[h,D],[f,x]],[/\b(poco[\w ]+)(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[p,/_/g," "],[h,G],[f,x]],[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[p,/_/g," "],[h,G],[f,k]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[p,[h,"OPPO"],[f,x]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[p,[h,"Vivo"],[f,x]],[/\b(rmx[12]\d{3})(?: bui|;|\))/i],[p,[h,"Realme"],[f,x]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[p,[h,I],[f,x]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[p,[h,I],[f,k]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[p,[h,C],[f,k]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[p,[h,C],[f,x]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[p,[h,"Lenovo"],[f,k]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[p,/_/g," "],[h,"Nokia"],[f,x]],[/(pixel c)\b/i],[p,[h,A],[f,k]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[p,[h,A],[f,x]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[p,[h,U],[f,x]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[p,"Xperia Tablet"],[h,U],[f,k]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[p,[h,"OnePlus"],[f,x]],[/(alexa)webm/i,/(kf[a-z]{2}wi)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[p,[h,T],[f,k]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[p,/(.+)/g,"Fire Phone $1"],[h,T],[f,x]],[/(playbook);[-\w\),; ]+(rim)/i],[p,h,[f,k]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[p,[h,B],[f,x]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[p,[h,V],[f,k]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[p,[h,V],[f,x]],[/(nexus 9)/i],[p,[h,"HTC"],[f,k]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i],[h,[p,/_/g," "],[f,x]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[p,[h,"Acer"],[f,k]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[p,[h,"Meizu"],[f,x]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[p,[h,F],[f,x]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[h,p,[f,x]],[/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[h,p,[f,k]],[/(surface duo)/i],[p,[h,E],[f,k]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[p,[h,"Fairphone"],[f,x]],[/(u304aa)/i],[p,[h,"AT&T"],[f,x]],[/\bsie-(\w*)/i],[p,[h,"Siemens"],[f,x]],[/\b(rct\w+) b/i],[p,[h,"RCA"],[f,k]],[/\b(venue[\d ]{2,7}) b/i],[p,[h,"Dell"],[f,k]],[/\b(q(?:mv|ta)\w+) b/i],[p,[h,"Verizon"],[f,k]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[p,[h,"Barnes & Noble"],[f,k]],[/\b(tm\d{3}\w+) b/i],[p,[h,"NuVision"],[f,k]],[/\b(k88) b/i],[p,[h,"ZTE"],[f,k]],[/\b(nx\d{3}j) b/i],[p,[h,"ZTE"],[f,x]],[/\b(gen\d{3}) b.+49h/i],[p,[h,"Swiss"],[f,x]],[/\b(zur\d{3}) b/i],[p,[h,"Swiss"],[f,k]],[/\b((zeki)?tb.*\b) b/i],[p,[h,"Zeki"],[f,k]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[h,"Dragon Touch"],p,[f,k]],[/\b(ns-?\w{0,9}) b/i],[p,[h,"Insignia"],[f,k]],[/\b((nxa|next)-?\w{0,9}) b/i],[p,[h,"NextBook"],[f,k]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[h,"Voice"],p,[f,x]],[/\b(lvtel\-)?(v1[12]) b/i],[[h,"LvTel"],p,[f,x]],[/\b(ph-1) /i],[p,[h,"Essential"],[f,x]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[p,[h,"Envizen"],[f,k]],[/\b(trio[-\w\. ]+) b/i],[p,[h,"MachSpeed"],[f,k]],[/\btu_(1491) b/i],[p,[h,"Rotor"],[f,k]],[/(shield[\w ]+) b/i],[p,[h,"Nvidia"],[f,k]],[/(sprint) (\w+)/i],[h,p,[f,x]],[/(kin\.[onetw]{3})/i],[[p,/\./g," "],[h,E],[f,x]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[p,[h,L],[f,k]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[p,[h,L],[f,x]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[h,p,[f,o]],[/droid.+; (shield) bui/i],[p,[h,"Nvidia"],[f,o]],[/(playstation [345portablevi]+)/i],[p,[h,U],[f,o]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[p,[h,E],[f,o]],[/smart-tv.+(samsung)/i],[h,[f,y]],[/hbbtv.+maple;(\d+)/i],[[p,/^/,"SmartTV"],[h,W],[f,y]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[h,C],[f,y]],[/(apple) ?tv/i],[h,[p,q+" TV"],[f,y]],[/crkey/i],[[p,z+"cast"],[h,A],[f,y]],[/droid.+aft(\w)( bui|\))/i],[p,[h,T],[f,y]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[p,[h,F],[f,y]],[/(bravia[\w ]+)( bui|\))/i],[p,[h,U],[f,y]],[/(mitv-\w{5}) bui/i],[p,[h,G],[f,y]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i],[[h,n],[p,n],[f,y]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[f,y]],[/((pebble))app/i],[h,p,[f,_]],[/droid.+; (glass) \d/i],[p,[h,A],[f,_]],[/droid.+; (wt63?0{2,3})\)/i],[p,[h,L],[f,_]],[/(quest( 2)?)/i],[p,[h,Z],[f,_]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[h,[f,P]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],[p,[f,x]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[p,[f,k]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[f,k]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[f,x]],[/(android[-\w\. ]{0,9});.+buil/i],[p,[h,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[g,[m,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[g,[m,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i],[m,g],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[g,m]],os:[[/microsoft (windows) (vista|xp)/i],[m,g],[/(windows) nt 6\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],[m,[g,e,$]],[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[m,"Windows"],[g,e,$]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/cfnetwork\/.+darwin/i],[[g,/_/g,"."],[m,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[m,"Mac OS"],[g,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[g,m],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[m,g],[/\(bb(10);/i],[g,[m,B]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[g,[m,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[g,[m,N+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[g,[m,"webOS"]],[/crkey\/([\d\.]+)/i],[g,[m,z+"cast"]],[/(cros) [\w]+ ([\w\.]+\w)/i],[[m,"Chromium OS"],g],[/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[m,g],[/(sunos) ?([\w\.\d]*)/i],[[m,"Solaris"],g],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,/(unix) ?([\w\.]*)/i],[m,g]]},R=(s.VERSION="1.0.32",s.BROWSER=i([m,g,"major"]),s.CPU=i([v]),s.DEVICE=i([p,h,f,o,x,y,k,_,P]),s.ENGINE=s.OS=i([m,g]),typeof exports!=w?(exports=typeof module!=w&&module.exports?module.exports=s:exports).UAParser=s:typeof define===u&&define.amd?define(function(){return s}):typeof r!=w&&(r.UAParser=s),typeof r!=w&&(r.jQuery||r.Zepto));R&&!R.ua&&(a=new s,R.ua=a.getResult(),R.ua.get=function(){return a.getUA()},R.ua.set=function(i){a.setUA(i);var e,o=a.getResult();for(e in o)R.ua[e]=o[e]})}("object"==typeof window?window:this);