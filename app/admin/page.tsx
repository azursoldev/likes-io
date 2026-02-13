import AdminDashboard from "../components/AdminDashboard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Orders (Count ONLY orders where payment_status = PAID or order_status = COMPLETED)
    const totalOrders = await prisma.order.count({
      where: {
        OR: [
          { payment: { status: "PAID" } },
          { status: "COMPLETED" }
        ]
      }
    });

    // 2. Total Revenue (from orders where payment is PAID or order is COMPLETED)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { price: true },
      where: {
        OR: [
          { payment: { status: "PAID" } },
          { status: "COMPLETED" }
        ]
      },
    });
    const totalRevenue = totalRevenueResult._sum?.price || 0;

    // 3. Daily Revenue
    const dailyRevenueResult = await prisma.order.aggregate({
      _sum: { price: true },
      where: {
        createdAt: { gte: today },
        OR: [
          { payment: { status: "PAID" } },
          { status: "COMPLETED" }
        ]
      },
    });
    const dailyRevenue = dailyRevenueResult._sum?.price || 0;

    // 4. Total Users
    const totalUsers = await prisma.user.count({
      where: { role: "USER" }
    });

    // 5. Sales This Week (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const salesThisWeek = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        OR: [
          { payment: { status: "PAID" } },
          { status: "COMPLETED" }
        ]
      },
      select: {
        price: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group sales by date
    const salesByDate: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      salesByDate[d.toISOString().split('T')[0]] = 0;
    }

    salesThisWeek.forEach(sale => {
      const dateKey = sale.createdAt.toISOString().split('T')[0];
      if (salesByDate[dateKey] !== undefined) {
        salesByDate[dateKey] += sale.price;
      }
    });

    // Ensure we have a point for today even if no sales
    const todayKey = new Date().toISOString().split('T')[0];
    if (salesByDate[todayKey] === undefined) {
      salesByDate[todayKey] = 0;
    }

    const salesChart = Object.entries(salesByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 6. Recent Orders (Fetch all recent orders to allow toggle in dashboard)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        service: true,
        payment: true,
      },
    });

    const mappedOrders = recentOrders.map((order) => ({
      id: order.id,
      customer: order.user?.name || order.user?.email || "Unknown",
      service: order.service.name,
      amount: order.payment?.amount
        ? `$${order.payment.amount.toFixed(2)}`
        : order.price
        ? `$${order.price.toFixed(2)}`
        : "$0.00",
      status: order.status,
      paymentStatus: order.payment?.status || "PENDING",
    }));

    const dashboardData = {
      dailyRevenue,
      totalRevenue,
      totalOrders,
      totalUsers,
      orders: mappedOrders,
      salesChart,
    };

    return <AdminDashboard initialData={dashboardData} />;
  } catch (error) {
    console.error("Error loading admin dashboard data:", error);
    // Return empty dashboard on error
    return <AdminDashboard initialData={{
      dailyRevenue: 0,
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      orders: [],
      salesChart: [],
    }} />;
  }
}
