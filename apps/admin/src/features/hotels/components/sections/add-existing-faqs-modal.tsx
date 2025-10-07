'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllFaqs } from '@repo/actions/faqs.actions'

import type { TFaqsBase } from '@repo/db/schema/faqs'

interface AddExistingFaqsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFaqIds: number[]
  onAddFaqs: (faqIds: number[]) => void
  title: string
  description: string
}

export const AddExistingFaqsModal = ({
  isOpen,
  onClose,
  selectedFaqIds,
  onAddFaqs,
  title,
  description,
}: AddExistingFaqsModalProps) => {
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([])
  const [existingFaqs, setExistingFaqs] = useState<TFaqsBase[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load FAQs when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadFaqs = async () => {
        try {
          setIsLoading(true)
          const faqs = await getAllFaqs()
          // @ts-ignore
          setExistingFaqs(faqs)
        } catch (error) {
          console.error('Error loading FAQs:', error)
          toast.error('Failed to load existing FAQs')
        } finally {
          setIsLoading(false)
        }
      }

      loadFaqs()
    }
  }, [isOpen])

  // Filter out FAQs that are already selected
  const availableFaqs = existingFaqs.filter(faq => !selectedFaqIds.includes(faq.id))

  const handleFaqToggle = (faqId: number, checked: boolean) => {
    if (checked) {
      setTempSelectedIds(prev => [...prev, faqId])
    } else {
      setTempSelectedIds(prev => prev.filter(id => id !== faqId))
    }
  }

  const handleAddFaqs = () => {
    if (tempSelectedIds.length > 0) {
      onAddFaqs(tempSelectedIds)
      setTempSelectedIds([])
      onClose()
    }
  }

  const handleCancel = () => {
    setTempSelectedIds([])
    onClose()
  }

  // Reset temp selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTempSelectedIds([])
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='ml-2'>Loading FAQs...</span>
          </div>
        ) : (
          <div className='space-y-4'>
            {availableFaqs.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>No additional FAQs available to add.</p>
            ) : (
              <>
                <div className='text-sm text-muted-foreground'>Select FAQs to add to your hotel:</div>
                <ScrollArea className='h-[400px] border rounded-md p-4'>
                  <div className='space-y-4'>
                    {availableFaqs.map(faq => (
                      <div key={faq.id} className='flex items-start space-x-3 p-3 rounded-lg border bg-card'>
                        <Checkbox
                          id={`modal-faq-${faq.id}`}
                          checked={tempSelectedIds.includes(faq.id)}
                          onCheckedChange={checked => handleFaqToggle(faq.id, !!checked)}
                          className='mt-1'
                        />
                        <div className='flex-1 space-y-2'>
                          <label
                            htmlFor={`modal-faq-${faq.id}`}
                            className='text-sm font-medium leading-tight cursor-pointer'>
                            {faq.question}
                          </label>
                          <div className='text-xs text-muted-foreground line-clamp-3'>{faq.answer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className='text-xs text-muted-foreground'>{tempSelectedIds.length} FAQs selected</div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddFaqs} disabled={tempSelectedIds.length === 0 || availableFaqs.length === 0}>
            Add {tempSelectedIds.length > 0 ? `${tempSelectedIds.length} ` : ''}
            FAQs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
