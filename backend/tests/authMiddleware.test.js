const verifyToken = require('../middleware/authMiddleware');

describe('Auth Middleware', () => {
    it('should return 401 if no token is provided', () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Akses ditolak' });
    });
});