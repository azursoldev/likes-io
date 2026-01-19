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
  if (!raw) return "All";
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
  return "All";
}

function extractUsername(link: string | null | undefined): string {
  if (!link) return "N/A";

  const trimmed = link.trim();
  if (!trimmed) return "N/A";

  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    const segments = url.pathname.split("/").filter(Boolean);
    let lastSegment = segments[segments.length - 1] || "";

    if (lastSegment.startsWith("@")) {
      lastSegment = lastSegment.slice(1);
    }

    if (lastSegment) {
      return lastSegment;
    }

    return url.hostname;
  } catch {
    const noProtocol = trimmed.replace(/^[a-zA-Z]+:\/\//, "");
    const parts = noProtocol.split("/");
    let lastPart = parts[parts.length - 1] || "";

    if (lastPart.startsWith("@")) {
      lastPart = lastPart.slice(1);
    }

    if (lastPart) {
      return lastPart;
    }

    return trimmed;
  }
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

  const orConditions: Prisma.OrderWhereInput[] = [
    { userId: session.user.id },
  ];

  if (session.user.email) {
    orConditions.push({
      user: {
        email: session.user.email,
      },
    });
  }

  const andConditions: Prisma.OrderWhereInput[] = [
    { OR: orConditions },
  ];

  if (statusWhere) {
    andConditions.push({ status: statusWhere as any });
  }

  const where: Prisma.OrderWhereInput = {
    AND: andConditions,
  };

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

    let paymentType = "N/A";
    let lastFour = "";

    if (order.payment) {
      if (order.payment.gateway === "CHECKOUT_COM") {
        paymentType = "Card";
        lastFour = "****";
      } else if (order.payment.gateway === "CRYPTOMUS") {
        paymentType = "Crypto";
      } else if (order.payment.gateway === "MYFATOORAH") {
        paymentType = "MyFatoorah";
      } else if (order.payment.gateway === "WALLET") {
        paymentType = "Wallet";
      }
    }

    return {
      id: order.id,
      date,
      profile: extractUsername(order.link),
      package: `${order.quantity} ${order.serviceType.toLowerCase()}`,
      currency: order.currency,
      amount: order.price.toFixed(2),
      paidWith: {
        type: paymentType,
        lastFour,
      },
      status: order.status,
      email: order.user.email,
      smmOrderId: order.japOrderId || "N/A",
    };
  });

  return (
    <OrderHistory initialOrders={mappedOrders} initialFilter={statusFilter} />
  );
}

