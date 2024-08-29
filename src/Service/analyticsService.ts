import { pool } from '../Model/database';

class AnalyticsService {
    async getAnalytics(query: any) {
        const { startDate, endDate, status, priority, type, venue } = query;

        const ticket_details = await pool.query(`
            SELECT uniq_id AS id, title, description, venue, price, due_date, created_by, created_at, updated_at, type, status, priority FROM ticket
        `);

        const filteredTickets = ticket_details.rows.filter(ticket => {
            if (startDate && ticket.created_at < startDate) return false;
            if (endDate && ticket.created_at > endDate) return false;
            if (status && ticket.status !== status) return false;
            if (priority && ticket.priority !== priority) return false;
            if (type && ticket.type !== type) return false;
            if (venue && ticket.venue !== venue) return false;
            return true;
        });
        const analytics = this.generateAnalytics(filteredTickets, startDate, endDate);
        return analytics;
    }

    private generateAnalytics(tickets: any[], startDate?: string, endDate?: string) {
        const totalTickets = tickets.length;
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;

        const priorityDistribution = {
            low: 0,
            averageLowTicketsBookedPerDay: 0,
            medium: 0,
            averageMediumTicketsBookedPerDay: 0,
            high: 0,
            averageHighTicketsBookedPerDay: 0
        };

        tickets.forEach(ticket => {
            if (ticket.priority === 'low') {
                priorityDistribution.low++;
            } else if (ticket.priority === 'medium') {
                priorityDistribution.medium++;
            } else if (ticket.priority === 'high') {
                priorityDistribution.high++;
            }
        });

        if (startDate && endDate) {
            priorityDistribution.averageLowTicketsBookedPerDay = priorityDistribution.low / ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
            priorityDistribution.averageMediumTicketsBookedPerDay = priorityDistribution.medium / ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
            priorityDistribution.averageHighTicketsBookedPerDay = priorityDistribution.high / ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        }

        const typeDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.type] = (acc[ticket.type] || 0) + 1;
            return acc;
        }, {});

        const averageCustomerSpending = tickets.reduce((acc, ticket) => acc + ticket.price, 0) / totalTickets;
        let averageTicketsBookedPerDay = 0;
        if (startDate && endDate) {
            averageTicketsBookedPerDay = totalTickets / ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
            totalTickets,
            closedTickets,
            openTickets,
            inProgressTickets,
            averageCustomerSpending,
            averageTicketsBookedPerDay,
            priorityDistribution,
            typeDistribution
        };
    }
}

export { AnalyticsService };