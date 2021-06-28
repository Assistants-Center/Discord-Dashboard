const err = (text) => {
    return text + " Do you need help? Join our Discord server: https://discord.gg/CzfMGtrdaA";
}

class Dashboard {
    constructor(config) {
        if(!config.port)throw new Error(err("You need to define the dashboard server port."));
        this.config = config;
    }

    init() {
        const config = this.config;
        const express = require('express');
        const app = express();
        const session = require('express-session');
        const FileStore = require('session-file-store')(session);
        const bodyParser = require('body-parser');
        const partials = require('express-partials');

        app.use(bodyParser.urlencoded({extended : true}));
        app.use(bodyParser.json());
        app.use(partials());

        if(config.theme){
            app.set('views', config.theme.viewsPath);
            app.use(express.static(config.theme.staticPath));
        }else{
            app.set('views', require('path').join(__dirname, '/views/project1'));
            app.use(express.static(require('path').join(__dirname, '/static')));
        }
        app.set('view engine','ejs');

        let sessionIs;

        if(!config.sessionFileStore && config.sessionFileStore != false)config.sessionFileStore = true;

        if(config.sessionFileStore){
            sessionIs = session({
                secret: config.cookiesSecret || 'total_secret_cookie_secret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    expires: new Date(253402300799999),
                    maxAge: 253402300799999,
                },
                store: new FileStore
            });
        }else{
            sessionIs = session({
                secret: config.cookiesSecret || 'total_secret_cookie_secret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    expires: new Date(253402300799999),
                    maxAge: 253402300799999,
                },
            });
        }

        app.use(sessionIs);

        app.get('/docs', (req,res) => {
            res.render('dwd_docs')
        })

        app.use((req,res,next)=>{
            if(!req.body)req.body={};

            req.client = config.client;
            req.redirectUri = config.redirectUri;

            req.websiteTitle = config.websiteTitle || "Discord Web Dashboard";
            req.iconUrl = config.iconUrl || 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png';
            next();
        });

        require('./router')(app);

        app.get('/', (req,res) => {
            res.render('index', {req:req});
        });

        app.get('/manage', (req,res) => {
            if(!req.session.user)return res.redirect('/discord');
            res.render('guilds', {req:req,bot:config.bot});
        });

        app.get('/guild/:id', async (req,res)=>{
            if(!req.session.user)return res.redirect('/discord');
            let bot = config.client;
            if(!bot.guilds.cache.get(req.params.id))return res.redirect('/manage?error=noPermsToManageGuild');
            await bot.guilds.cache.get(req.params.id).members.fetch(req.session.user.id);
            if (!bot.guilds.cache.get(req.params.id).members.cache.get(req.session.user.id).hasPermission('MANAGE_GUILD'))return res.redirect('/manage?error=noPermsToManageGuild');
            let actual = {};
            for(const s of config.settings){
                for(const c of s.categoryOptionsList){
                    if(!actual[s.categoryId]){
                        actual[s.categoryId] = {};
                    }
                    if(!actual[s.categoryId][c.optionId]){
                        actual[s.categoryId][c.optionId] = await c.getActualSet({guild:{id:req.params.id}});
                    }
                }
            }
            res.render('guild', {settings:config.settings,actual:actual,bot:config.bot,req:req});
        });

        app.post('/settings/update/:guildId/:categoryId', async (req,res)=>{
            if(!req.session.user)return res.redirect('/discord');
            let bot = config.client;
            if(!bot.guilds.cache.get(req.params.guildId))return res.redirect('/manage?error=noPermsToManageGuild');
            await bot.guilds.cache.get(req.params.guildId).members.fetch(req.session.user.id);
            if (!bot.guilds.cache.get(req.params.guildId).members.cache.get(req.session.user.id).hasPermission('MANAGE_GUILD'))return res.redirect('/manage?error=noPermsToManageGuild');

            let cid = req.params.categoryId;
            let settings = config.settings;

            let category = settings.find(c=>c.categoryId == cid);

            if(!category)return res.send({error:true,message:"No category found"});

            category.categoryOptionsList.forEach(option=>{
                if(option.optionType.type == "switch"){
                    if(req.body[option.optionId] || req.body[option.optionId] == null || req.body[option.optionId] == undefined){
                        if(req.body[option.optionId] == null || req.body[option.optionId] == undefined){
                            option.setNew({guild:{id:req.params.guildId},newData:false});
                        }else{
                            option.setNew({guild:{id:req.params.guildId},newData:true});
                        }
                    }
                }else{
                    if(req.body[option.optionId] || req.body[option.optionId] == null)option.setNew({guild:{id:req.params.guildId},newData:req.body[option.optionId]});
                }
            });

            return res.redirect('/guild/'+req.params.guildId+'?success=true');
        });

        app.listen(config.port);
    }
}

module.exports = {
    Dashboard: Dashboard,
    formTypes: {
        select: (list, disabled) => {
            if(!list)throw new Error(err("List in the 'select' form type cannot be empty."));
            if(typeof(list) != "object")throw new Error(err("List in the 'select' form type should be an JSON object."));
            let keys = Object.keys(list);
            let values = Object.values(list);
            return {type: "select", data: {keys,values}, disabled: disabled || false};
        },
        input: (placeholder, min, max, disabled, required) => {
            if(min){
                if(isNaN(min))throw new Error(err("'min' in the 'input' form type should be an number."));
            }
            if(max){
                if(isNaN(max))throw new Error(err("'max' in the 'input' form type should be an number."));
            }
            if(min && max){
                if(min>max)throw new Error(err("'min' in the 'input' form type cannot be higher than 'max'."));
            }
            return {type: "input", data: placeholder, min: min || null, max: max || null, disabled: disabled || false, required: required || false};
        },
        textarea: (placeholder, min, max, disabled, required) => {
            if(min){
                if(isNaN(min))throw new Error(err("'min' in the 'input' form type should be an number."));
            }
            if(max){
                if(isNaN(max))throw new Error(err("'max' in the 'input' form type should be an number."));
            }
            if(min && max){
                if(min>max)throw new Error(err("'min' in the 'input' form type cannot be higher than 'max'."));
            }
            return {type: "textarea", data: placeholder, min: min || null, max: max || null, disabled: disabled || false, required: required || false};
        },
        switch: (defaultState, disabled) => {
            if(typeof(defaultState) != 'boolean')throw new Error(err("'state' in the 'switch' form type should be boolean (true/false)."));
            return {type:"switch",data:defaultState,disabled:disabled};
        }
    }
}