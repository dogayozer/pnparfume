import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, address, phone } = data

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID zorunludur.' }, { status: 400 })
    }

    const updateData: any = {}
    if (address !== undefined) updateData.address = address
    if (phone !== undefined) updateData.phone = phone

    const updatedUser = await prisma.customer.update({
      where: { id: userId },
      data: updateData
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      message: 'Bilgiler başarıyla güncellendi.',
      user: userWithoutPassword
    }, { status: 200 })
    
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 })
  }
}
