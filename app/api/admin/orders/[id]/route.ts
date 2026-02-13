
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, link, japOrderId, japStatus, date, email, serviceId, amount } = body;

    // Prepare update data
    const updateData: any = {
      status,
      link,
      japOrderId,
      japStatus,
    };

    // Handle Date update
    if (date) {
      updateData.createdAt = new Date(date);
    }

    // Handle Amount update
    if (amount !== undefined) {
      updateData.price = Number(amount);
    }

    // Handle Service update
    if (serviceId) {
      updateData.serviceId = serviceId;
    }

    // Handle Customer (Email) update
    if (email) {
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: `User with email ${email} not found` },
          { status: 400 }
        );
      }
      updateData.userId = user.id;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    // Also update associated payment if status is set to PROCESSING or COMPLETED
    if (status === "PROCESSING" || status === "COMPLETED") {
      await prisma.payment.updateMany({
        where: { orderId: params.id },
        data: { status: "PAID" },
      });
    }

    // Also update associated payment amount if provided
    if (amount !== undefined) {
      await prisma.payment.updateMany({
        where: { orderId: params.id },
        data: { amount: Number(amount) },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
