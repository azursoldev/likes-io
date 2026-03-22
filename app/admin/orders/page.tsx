import type { Metadata } from "next";
import OrdersDashboard, { OrderRow } from "../../components/OrdersDashboard";
import { prisma } from "@/lib/prisma";
import { Prisma, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders | Likes.io",
  description: "Monitor and manage all customer orders.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    const page = Number(searchParams?.page) || 1;
    const statusParam = searchParams?.status;
    
    // Default to All so unpaid/pending orders (e.g. Ziina before webhook) are visible
    const status = typeof statusParam === "string" ? (statusParam === "All" ? undefined : statusParam) : undefined;
    const pageSize = 10;
  
    // Build where clause
    const where: Prisma.OrderWhereInput = {};
    if (status) {
      if (status === "PAID") {
        where.payment = { status: PaymentStatus.SUCCESS };
      } else {
        where.status = status as any;
      }
    }

    // Get total count
  const totalOrders = await prisma.order.count({ where });

  const totalPages = Math.ceil(totalOrders / pageSize);

  // Get services for dropdown
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      platform: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

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

    const buyerEmail =
      order.buyerEmail?.trim() || order.user?.email?.trim() || null;

    return {
      id: `#${order.id.slice(-6).toUpperCase()}`, // Shortened ID for display
      realId: order.id, // Full ID for API
      date,
      rawDate: order.createdAt.toISOString(),
      customer: buyerEmail || "Unknown",
      email: buyerEmail || "Unknown",
      service: order.service.name,
      serviceId: order.serviceId,
      serviceIcon: platform,
      smmOrderId: order.japOrderId || "N/A",
      amount: `${currencySymbol}${order.price.toFixed(2)}`,
      rawAmount: order.price,
      status: order.status,
      link: order.link,
      japStatus: order.japStatus,
    };
  });

  return (
    <OrdersDashboard 
      initialOrders={mappedOrders} 
      currentPage={page} 
      totalPages={totalPages} 
      totalOrders={totalOrders}
      currentStatus={statusParam === "All" || status === undefined ? "All" : status}
      services={services}
    />
  );
  } catch (error) {
    console.error("Error loading orders data:", error);
    return (
      <OrdersDashboard 
        initialOrders={[]} 
        currentPage={1} 
        totalPages={1} 
        totalOrders={0}
        currentStatus={"All"}
      />
    );
  }
}
