'use client'

import { GripVertical, Plus, PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getAllFaqs } from '@repo/actions/faqs.actions'

import { AddExistingFaqsModal } from './add-existing-faqs-modal'
import { AddNewFaqsModal } from './add-new-faqs-modal'

import type { TFaqsBase } from '@repo/db/schema/faqs'

// Combined FAQ type for display and ordering
export type DisplayFaq = {
  id: string // For DND - use string IDs
  type: 'existing' | 'new'
  faq: TFaqsBase
  order: number
}

// Sortable FAQ Item Component
const SortableFaqItem = ({
  displayFaq,
  onRemove,
  disabled,
}: {
  displayFaq: DisplayFaq
  onRemove: (id: string) => void
  disabled: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: displayFaq.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className='rounded-lg border bg-card p-4'>
      <div className='flex items-start gap-3'>
        <div {...attributes} {...listeners} className='mt-2 cursor-grab active:cursor-grabbing'>
          <GripVertical className='h-4 w-4 text-gray-400' />
        </div>
        <Badge variant={displayFaq.type === 'existing' ? 'secondary' : 'default'}>
          {displayFaq.type === 'existing' ? 'Existing' : 'New'}
        </Badge>
        <div className='flex-1 space-y-2'>
          <div className='text-sm font-medium'>{displayFaq.faq.question}</div>
          <div className='text-xs text-muted-foreground line-clamp-3'>{displayFaq.faq.answer}</div>
        </div>
        <Button type='button' variant='ghost' size='sm' onClick={() => onRemove(displayFaq.id)} disabled={disabled}>
          <X className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

interface FaqManagerProps {
  faqs: DisplayFaq[]
  onFaqsChange: (faqs: DisplayFaq[]) => void
  onFaqIdsChange: (faqIds: number[]) => void
  disabled?: boolean
  title?: string
  createButtonText?: string
  addButtonText?: string
  emptyStateText?: string
}

export const FaqManager = ({
  faqs,
  onFaqsChange,
  onFaqIdsChange,
  disabled = false,
  title = 'FAQs',
  createButtonText = 'Create New FAQs',
  addButtonText = 'Add Existing FAQs',
  emptyStateText = 'No FAQs selected. Use the buttons above to add FAQs.',
}: FaqManagerProps) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddExistingFaqs = (faqIds: number[]) => {
    const fetchFaqsAndAdd = async () => {
      try {
        const allFaqs = await getAllFaqs()
        // @ts-ignore
        const faqsToAdd = allFaqs.filter(faq => faqIds.includes(faq.id))

        // Add to display FAQs with current max order + 1
        const maxOrder = Math.max(0, ...faqs.map(df => df.order))
        const newDisplayFaqs = faqsToAdd.map((faq, index) => ({
          id: `existing-${faq.id}`,
          type: 'existing' as const,
          faq,
          order: maxOrder + index + 1,
        }))

        const updatedFaqs = [...faqs, ...newDisplayFaqs]
        // @ts-ignore
        onFaqsChange(updatedFaqs)

        // Update FAQ IDs
        const currentFaqIds = faqs.map(f => f.faq.id)
        const newFaqIds = faqsToAdd.map(f => f.id)
        // @ts-ignore
        onFaqIdsChange([...currentFaqIds, ...newFaqIds])
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        toast.error('Failed to add FAQs')
      }
    }

    fetchFaqsAndAdd()
  }

  const handleNewFaqsCreated = (newFaqs: TFaqsBase[]) => {
    // Add new FAQs to display list
    const maxOrder = Math.max(0, ...faqs.map(df => df.order))
    const newDisplayFaqs = newFaqs.map((faq, index) => ({
      id: `new-${Date.now()}-${index}`,
      type: 'new' as const,
      faq,
      order: maxOrder + index + 1,
    }))

    const updatedFaqs = [...faqs, ...newDisplayFaqs]
    onFaqsChange(updatedFaqs)

    // Update FAQ IDs
    const currentFaqIds = faqs.map(f => f.faq.id)
    const newFaqIds = newFaqs.map(f => f.id)
    onFaqIdsChange([...currentFaqIds, ...newFaqIds])
  }

  const handleRemoveFaq = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id)
    onFaqsChange(updatedFaqs)

    // Update FAQ IDs
    const updatedFaqIds = updatedFaqs.map(f => f.faq.id)
    onFaqIdsChange(updatedFaqIds)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = faqs.findIndex(item => item.id === active.id)
      const newIndex = faqs.findIndex(item => item.id === over.id)

      const newFaqs = arrayMove(faqs, oldIndex, newIndex)

      // Update order values
      const updatedFaqs = newFaqs.map((faq, index) => ({
        ...faq,
        order: index + 1,
      }))

      onFaqsChange(updatedFaqs)

      // Update FAQ IDs in new order
      const orderedFaqIds = updatedFaqs.map(f => f.faq.id)
      onFaqIdsChange(orderedFaqIds)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <div className='flex space-x-2'>
          <Button type='button' variant='outline' size='sm' onClick={() => setIsNewModalOpen(true)} disabled={disabled}>
            <Plus className='mr-2 h-4 w-4' />
            {createButtonText}
          </Button>
          <Button type='button' variant='outline' size='sm' onClick={() => setIsExistingModalOpen(true)} disabled={disabled}>
            <PlusCircle className='mr-2 h-4 w-4' />
            {addButtonText}
          </Button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className='p-8 text-center text-gray-500 border-2 border-dashed rounded-lg'>{emptyStateText}</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={faqs.map(faq => faq.id)} strategy={verticalListSortingStrategy}>
            <div className='space-y-4'>
              {faqs
                .sort((a, b) => a.order - b.order)
                .map(faq => (
                  <SortableFaqItem key={faq.id} displayFaq={faq} onRemove={handleRemoveFaq} disabled={disabled} />
                ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <AddExistingFaqsModal
        isOpen={isExistingModalOpen}
        onClose={() => setIsExistingModalOpen(false)}
        onAddFaqs={handleAddExistingFaqs}
        selectedFaqIds={faqs.map(f => f.faq.id)}
        title='Add Existing FAQs'
        description='Select existing FAQs to add to this hotel.'
      />

      <AddNewFaqsModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onFaqsCreated={handleNewFaqsCreated}
        title='Create New FAQs'
        description='Create new FAQs that can be reused across hotels.'
      />
    </div>
  )
}
