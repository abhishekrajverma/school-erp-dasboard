'use client'

import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqs } from '@/lib/landing/content'

export function FaqSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
      </motion.div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
