import { describe, expect, jest, test } from '@jest/globals';
import { myRouteHandler } from './handlers';  

describe('API Route Testing', () => {
    test('should handle the route correctly', () => {
        const req = {};  
        const res = { json: jest.fn() };  

        myRouteHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: "Hello from myRouteHandler!" });
    });
});
