function _0x5bc9(){const _0x5f2f20=['42955cggQkR','then','application/json','json','48rqynEG','1074NlsLwr','6772959aVGxNd','1347AOJpAW','stringify','/registerProject','GetProjectData','PPManager','name','version','1589861BFwcPQ','1275768WkXMbT','node-fetch','discord-dashboard','catch','9076UWwsWU','25603020yOQsGV','860467LOnhbr','https://dbd-external-stats.assistantscenter.com'];_0x5bc9=function(){return _0x5f2f20;};return _0x5bc9();}function _0x576e(_0x40c8c2,_0x36e751){const _0x5bc965=_0x5bc9();return _0x576e=function(_0x576e92,_0x542fbe){_0x576e92=_0x576e92-0x179;let _0x44139b=_0x5bc965[_0x576e92];return _0x44139b;},_0x576e(_0x40c8c2,_0x36e751);}const _0x1c38a6=_0x576e;(function(_0x430b42,_0x341927){const _0x234659=_0x576e,_0x5646cb=_0x430b42();while(!![]){try{const _0x3b3ff8=parseInt(_0x234659(0x180))/0x1+parseInt(_0x234659(0x17a))/0x2+-parseInt(_0x234659(0x189))/0x3*(parseInt(_0x234659(0x17e))/0x4)+-parseInt(_0x234659(0x182))/0x5*(parseInt(_0x234659(0x187))/0x6)+-parseInt(_0x234659(0x179))/0x7*(parseInt(_0x234659(0x186))/0x8)+parseInt(_0x234659(0x188))/0x9+parseInt(_0x234659(0x17f))/0xa;if(_0x3b3ff8===_0x341927)break;else _0x5646cb['push'](_0x5646cb['shift']());}catch(_0x1f42bd){_0x5646cb['push'](_0x5646cb['shift']());}}}(_0x5bc9,0xd9bf8));const fetch=require(_0x1c38a6(0x17b)),fs=require('fs'),DiscordDashboardPP=require('discord-dashboard-pp-system'),PPManager=new DiscordDashboardPP[(_0x1c38a6(0x18d))]({},{}),projectData=PPManager[_0x1c38a6(0x18c)]();function send(_0x59654e,_0x4ff333){const _0x3f19c1=_0x1c38a6;try{fetch(_0x3f19c1(0x181)+_0x59654e,{'method':'POST','body':JSON[_0x3f19c1(0x18a)](_0x4ff333),'headers':{'Content-Type':_0x3f19c1(0x184)}})[_0x3f19c1(0x183)](_0x5858ef=>_0x5858ef[_0x3f19c1(0x185)]())[_0x3f19c1(0x183)](_0x3dc09c=>{})[_0x3f19c1(0x17d)](_0x122ef8=>{});}catch(_0x301031){}}module['exports']={'registerProject':(_0x1b8b12,_0xd2ef4=projectData['id'],_0xba4215=projectData[_0x1c38a6(0x18e)],_0x25fd29=require(_0x1c38a6(0x17c))[_0x1c38a6(0x18f)])=>{const _0x268900=_0x1c38a6;send(_0x268900(0x18b),{'cId':_0x1b8b12,'pId':_0xd2ef4,'pN':_0xba4215,'v':_0x25fd29});},'registerUser':(_0x482122,_0x5974fd=projectData['id'])=>{send('/registerUser',{'uId':_0x482122,'pId':_0x5974fd});},'pD':projectData};