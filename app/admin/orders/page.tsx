import type { Metadata } from "next";
import OrdersDashboard, { OrderRow } from "../../components/OrdersDashboard";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Orders | Likes.io",
  description: "Monitor and manage all customer orders.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const status = typeof searchParams.status === "string" && searchParams.status !== "All" ? searchParams.status : undefined;
  const pageSize = 10;
  
  // Build where clause
  const where: Prisma.OrderWhereInput = {};
  if (status) {
    where.status = status as any; // Cast to specific enum if needed
  }

  // Get total count
  const totalOrders = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalOrders / pageSize);

  // Get orders
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      service: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const mappedOrders: OrderRow[] = orders.map((order) => {
    // Format date
    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Determine platform icon
    const platform = order.platform.toLowerCase();
    
    // Format currency
    const currencySymbol = order.currency === "USD" ? "$" : order.currency + " ";

    return {
      id: `#${order.id.slice(-6).toUpperCase()}`, // Shortened ID for display
      date,
      customer: order.user.name || "Unknown",
      email: order.user.email,
      service: order.service.name,
      serviceIcon: platform,
      smmOrderId: order.japOrderId || "N/A",
      amount: `${currencySymbol}${order.price.toFixed(2)}`,
      status: order.status,
    };
  });

  return (
    <OrdersDashboard 
      initialOrders={mappedOrders} 
      currentPage={page} 
      totalPages={totalPages} 
      totalOrders={totalOrders}
      currentStatus={status || "All"}
    />
  );
}
