import type { Metadata } from "next";
import RevenueDashboard, { TransactionRow, RevenueSummary } from "../../components/RevenueDashboard";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Revenue | Likes.io",
  description: "Track all income and view transaction history.",
};

export default async function Page() {
  try {
    // Fetch all completed payments
    const payments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
      },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate Revenue Summary
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let totalRevenue = 0;

    payments.forEach((payment) => {
      const amount = payment.amount;
      const date = new Date(payment.createdAt);

      totalRevenue += amount;

      if (date >= startOfDay) {
        todayRevenue += amount;
      }
      if (date >= startOfWeek) {
        weekRevenue += amount;
      }
      if (date >= startOfMonth) {
        monthRevenue += amount;
      }
    });

    const summary: RevenueSummary = {
      today: `$${todayRevenue.toFixed(2)}`,
      week: `$${weekRevenue.toFixed(2)}`,
      month: `$${monthRevenue.toFixed(2)}`,
      total: `$${totalRevenue.toFixed(2)}`,
    };

    // Map transactions for the table
    const transactions: TransactionRow[] = payments.map((payment) => {
      // Determine payment method label
      let method = "Card";
      if (payment.gateway === "CRYPTOMUS") method = "Crypto";
      if (payment.gateway === "MYFATOORAH") method = "MyFatoorah";

      return {
        id: payment.transactionId || payment.id,
        date: new Date(payment.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        amount: `$${payment.amount.toFixed(2)}`,
        method,
        status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase(),
        orderId: `#${payment.orderId.slice(-6).toUpperCase()}`,
      };
    });

    return <RevenueDashboard initialTransactions={transactions} summary={summary} />;
  } catch (error) {
    console.error("Error loading revenue data:", error);
    // Return empty dashboard on error
    return <RevenueDashboard />;
  }
}
