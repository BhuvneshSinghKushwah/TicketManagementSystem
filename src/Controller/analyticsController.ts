import { Response } from 'express';
import { AnalyticsService } from '../Service/analyticsService';

class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    async getAnalytics(req: any, res: Response) {
        try {
            const analytics = await this.analyticsService.getAnalytics(req.query);
            res.status(200).json(analytics);
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Error Getting Analytics Details', error: error.message });
        }
    }
}

export { AnalyticsController };