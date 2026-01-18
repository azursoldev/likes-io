import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { OrderStatus, Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import OrderHistory from "../../components/OrderHistory";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order History | Likes.io",
  description: "View your order history and track your purchases.",
  robots: {
    index: false,
    follow: false,
  },
};

type StatusFilterParam =
  | "All"
  | "Completed"
  | "Processing"
  | "Pending"
  | "Failed"
  | "RefundedCanceled";

function normalizeStatusFilter(raw: string | undefined): StatusFilterParam {
  if (!raw) return "Completed";
  if (
    raw === "All" ||
    raw === "Completed" ||
    raw === "Processing" ||
    raw === "Pending" ||
    raw === "Failed" ||
    raw === "RefundedCanceled"
  ) {
    return raw;
  }
  return "Completed";
}

function buildStatusWhere(
  filter: StatusFilterParam
): Prisma.EnumOrderStatusFilter | OrderStatus | undefined {
  if (filter === "All") return undefined;
  if (filter === "Completed") return "COMPLETED";
  if (filter === "Processing") return "PROCESSING";
  if (filter === "Pending") return "PENDING_PAYMENT";
  if (filter === "Failed") return "FAILED";
  if (filter === "RefundedCanceled") {
    return {
      in: ["REFUNDED", "CANCELLED"],
    } as Prisma.EnumOrderStatusFilter;
  }
  return undefined;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.id) {
    return <OrderHistory initialOrders={[]} initialFilter="Completed" />;
  }

  const rawStatus =
    typeof searchParams?.status === "string" ? searchParams.status : undefined;
  const statusFilter = normalizeStatusFilter(rawStatus);
  const statusWhere = buildStatusWhere(statusFilter);

  const where: Prisma.OrderWhereInput = {
    userId: session.user.id,
  };

  if (statusWhere) {
    where.status = statusWhere as any;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      payment: true,
      service: true,
      user: {
        select: {
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedOrders = orders.map((order) => {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let paymentType = "Unknown";
    let lastFour = "****";

    if (order.payment) {
      if (order.payment.gateway === "CHECKOUT_COM") {
        paymentType = "Card";
        lastFour = "****"; 
      } else if (order.payment.gateway === "CRYPTOMUS") {
        paymentType = "Crypto";
      } else if (order.payment.gateway === "MYFATOORAH") {
        paymentType = "MyFatoorah";
      }
    }

    return {
      id: order.id,
      date,
      profile: order.link || "N/A",
      package: `${order.quantity} ${order.serviceType.toLowerCase()}`, // or use service.name
      currency: order.currency,
      amount: order.price.toFixed(2),
      paidWith: {
        type: paymentType,
        lastFour,
      },
      status: order.status, // We might need to map status if enums don't match exactly
      email: order.user.email,
      smmOrderId: order.japOrderId || "N/A",
    };
  });

  return (
    <OrderHistory initialOrders={mappedOrders} initialFilter={statusFilter} />
  );
}

