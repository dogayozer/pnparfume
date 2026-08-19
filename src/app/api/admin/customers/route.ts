import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            items: true
          }
        },
        coupons: {
          select: {
            id: true,
            code: true,
            discount_type: true,
            value: true,
            is_active: true
          }
        }
      }
    })
    
    // Remove password field
    const safeCustomers = customers.map(c => {
      const { password, ...safe } = c
      return safe
    })

    return NextResponse.json(safeCustomers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Müşteriler getirilemedi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { customerId, partner_type, wallet_balance, earned_samples, phone, name, address, profession } = body

    if (!customerId) {
      return NextResponse.json({ error: 'Müşteri ID gereklidir' }, { status: 400 })
    }

    const updateData: any = {}
    if (partner_type !== undefined) updateData.partner_type = partner_type
    if (wallet_balance !== undefined) updateData.wallet_balance = parseFloat(wallet_balance) || 0
    if (earned_samples !== undefined) updateData.earned_samples = parseInt(earned_samples) || 0
    if (phone !== undefined) updateData.phone = phone
    if (name !== undefined) updateData.name = name
    if (address !== undefined) updateData.address = address
    if (profession !== undefined) updateData.profession = profession

    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: updateData,
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        coupons: true
      }
    })

    const { password, ...safeCustomer } = updated

    return NextResponse.json({
      message: 'Müşteri bilgileri başarıyla güncellendi',
      customer: safeCustomer
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Müşteri güncellenemedi' }, { status: 500 })
  }
}
