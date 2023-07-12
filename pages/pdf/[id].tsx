import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from "next-auth/react"

import prisma from '../../lib/prisma';
import { PlanWithItems } from '../../lib/swr';

import dynamic from 'next/dynamic';

const PDFView = dynamic(() => import('../../lib/pdf'), { ssr: false })

interface Plan {
  plan: PlanWithItems
}

const PdfPage: NextPage<Plan> = ({ plan }) => {
  return (
    <PDFView plan={plan} />
  )
}

export default PdfPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session || !ctx.params) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const plan = await prisma.plan.findUnique({
    where: {
      id: String(ctx.params.id),
    },
    include: {
      ScheduledItems: {
        select: {
          Item: true,
          id: true,
          startDate: true,
          endDate: true
        }
      },
    }
  })

  return {
    props: {
      plan: JSON.parse(JSON.stringify(plan))
    }
  }
}