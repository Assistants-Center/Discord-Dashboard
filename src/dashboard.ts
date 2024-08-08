import Fastify, { FastifyInstance } from 'fastify';
import type { Config } from '@discord-dashboard/typings/dist/Config';
import type { Theme } from '@discord-dashboard/typings/dist/Core/Theme';
import type { SessionStore } from '@fastify/session';

import {
    GuildFormOptionGroup,
    UserFormOptionGroup,
} from '@discord-dashboard/typings/dist/FormOptions/FormGroup';
import ConnectMongo from 'connect-mongo';

// Plugins
import AuthorizationPlugin from './plugins/authorization';
import RefreshTokenPlugin from './plugins/refresh-token';
import SwaggerPlugin from './plugins/swagger';

// Routes
import AuthRoute from './routes/auth';
import GuildsRoute from './routes/guilds';
import GuildOptionsRoute from './routes/options/guild';

class Dashboard {
    constructor(
        private config: Config,
        private theme: Theme,
    ) {}

    private readonly fastify: FastifyInstance = Fastify();

    private session_store: SessionStore = ConnectMongo.create({
        mongoUrl: 'mongodb://localhost/dbd-development',
    });

    private options: {
        guild: GuildFormOptionGroup[];
        user: UserFormOptionGroup[];
    } = {
        guild: [],
        user: [],
    };

    public setCustomSessionStore(sessionStore: SessionStore) {
        this.session_store = sessionStore;
        return this;
    }

    public setUserOptions(options: UserFormOptionGroup[]): this {
        this.options.user = options;
        return this;
    }

    public setGuildOptions(options: GuildFormOptionGroup[]): this {
        this.options.guild = options;
        return this;
    }

    private async prepare_plugins() {
        await this.fastify.register(AuthorizationPlugin, {
            api_config: this.config.api,
            store: this.session_store,
        });
        await this.fastify.register(RefreshTokenPlugin, {
            clientId: this.config.discord_oauth2.client_id,
            clientSecret: this.config.discord_oauth2.client_secret,
        });
        await this.fastify.register(SwaggerPlugin);
    }

    private async prepare_routes() {
        await this.fastify.register(AuthRoute, {
            clientId: this.config.discord_oauth2.client_id,
            clientSecret: this.config.discord_oauth2.client_secret,
            redirectUri: `${this.config.api.protocol}://${this.config.api.domain}${
                this.config.api.port == 80 || this.config.api.port == 443
                    ? ''
                    : `:${this.config.api.port}`
            }/api/auth/callback`,
            prefix: '/api/auth',
        });

        await this.fastify.register(GuildsRoute, {
            prefix: '/api/guilds',
            permissions: this.config.api.guild_management.permissions_required,
        });

        await this.fastify.register(GuildOptionsRoute, {
            options: this.options.guild,
            prefix: '/api/options/guild',
        });
    }

    private async inject_theme() {
        await this.theme.inject(this.fastify, this.config, this.options);
    }

    public async start() {
        await this.prepare_plugins();
        await this.prepare_routes();
        await this.inject_theme();

        await this.fastify.listen({
            port: this.config.api.port,
            host: '0.0.0.0',
        });
    }
}

export default Dashboard;
