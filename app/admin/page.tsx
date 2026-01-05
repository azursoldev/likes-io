import AdminDashboard from "../components/AdminDashboard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Total Orders
  const totalOrders = await prisma.order.count();

  // 2. Total Revenue (from completed payments)
  const totalRevenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" },
  });
  const totalRevenue = totalRevenueResult._sum.amount || 0;

  // 3. Daily Revenue
  const dailyRevenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: "SUCCESS",
      createdAt: { gte: today },
    },
  });
  const dailyRevenue = dailyRevenueResult._sum.amount || 0;

  // 4. Total Users
  const totalUsers = await prisma.user.count({
    where: { role: "USER" }
  });

  // 5. Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      service: true,
      payment: true,
    },
  });

  const mappedOrders = recentOrders.map((order) => ({
    id: order.id,
    customer: order.user.name || order.user.email,
    service: order.service.name,
    amount: order.payment?.amount
      ? `$${order.payment.amount.toFixed(2)}`
      : order.price
      ? `$${order.price.toFixed(2)}`
      : "$0.00",
    status: order.status,
  }));

  const dashboardData = {
    dailyRevenue,
    totalRevenue,
    totalOrders,
    totalUsers,
    orders: mappedOrders,
  };

  return <AdminDashboard initialData={dashboardData} />;
}
