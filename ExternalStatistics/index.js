const _0xe5f0c1=_0xa162;function _0x820e(){const _0x1cc31c=['GetProjectData','https://dbd-external-stats.assistants.ga','7nhbpwr','exports','6353868RRxhjN','97324porUZz','application/json','13580685zVhFHd','discord-dashboard','57yqEcBq','10020248zvSDLM','POST','87072ZgRXQv','31216250tbqXkM','993531koTeDC','version','node-fetch','345xHEeSv','/registerUser','stringify'];_0x820e=function(){return _0x1cc31c;};return _0x820e();}(function(_0xba7f3b,_0x101176){const _0xff503f=_0xa162,_0xae6847=_0xba7f3b();while(!![]){try{const _0x4e9ded=-parseInt(_0xff503f(0x19e))/0x1+parseInt(_0xff503f(0x19c))/0x2*(-parseInt(_0xff503f(0x199))/0x3)+parseInt(_0xff503f(0x195))/0x4*(-parseInt(_0xff503f(0x18d))/0x5)+parseInt(_0xff503f(0x194))/0x6+parseInt(_0xff503f(0x192))/0x7*(-parseInt(_0xff503f(0x19a))/0x8)+parseInt(_0xff503f(0x197))/0x9+parseInt(_0xff503f(0x19d))/0xa;if(_0x4e9ded===_0x101176)break;else _0xae6847['push'](_0xae6847['shift']());}catch(_0x3496e6){_0xae6847['push'](_0xae6847['shift']());}}}(_0x820e,0xe4e0b));const fetch=require(_0xe5f0c1(0x18c)),fs=require('fs'),DiscordDashboardPP=require('discord-dashboard-pp-system'),PPManager=new DiscordDashboardPP['PPManager']({},{}),projectData=PPManager[_0xe5f0c1(0x190)]();function _0xa162(_0x4facf3,_0x5ea72f){const _0x820eab=_0x820e();return _0xa162=function(_0xa1623f,_0x3f13e4){_0xa1623f=_0xa1623f-0x18b;let _0x416fe6=_0x820eab[_0xa1623f];return _0x416fe6;},_0xa162(_0x4facf3,_0x5ea72f);}function send(_0x106b24,_0x4a35d2){const _0x3c4eab=_0xe5f0c1;try{fetch(_0x3c4eab(0x191)+_0x106b24,{'method':_0x3c4eab(0x19b),'body':JSON[_0x3c4eab(0x18f)](_0x4a35d2),'headers':{'Content-Type':_0x3c4eab(0x196)}});}catch(_0xff4abb){}}module[_0xe5f0c1(0x193)]={'registerProject':(_0x2a210a,_0x2a168d=projectData['id'],_0x23f09d=projectData['name'],_0x5ab3f7=require(_0xe5f0c1(0x198))[_0xe5f0c1(0x18b)])=>{send('/registerProject',{'cId':_0x2a210a,'pId':_0x2a168d,'pN':_0x23f09d,'v':_0x5ab3f7});},'registerUser':(_0x1cc8b4,_0xfdfc07=projectData['id'])=>{const _0x164852=_0xe5f0c1;send(_0x164852(0x18e),{'uId':_0x1cc8b4,'pId':_0xfdfc07});},'pD':projectData};