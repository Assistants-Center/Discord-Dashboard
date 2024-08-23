import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import {
    Dashboard,
    GroupBuilders,
    FormOptionBuilders,
    ResponseStatusBuilders,
} from '../';

import config from './configs/default/discord-dashboard.config';

import BaseTheme from '@discord-dashboard/base-theme';

let dashboardInstance: Dashboard;

beforeAll(async () => {
    dashboardInstance = new Dashboard(config, new BaseTheme());

    await dashboardInstance.start();
});

afterAll(async () => {
    await dashboardInstance.stop();
});

describe('Interfaces validation', () => {
    describe('[Dashboard]', () => {
        test('[Dashboard].start is a function?', () => {
            expect(typeof dashboardInstance.start).toBe('function');
        });

        test('[Dashboard].setUserOptions is a function?', () => {
            expect(typeof dashboardInstance.setUserOptions).toBe('function');
        });

        test('[Dashboard].setGuildOptions is a function?', () => {
            expect(typeof dashboardInstance.setGuildOptions).toBe('function');
        });

        test('[Dashboard].setCustomSessionStore is a function?', () => {
            expect(typeof dashboardInstance.setCustomSessionStore).toBe(
                'function',
            );
        });

        test('[Dashboard].stop is a function?', () => {
            expect(typeof dashboardInstance.stop).toBe('function');
        });
    });

    describe('GroupBuilders', () => {
        test('GroupBuilders is an object?', () => {
            expect(typeof GroupBuilders).toBe('object');
        });

        test('GroupBuilders.User is a function?', () => {
            expect(typeof GroupBuilders.User).toBe('function');
        });

        test('GroupBuilders.Guild is a function?', () => {
            expect(typeof GroupBuilders.Guild).toBe('function');
        });
    });

    describe('FormOptionBuilders', () => {});

    describe('ResponseStatusBuilders', () => {});
});
