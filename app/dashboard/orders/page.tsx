import type { Metadata } from "next";
import { getServerSession } from "next-auth";
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

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.id) {
    return <OrderHistory initialOrders={[]} />;
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
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

  // Map Prisma orders to the format expected by OrderHistory
  const mappedOrders = orders.map((order) => {
    // Format date
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Determine payment method details
    let paymentType = "Unknown";
    let lastFour = "****";

    if (order.payment) {
      if (order.payment.gateway === "CHECKOUT_COM") {
        paymentType = "Card";
        // If we had card details stored, we would use them. For now, use generic.
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

  return <OrderHistory initialOrders={mappedOrders} />;
}

